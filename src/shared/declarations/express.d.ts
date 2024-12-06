import { Request, Express } from "express";
import { User } from "../../interfaces/user";
import { BrokerConfigInterface } from "../../broker/brother.config";

declare global {
  namespace Express {
    interface Request {
      user: User;
      proxy_config: BrokerConfigInterface;
    }
  }
}
