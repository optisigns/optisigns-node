export interface Device {
  UUID?: string;
  _id?: string;
  accountId?: string;
  activationDate?: Date;
  aiVersion?: string;
  assignItem?: Record<string, any>; // KeyValueItem
  backgroundAWSS3ID?: string;
  backgroundAssetId?: string;
  backgroundAssetName?: string;
  backgroundBucket?: string;
  backgroundColor?: string;
  backgroundType?: string;
  createdAt?: Date;
  createdBy?: string;
  creationDate?: Date;
  currentAssetId?: string;
  currentPlaylistId?: string;
  currentScheduleId?: string;
  currentSelectionDate?: Date;
  currentType?: string;
  device?: string;
  deviceName?: string;
  documentDuration?: number;
  externalStorage?: boolean;
  feature?: Record<string, any>; // JSONObject
  featureData?: Record<string, any>; // JSONObject
  flashAssetId?: string;
  groupId?: string;
  heartbeatInterval?: number;
  isVirtual?: boolean;
  isWebViewer?: boolean;
  lastHeartBeat?: Date;
  lastTeamId?: string;
  lastUpdatedBy?: string;
  lastUpdatedDate?: Date;
  localAppVersion?: string;
  location?: Record<string, any>; // DeviceLocation
  manufacturer?: string;
  model?: string;
  muted?: boolean;
  name?: string;
  orientation?: string;
  original?: Record<string, any>; // JSONObject
  os?: string;
  osVersion?: string;
  pairingCode?: string;
  path?: string;
  platform?: string;
  pollingInterval?: number;
  preloadId?: string;
  recentAssignments?: Record<string, any>[]; // [JSONObject!]
  scale?: string;
  scheduleGoLive?: Record<string, any>; // JSONObject
  sendData?: boolean;
  serialNo?: string;
  status?: number;
  statusContent?: string;
  stretchAsset?: boolean;
  syncPlay?: boolean;
  tags?: string[]; // [String!]
  takeScreens?: Record<string, any>[]; // [JSONObject!]
  teamId?: string;
  temporarily?: Record<string, any>; // JSONObject
  totalStorage?: number;
  typeBuild?: string;
  usedStorage?: number;
  utilsOnline?: number;
  utilsVersion?: string;
  videoPlayerType?: string;
}

export interface DeviceQueryParams {
  name?: string;
  _id?: string;
}

export interface DeviceUpdateInput {
  deviceName?: string;
  // Add other updatable fields
}
