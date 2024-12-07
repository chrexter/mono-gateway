import { NextFunction, Request, RequestHandler, Response } from "express";
import { BrokerService } from "../broker/broker_service";

export class UserProxy {
  constructor() {}

  public static match(): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const response = await BrokerService.broke(req, res);

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
