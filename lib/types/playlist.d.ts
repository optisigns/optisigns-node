export interface Playlist {
    _id: string;
    name: string;
    items: PlaylistItem[];
}
export interface PlaylistItem {
    assetId: string;
    duration: number;
}
export interface PlaylistCreateInput {
    name: string;
    items: PlaylistItem[];
}
export interface PlaylistUpdateInput {
    name?: string;
    items?: PlaylistItem[];
}
