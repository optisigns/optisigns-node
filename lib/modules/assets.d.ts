import { GraphQLClient } from "graphql-request";
import { Asset, AssetCreateInput, AssetUpdateInput } from "../types/asset";
export declare class AssetsModule {
    private client;
    constructor(client: GraphQLClient);
    listAll(): Promise<Asset[]>;
    create(data: AssetCreateInput): Promise<Asset>;
    update(id: string, data: AssetUpdateInput): Promise<Asset>;
    delete(id: string): Promise<boolean>;
}
