import axios, { AxiosResponse } from "axios";
import { NextFunction, Request, Response } from "express";
import { BrokerConfig } from "./brother.config";
import { Authenticator } from "../black_box/authenticate";
import { GiantGate } from "../black_box/giantgate";

export class BrokerService {
  public static async broke(
    req: Request,
    res: Response,
  ): Promise<AxiosResponse> {
    const { proxy_config } = req;
    const { require_authentication } = proxy_config;

    const service_url = `${proxy_config.proxy_to}/${proxy_config.proxy_path}`;

    const response = await axios.request({
      url: service_url,
      method: proxy_config.proxy_method,
      data: req.body,
      params: req.params,
      headers: {
        Authorization: require_authentication
          ? req?.headers?.authorization
          : undefined,
        "Content-Type": req.headers["content-type"],
      },
    });

    return response;
  }

  public static service_mapping(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const service_name = req.params.service_name;

    const configs = BrokerConfig.endpoints();

    const config = configs.find((cfg) => cfg.service_name === service_name);

    if (!config) {
      return res.status(404).send({ error: "Service not found" });
    }

    const proxy_path = req.originalUrl.replace(`/${service_name}`, "");
    const proxy_config = { ...config, proxy_path };
    req.proxy_config = proxy_config;

    next();
  }

  public static apply_middleware_policing(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { proxy_config } = req;

    if (proxy_config) {
      const middlewares = [
        Authenticator.authenticate(proxy_config),
        GiantGate.authorize(proxy_config.role_access_level),
        proxy_config.request_engine,
      ];

      try {
        for (const middleware of middlewares) {
          new Promise((resolve, reject) => {
            middleware(req, res, (error) => {
              error ? reject(error) : resolve(null);
            });
          });
        }

        next();
      } catch (error) {
        console.log("Middleware execution error:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    } else {
      next();
    }
  }
}
