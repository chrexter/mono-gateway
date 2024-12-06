import express, {
  Application,
  Request,
  RequestHandler,
  Response,
} from "express";
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
    this.setup_dynamic_proxy_routes();
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

  private setup_dynamic_proxy_routes() {
    this.app.use("/:service_name", BrokerService.service_mapping);
    this.app.use(BrokerService.apply_middleware_policing);
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      this.logger.info(`API Gateway running on port ${port}`);
    });
  }
}

const gateway = new APIGateway();
gateway.start(Number("3000"));
