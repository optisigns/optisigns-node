export interface Asset {
    _id: string;
    name: string;
    type: string;
    url: string;
}
export interface AssetCreateInput {
    name: string;
    type: string;
    url: string;
}
export interface AssetUpdateInput {
    name?: string;
    type?: string;
    url?: string;
}
