import { GraphQLClient } from "graphql-request";
import { DevicesModule } from "./modules/devices";
import { AssetsModule } from "./modules/assets";
import { PlaylistsModule } from "./modules/playlists";
import { SchedulesModule } from "./modules/schedules";
export class OptiSignsSDK {
    constructor(config) {
        const endpoint = config.endpoint || "https://beta-graphql-gateway.optisigns.com/graphql";
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
        this.playlists = new PlaylistsModule(this.client);
        this.schedules = new SchedulesModule(this.client);
    }
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        }
        catch (_a) {
            return false;
        }
    }
}
