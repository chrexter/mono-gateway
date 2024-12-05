import { RequestHandler } from "express";
import { UserProxy } from "../proxies/user.proxy";
import { WalletProxy } from "../proxies/wallet.proxy";
import { ProxyMethods } from "../server";

export interface BrokerConfigInterface {
  name: string;
  alias: string;
  broker_path: string;
  proxy_to: string;
  proxy_method: ProxyMethods;
  request_engine: (config: BrokerConfigInterface) => RequestHandler;
  role_access_level: Array<string>;
  require_authentication: boolean;
  require_pin: boolean;
}

export class BrokerConfig {
  constructor() {}

  public static endpoints(): Array<BrokerConfigInterface> {
    return [
      {
        name: "google",
        alias: "google-mind",
        broker_path: "/find-google",
        proxy_to: "http://www.example.org",
        proxy_method: ProxyMethods.GET,
        request_engine: UserProxy.match,
        role_access_level: ["*"],
        require_authentication: false,
        require_pin: false,
      },
      {
        name: "users",
        alias: "thelta",
        broker_path: "/users",
        proxy_to: "http://www.example.org",
        proxy_method: ProxyMethods.POST,
        request_engine: WalletProxy.broke,
        role_access_level: ["user", "admin"],
        require_authentication: true,
        require_pin: true,
      },
    ];
  }
}
