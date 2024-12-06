export interface Device {
  _id: string;
  deviceName: string;
  UUID: string;
  pairingCode: string;
  currentType?: string;
  currentAssetId?: string;
  currentPlaylistId?: string;
localAppVersion?: string;
}

export interface DeviceQueryParams {
  name?: string;
  _id?: string;
}

export interface DeviceUpdateInput {
  deviceName?: string;
  // Add other updatable fields
}
