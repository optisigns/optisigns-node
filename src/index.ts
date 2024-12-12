import { GraphQLClient } from "graphql-request";
import { DevicesModule } from "./modules/devices";
import { AssetsModule } from "./modules/assets";

interface OptiSignsConfig {
  token: string;
  endpoint?: string;
}

export class OptiSigns {
  private client: GraphQLClient;
  public devices: DevicesModule;
  public assets: AssetsModule;

  constructor(config: OptiSignsConfig) {
    if (!config.token || config.token.trim() === "") {
      throw new Error("Token is required");
    }
    const endpoint =
      config.endpoint || "https://graphql-gateway.optisigns.com/graphql";

    if (!this.isValidUrl(endpoint)) {
      throw new Error("Invalid endpoint URL");
    }

    this.client = new GraphQLClient(endpoint, {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    });

    this.devices = new DevicesModule(this.client);
    this.assets = new AssetsModule(this.client);
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
