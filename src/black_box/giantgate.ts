import { NextFunction, Request, Response } from "express";

export class GiantGate {
  constructor() {}

  public static authorize(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const user_roles = req?.user?.roles;

      const is_open_service = !user_roles && roles.includes("*");
      if (is_open_service) return next();

      if (roles.some((role) => user_roles.includes(role))) {
        return next();
      }

      res.status(403).send("Forbidden");
    };
  }
}
