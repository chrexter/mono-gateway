import { NextFunction, Request, RequestHandler, Response } from "express";

export class WalletProxy {
  constructor() {}

  public static match(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      res.status(200).send(JSON.stringify({ wallet: { accountable: true } }));
    };
  }
}
