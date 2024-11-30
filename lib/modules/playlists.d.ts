import { GraphQLClient } from "graphql-request";
import { Playlist, PlaylistCreateInput, PlaylistUpdateInput } from "../types/playlist";
export declare class PlaylistsModule {
    private client;
    constructor(client: GraphQLClient);
    listAll(): Promise<Playlist[]>;
    create(data: PlaylistCreateInput): Promise<Playlist>;
    update(id: string, data: PlaylistUpdateInput): Promise<Playlist>;
    delete(id: string): Promise<boolean>;
}
