import { DevicesModule } from "./modules/devices";
import { AssetsModule } from "./modules/assets";
import { PlaylistsModule } from "./modules/playlists";
import { SchedulesModule } from "./modules/schedules";
interface OptiSignsConfig {
    token: string;
    endpoint?: string;
}
export declare class OptiSignsSDK {
    private client;
    devices: DevicesModule;
    assets: AssetsModule;
    playlists: PlaylistsModule;
    schedules: SchedulesModule;
    constructor(config: OptiSignsConfig);
    private isValidUrl;
}
export {};
