import { NextFunction, Request, RequestHandler, Response } from "express";
import { BrokerConfigInterface } from "../broker/brother.config";
import axios from "axios";

export class UserProxy {
  constructor() {}

  public static match(config: BrokerConfigInterface): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        // const response = await axios.post(config.proxy_to, req.body, {
        //   headers: { Authorization: req?.headers?.authorization },
        // });

        const data = {
          user: {
            first_name: "Alexander",
            last_name: "Nitiola",
            roles: ["admin"],
          },
        };

        res.status(200).send({ message: "Contact Wallet Service", data });
      } catch (error: any) {
        res.status(error?.status || 401).send({ message: error?.message });
      }
    };
  }
}
