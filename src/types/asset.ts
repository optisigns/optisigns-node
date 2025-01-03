export type Asset = {
  AWSS3ID?: string;
  _id: string;
  accountId?: string;
  advancedOptions?: Record<string, unknown>;
  appType?: string;
  assetMeta?: Record<string, unknown>;
  assetRootId?: string;
  bucket?: string;
  changeContent?: string;
  commonType?: string;
  confidentLevel?: number;
  createdAt?: Date;
  createdBy?: string;
  currentAssetId?: string;
  currentPlaylistId?: string;
  currentScheduleId?: string;
  delay?: number;
  doc_pages?: string[];
  documentDuration?: number;
  duration?: number;
  durationPage?: number;
  embedLink?: string;
  engage?: boolean;
  faceSize?: number;
  fileExtension?: string;
  fileSize?: number;
  fileType?: string;
  filename?: string;
  framerate?: number;
  groupId?: string;
  height?: number;
  iFrameAllow?: boolean;
  isCaption?: boolean;
  isDisable?: boolean;
  isHide?: boolean;
  isScheduleDefault?: boolean;
  isSendDataOnly?: boolean;
  kioskUrl?: string;
  lastTeamId?: string;
  lastUpdatedBy?: string;
  lastUpdatedDate?: Date;
  leastDuration?: number;
  meta?: Record<string, any>;
  model?: string;
  name?: string;
  num_pages?: number;
  oldRules?: Record<string, unknown>[];
  options?: Record<string, unknown>;
  orientation?: string;
  originalAWSS3ID?: string;
  originalFileExtension?: string;
  originalFileName?: string;
  originalFileSize?: number;
  path?: string;
  placeGeometry?: string;
  placeId?: string;
  playbackType?: string;
  playlistId?: string;
  postsType?: string;
  preloadKioskUrl?: boolean;
  processId?: string;
  refreshInterval?: number;
  requestDesktopSite?: boolean;
  restDuration?: number;
  returnedUrl?: string;
  rules?: Record<string, unknown>[];
  scale?: string;
  screenZones?: ScreenZone[];
  serviceType?: string;
  shareTos?: string[];
  showTouchHereIcon?: boolean;
  snapshotDuration?: number;
  snapshotResolution?: string;
  socialProfile?: string;
  status?: string;
  stretchAsset?: boolean;
  subType?: string;
  tags?: string[];
  targetURL?: string;
  teamId?: string;
  thumbnail?: string;
  timeout?: number;
  touchIconBlinkingRate?: number;
  touchScreenIcon?: string;
  touchScreenIconAssetId?: string;
  touchScreenIconLocation?: string;
  touchScreenIconSize?: number;
  touchScreenIconUrl?: string;
  touchScreenIconUrlDefault?: string;
  type?: string;
  updateDisplay?: boolean;
  version?: string;
  video_1080p?: string;
  video_bitrate?: number;
  video_codec?: string;
  webLink?: string;
  webType?: string;
  width?: number;
  youtubeType?: string;
};

export type ScreenZone = {
  currentAssetId?: string;
  currentPlaylistId?: string;
  currentScheduleId?: string;
  currentSelectionDate?: Date;
  currentType?: string;
  documentDuration?: number;
  fitAsset?: boolean;
  height?: number;
  heightPixel?: number;
  id?: string;
  left?: number;
  leftPixel?: number;
  name?: string;
  playbackType?: string;
  scale?: string;
  stretchAsset?: boolean;
  top?: number;
  topPixel?: number;
  width?: number;
  widthPixel?: number;
};

export type AssetInput = {
  _id?: string;
  accountId?: string;
  advancedOptions?: Record<string, unknown>;
  appType?: string;
  assetMeta?: Record<string, unknown>;
  assetRootId?: string;
  changeContent?: string;
  commonType?: string;
  confidentLevel?: number;
  createdAt?: Date;
  createdBy?: string;
  currentAssetId?: string;
  currentPlaylistId?: string;
  delay?: number;
  documentDuration?: number;
  duration?: number;
  engage?: boolean;
  faceSize?: number;
  fileSize?: number;
  fileType?: string;
  groupId?: string;
  iFrameAllow?: boolean;
  isSendDataOnly?: boolean;
  kioskUrl?: string;
  lastTeamId?: string;
  lastUpdatedBy?: string;
  lastUpdatedDate?: Date;
  leastDuration?: number;
  meta?: Record<string, unknown>;
  model?: string;
  oldRules?: Record<string, unknown>[];
  options?: Record<string, unknown>;
  orientation?: string;
  originalFileExtension?: string;
  originalFileName?: string;
  originalFileSize?: number;
  path?: string;
  playbackType?: string;
  playlistId?: string;
  preloadKioskUrl?: boolean;
  processId?: string;
  restDuration?: number;
  returnedUrl?: string;
  rules?: Record<string, unknown>[];
  scale?: string;
  screenZones?: ScreenZone[];
  serviceType?: string;
  shareTos?: string[];
  showTouchHereIcon?: boolean;
  status?: string;
  stretchAsset?: boolean;
  subType?: string;
  teamId?: string;
  timeout?: number;
  touchIconBlinkingRate?: number;
  touchScreenIcon?: string;
  touchScreenIconAssetId?: string;
  touchScreenIconLocation?: string;
  touchScreenIconSize?: number;
  touchScreenIconUrl?: string;
  touchScreenIconUrlDefault?: string;
  type?: string;
  updateDisplay?: boolean;
  webLink?: string;
  webType?: string;
};

// Type Definitions
export type AssetCategory = "IMAGE" | "VIDEO" | "WEBSITE" | "YOUTUBE";

export interface UploadFileInput {
  fileName: string;
  fileType: string;
  fileContent: string; // Base64 encoded string
}

export interface CreateWebsiteAppAssetInput {
  url: string;
  title: string;
  description?: string;
}

export interface ModifyAssetSettingsInput {
  // name?: string;
  metadata?: Partial<AssetInput>;
  // Add other settings as needed based on asset type
}

export interface ScheduleAssetExpirationInput {
  assetId: string;
  expirationTime: string; // ISO format
  actionAfterExpire?: "DELETE" | "ARCHIVE" | "NONE";
  [key: string]: any;
}

export interface PushToScreensInput {
  // Include if assets need to be pushed to screens
  deviceIds: string[];
  assetIds: string[];
  // Other relevant fields
}

export interface PushToScreensMutationInput {
  force?: boolean;
  payload: PushToScreensInput;
  teamId: string;
}

// Device Type Definition

export interface Variables {
  [key: string]: any;
}
