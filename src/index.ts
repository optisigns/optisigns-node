import { GraphQLClient } from "graphql-request";
import { DevicesModule } from "./modules/devices";

interface OptiSignsConfig {
  token: string;
  endpoint?: string;
}

export class OptiSignsSDK {
  private client: GraphQLClient;
  public devices: DevicesModule;

  constructor(config: OptiSignsConfig) {
    if (!config.token || config.token.trim() === "") {
      throw new Error("Token is required");
    }
    const endpoint =
      config.endpoint || "https://beta-graphql-gateway.optisigns.com/graphql";

    if (!this.isValidUrl(endpoint)) {
      throw new Error("Invalid endpoint URL");
    }

    this.client = new GraphQLClient(endpoint, {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    });

    this.devices = new DevicesModule(this.client);
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
