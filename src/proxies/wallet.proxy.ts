import { NextFunction, Request, RequestHandler, Response } from "express";
import { BrokerConfigInterface } from "../broker/brother.config";

export class WalletProxy {
  constructor() {}

  public static broke(config: BrokerConfigInterface): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      res.status(200).send(JSON.stringify({ wallet: { accountable: true } }));
    };
  }
}
