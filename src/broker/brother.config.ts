import { RequestHandler } from "express";
import { UserProxy } from "../proxies/user.proxy";
import { WalletProxy } from "../proxies/wallet.proxy";
import { ProxyMethods } from "../server";

export interface BrokerConfigInterface {
  service_name: string;
  alias: string;
  broker_path: string;
  proxy_to: string;
  proxy_method: ProxyMethods;
  request_engine: (config: BrokerConfigInterface) => RequestHandler;
  role_access_level: Array<string>;
  require_authentication: boolean;
  require_pin: boolean;
  proxy_path: string | undefined;
}

export class BrokerConfig {
  constructor() {}

  public static endpoints(): Array<BrokerConfigInterface> {
    return [
      {
        service_name: "users",
        alias: "kabani",
        broker_path: "/users",
        proxy_to: "http://www.example.org",
        proxy_method: ProxyMethods.GET,
        request_engine: UserProxy.match,
        role_access_level: ["*"],
        require_authentication: false,
        require_pin: false,
        proxy_path: undefined,
      },
      {
        service_name: "users",
        alias: "thelta",
        broker_path: "/users",
        proxy_to: "http://www.example.org",
        proxy_method: ProxyMethods.POST,
        request_engine: WalletProxy.match,
        role_access_level: ["user", "admin"],
        require_authentication: true,
        require_pin: true,
        proxy_path: undefined,
      },
    ];
  }
}
