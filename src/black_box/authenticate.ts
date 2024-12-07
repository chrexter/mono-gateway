import { NextFunction, Request, Response } from "express";
import { BrokerConfigInterface } from "../broker/brother.config";

export class Authenticator {
  constructor() {}

  public static authenticate(config: BrokerConfigInterface) {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (!config.require_authentication) return next();

      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).send("Unathorized");

      try {
        // const _ = await axios.post("http://www.example.org/api", req.body, {
        //   headers: { Authorization: req?.headers?.authorization },
        // });

        const data = {
          user: {
            first_name: "Alexander",
            last_name: "Nitiola",
            roles: ["admin"],
          },
        };

        req.user = data.user;

        next();
      } catch (error: any) {
        res.status(error?.status || 401).send({ message: error?.message });
      }
    };
  }
}
