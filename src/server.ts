import express, { Application, RequestHandler } from "express";
import { Container } from "inversify";
import cors from "cors";
import helmet from "helmet";
import Logger from "bunyan";
import bunyan from "bunyan";
import bunyan_middleware from "./utils/bunyan.logger";
import { Authenticator } from "./black_box/authenticate";
import { GiantGate } from "./black_box/giantgate";
import { BrokerConfig } from "./broker/brother.config";
import { BrokerService } from "./broker/broker_service";

export enum ProxyMethods {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
  PATCH = "patch",
  OPTIONS = "options",
}

class APIGateway {
  public app: Application;
  private container: Container;
  private logger: Logger;

  constructor() {
    this.app = express();
    this.container = new Container();

    this.logger = bunyan.createLogger({
      name: "Mono-Gateway",
      level: "debug",
      serializers: bunyan.stdSerializers,
    });

    this.initialize_middlewares();
    this.setup_proxy_routes();
  }

  private initialize_middlewares() {
    this.app.use((req, res, next) => {
      bunyan_middleware(req, res, next, this.logger);
      next();
    });

    this.app.use(cors);
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setup_proxy_routes() {
    this.app.use((req, res, next) => {
      const [service_name, _] = BrokerService.extract_base_url(req.originalUrl);

      next();
    });

    const configs = BrokerConfig.endpoints();

    configs.map((config) => {
      this.setup_dynamic_route(
        config.proxy_method,
        config.broker_path,
        Authenticator.authenticate(config),
        GiantGate.authorize(config.role_access_level),
        config.request_engine(config)
      );
    });

    // this.app.post(
    //   "/user",
    //   Authenticator.authenticate,
    //   GiantGate.authorize(["admin", "user"]),
    //   UserProxy.broke,
    // );

    // this.app.post(
    //   "/wallet",
    //   Authenticator.authenticate,
    //   GiantGate.authorize(["admin"]),
    //   WalletProxy.broke,
    // );
  }

  private setup_dynamic_route(
    method: ProxyMethods,
    path: string,
    authenticator: RequestHandler,
    authorizer: RequestHandler,
    request_engine: RequestHandler
  ) {
    if (typeof this.app[method] === "function") {
      this.app[method](path, authenticator, authorizer, request_engine);
    } else {
      throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      this.logger.info(`API Gateway running on port ${port}`);
    });
  }
}

const gateway = new APIGateway();
gateway.start(Number("3000"));
