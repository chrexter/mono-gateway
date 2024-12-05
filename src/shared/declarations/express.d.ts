import { Request, Express } from "express";
import { User } from "../../interfaces/user";

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
