import axios from "axios";
import { Request, Response } from "express";
import { BrokerConfigInterface } from "./brother.config";

export class BrokerService {
  public static async broke(
    req: Request,
    res: Response,
    config: BrokerConfigInterface
  ) {
    const [service_name, service_slug] = this.extract_base_url(req.originalUrl);

    // const response = await axios.request(req.);
  }

  private static trim_string = (
    characters: string,
    replace_with: string = ""
  ) => {
    return characters.replace(/^\//, replace_with).replace(/\/$/, replace_with);
  };

  public static extract_base_url(url: string) {
    const [base, ...slugs] = this.trim_string(url).split("/");
    return [base, slugs.join("/") ?? null];
  }
}
