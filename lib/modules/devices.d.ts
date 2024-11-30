import { GraphQLClient } from "graphql-request";
import { Device, DeviceUpdateInput } from "../types/device";
export declare class DevicesModule {
    private client;
    constructor(client: GraphQLClient);
    listAll(): Promise<Device[]>;
    findByName(name: string): Promise<Device[]>;
    getById(id: string): Promise<Device>;
    update(id: string, data: DeviceUpdateInput): Promise<Device>;
    delete(id: string): Promise<boolean>;
    reboot(id: string): Promise<boolean>;
    pushContent(id: string, contentId: string, temporary?: boolean): Promise<boolean>;
}
