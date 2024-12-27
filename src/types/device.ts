/** Supported media types for device content */
export enum MediaType {
  ASSET = "ASSET",
  PLAYLIST = "PLAYLIST",
  SCHEDULE = "SCHEDULE",
  NONE = "NONE",
}

/** Device screen orientation options */
export enum OrientationType {
  LANDSCAPE = "LANDSCAPE",
  ROTATE_90 = "ROTATE_90",
  ROTATE_180 = "ROTATE_180",
  ROTATE_270 = "ROTATE_270",
}

/** Content scaling options */
export enum ScaleType {
  FIT = "FIT",
  NONE = "NONE",
  FILL = "FILL",
  STRETCH = "STRETCH",
}

/** Types of push-to-screen operations */
export type PushToScreenType = "NOW" | "SCHEDULE" | "TEMPORARILY";

/** Device location information */
export interface DeviceLocation {
  coordinates: [number, number]; // [longitude, latitude]
  name: string;
  place_id: string;
}

/** Core device information */
export interface Device {
  UUID?: string;
  _id?: string;
  accountId?: string;
  activationDate?: Date;
  aiVersion?: string;
  assignItem?: unknown;
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
  currentType?: MediaType;
  device?: string;
  deviceName?: string;
  documentDuration?: number;
  externalStorage?: boolean;
  feature?: unknown;
  featureData?: unknown;
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
  location?: DeviceLocation;
  manufacturer?: string;
  model?: string;
  muted?: boolean;
  name?: string;
  orientation?: OrientationType;
  original?: unknown;
  os?: string;
  osVersion?: string;
  pairingCode?: string;
  path?: string;
  platform?: string;
  pollingInterval?: number;
  preloadId?: string;
  recentAssignments?: unknown[];
  scale?: ScaleType;
  scheduleGoLive?: unknown;
  sendData?: boolean;
  serialNo?: string;
  status?: number;
  statusContent?: string;
  stretchAsset?: boolean;
  syncPlay?: boolean;
  tags?: string[];
  takeScreens?: unknown[];
  teamId?: string;
  temporarily?: unknown;
  totalStorage?: number;
  typeBuild?: string;
  usedStorage?: number;
  utilsOnline?: number;
  utilsVersion?: string;
  videoPlayerType?: string;
}

/** Push to screen configuration interfaces */
export interface PushToScreenPlaylist {
  duration?: number;
  isAppendPlaylist?: boolean;
}

export interface ScheduleGoLiveTime {
  afterExpire?: PushToScreenType;
  expireScheduleTime?: string;
  isCheckExpireTime?: boolean;
  localTimezone: string;
  scheduleTime: string;
}

export interface TemporarilyFlashConfig {
  scheduleTimeMinutes: number;
}

/** Input interfaces for API operations */
export interface PushToScreensInput {
  addToPlaylist?: boolean;
  currentAssetId?: string;
  currentPlaylistId?: string;
  currentScheduleId?: string;
  currentType?: MediaType;
  deviceIds: string[];
  documentDuration?: number;
  engage?: boolean;
  playlistData?: PushToScreenPlaylist;
  scale?: ScaleType;
  scheduleData?: ScheduleGoLiveTime;
  stretchAsset?: boolean;
  tagRules?: string[];
  tags?: string[];
  teamId?: string;
  temporarilyFlashData?: TemporarilyFlashConfig;
  type: PushToScreenType;
}

export interface PushToScreensMutation {
  force?: boolean;
  payload: PushToScreensInput;
  teamId: string;
}

export interface DeviceQuery {
  name?: string;
  _id?: string;
}

export interface PairDeviceInput {
  pairingCode: string;
  path: string;
  teamId: string;
}

export interface UpdateDeviceInput {
  backgroundAWSS3ID?: string;
  backgroundAssetId?: string;
  backgroundBucket?: string;
  backgroundColor?: string;
  backgroundType?: string;
  currentAssetId?: string;
  currentPlaylistId?: string;
  currentScheduleId?: string;
  currentType?: MediaType;
  deviceName?: string;
  documentDuration?: number;
  externalStorage?: boolean;
  feature?: unknown;
  heartbeatInterval?: number;
  location?: DeviceLocation;
  muted?: boolean;
  orientation?: OrientationType;
  path?: string;
  pollingInterval?: number;
  preloadId?: string;
  scale?: ScaleType;
  sendData?: boolean;
  stretchAsset?: boolean;
  syncPlay?: boolean;
  tags?: string[];
  teamId?: string;
  videoPlayerType?: string;
}
