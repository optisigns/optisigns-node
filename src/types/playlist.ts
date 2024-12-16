export interface Playlist {
  _id: string;
  accountId?: string;
  assetRootId?: string;
  assets: PlaylistItem[];
  color?: string;
  contentRotationId?: string;
  createdAt: Date;
  createdBy?: string;
  dropboxId?: string;
  googleDriveId?: string;
  groupId?: string;
  isDisable?: boolean;
  isScheduleDefault?: boolean;
  lastTeamId?: string;
  lastUpdatedBy?: string;
  lastUpdatedDate: Date;
  name?: string;
  oneDriveId?: string;
  options?: PlaylistOptions;
  path?: string;
  tags?: string[];
  teamId?: string;
  totalDuration?: number;
}

export interface PlaylistItem {
  AWSS3ID: string;
  _id: string;
  appType: string;
  bucket: string;
  commonType: string;
  doc_pages: string[];
  duration: number;
  embedLink: string;
  fileSize: number;
  fileType: string;
  filename: string;
  framerate: number;
  height: number;
  iFrameAllow: boolean;
  isCaption: boolean;
  isHide: boolean;
  isPasswordMaster: boolean;
  javascriptMaxRetries: number;
  javascriptRun: string;
  level22renderEngine: string;
  level22requireUserGesture: number;
  level22simulateTouch: number;
  level25renderEngine: string;
  level25requireUserGesture: number;
  level25simulateTouch: number;
  levelOtherrenderEngine: string;
  levelOtherrequireUserGesture: number;
  levelOthersimulateTouch: number;
  newWebView: boolean;
  normalDuration: number;
  refreshInterval: number;
  requestDesktopSite: boolean;
  slideDuration: number;
  speed: string;
  speedValue: number;
  srcDuration: number;
  status: string;
  subType: string;
  thumbnail: string;
  transition: string;
  type: string;
  video_1080p: string;
  video_bitrate: number;
  video_codec: string;
  webLink: string;
  webType: string;
  width: number;
  youtubeType: string;
}

// what are these dropboxId, googleDriveId, oneDriveId, etc used for in creating a playlist?
export interface PlaylistInput {
  _id?: string;
  assetRootId?: string;
  color?: string;
  contentRotationId?: string;
  dropboxId?: string;
  googleDriveId?: string;
  groupId?: string;
  isDisable?: boolean;
  isScheduleDefault?: boolean;
  lastTeamId?: string;
  lastUpdatedBy?: string;
  name: string;
  oneDriveId?: string;
  options?: PlaylistOptions;
  path?: string;
  tags?: string[];
  teamId?: string;
}

export interface PlaylistOptions {
  backgroundAudio?: string;
  backgroundAudioAWSS3ID?: string;
  backgroundAudioName?: string;
  backgroundAudioType?: string;
  defaultTransition?: string;
  durationLimit?: number;
  normalDuration?: number;
  scaleDocument?: string;
  scaleImage?: string;
  scaleVideo?: string;
  shuffle?: boolean;
  slideDuration?: number;
  speed?: string;
  speedValue?: number;
  stretchDocuments?: boolean;
  stretchImages?: boolean;
  stretchVideos?: boolean;
}

export interface PlaylistMutationInput {
  _id?: string;
  name: string;
  items?: PlaylistItem[];
  tags?: string[];
  options?: PlaylistOptions;
  color?: string;
  isDisable?: boolean;
}

export interface ModifyPlaylistItemInput {
  duration?: number;
  order?: number;
}

// Add interface for the response type
export interface SavePlaylistResponse {
  savePlaylist: Playlist;
}
