import { GraphQLClient } from "graphql-request";

import {
  Playlist,
  PlaylistInput,
  PlaylistItem,
  SavePlaylistResponse,
  PlaylistMutationInput,
  ModifyPlaylistItemInput,
  AddPlaylistItemsInput,
  AddPlaylistItemsResponse,
  RemovePlaylistItemsInput,
  UpdatePlaylistItemInput,
  UpdatePlaylistItemsInput,
} from "../types/playlist";

const SAVE_PLAYLIST_MUTATION = `
mutation SavePlaylist($payload: PlaylistInput!, $teamId: String) {
  savePlaylist(payload: $payload, teamId: $teamId) {
    _id
    accountId
    assetRootId
    assets {
      AWSS3ID
      _id
      appType
      bucket
      commonType
      doc_pages
      duration
      embedLink
      fileSize
      fileType
      filename
      framerate
      height
      iFrameAllow
      isCaption
      isHide
      isPasswordMaster
      javascriptMaxRetries
      javascriptRun
      level22renderEngine
      level22requireUserGesture
      level22simulateTouch
      level25renderEngine
      level25requireUserGesture
      level25simulateTouch
      levelOtherrenderEngine
      levelOtherrequireUserGesture
      levelOthersimulateTouch
      newWebView
      normalDuration
      refreshInterval
      requestDesktopSite
      slideDuration
      speed
      speedValue
      srcDuration
      status
      subType
      thumbnail
      transition
      type
      video_1080p
      video_bitrate
      video_codec
      webLink
      webType
      width
      youtubeType
    }
    color
    contentRotationId
    createdAt
    createdBy
    dropboxId
    googleDriveId
    groupId
    isDisable
    isScheduleDefault
    lastTeamId
    lastUpdatedBy
    lastUpdatedDate
    name
    oneDriveId
    options {
      backgroundAudio
      backgroundAudioAWSS3ID
      backgroundAudioName
      backgroundAudioType
      defaultTransition
      durationLimit
      normalDuration
      scaleDocument
      scaleImage
      scaleVideo
      shuffle
      slideDuration
      speed
      speedValue
      stretchDocuments
      stretchImages
      stretchVideos
    }
    path
    tags
    teamId
    totalDuration
  }
}
`;

const ADD_PLAYLIST_ITEMS_MUTATION = `
mutation($id: String!, $payload: AddPlaylistItemsInput!, $teamId: String) {
  addPlaylistItems(_id: $id, payload: $payload, teamId: $teamId) {
    AWSS3ID
    _id
    appType
    bucket
    commonType
    doc_pages
    duration
    embedLink
    fileSize
    fileType
    filename
    framerate
    height
    iFrameAllow
    isCaption
    isHide
    isPasswordMaster
    javascriptMaxRetries
    javascriptRun
    level22renderEngine
    level22requireUserGesture
    level22simulateTouch
    level25renderEngine
    level25requireUserGesture
    level25simulateTouch
    levelOtherrenderEngine
    levelOtherrequireUserGesture
    levelOthersimulateTouch
    newWebView
    normalDuration
    refreshInterval
    requestDesktopSite
    slideDuration
    speed
    speedValue
    srcDuration
    status
    subType
    thumbnail
    transition
    type
    video_1080p
    video_bitrate
    video_codec
    webLink
    webType
    width
    youtubeType
  }
}
`;

const REMOVE_PLAYLIST_ITEMS_MUTATION = `
mutation($id: String!, $payload: RemovePlaylistItemsInput!, $teamId: String) {
  removePlaylistItems(_id: $id, payload: $payload, teamId: $teamId) {
    AWSS3ID
    _id
    appType
    bucket
    commonType
    doc_pages
    duration
    embedLink
    fileSize
    fileType
    filename
    framerate
    height
    iFrameAllow
    isCaption
    isHide
    isPasswordMaster
    javascriptMaxRetries
    javascriptRun
    level22renderEngine
    level22requireUserGesture
    level22simulateTouch
    level25renderEngine
    level25requireUserGesture
    level25simulateTouch
    levelOtherrenderEngine
    levelOtherrequireUserGesture
    levelOthersimulateTouch
    newWebView
    normalDuration
    refreshInterval
    requestDesktopSite
    slideDuration
    speed
    speedValue
    srcDuration
    status
    subType
    thumbnail
    transition
    type
    video_1080p
    video_bitrate
    video_codec
    webLink
    webType
    width
    youtubeType
  }
}
`;

const UPDATE_PLAYLIST_ITEM_MUTATION = `
mutation($id: String!, $payload: UpdatePlaylistItemsInput!, $teamId: String) {
  updatePlaylistItems(_id: $id, payload: $payload, teamId: $teamId) {
    AWSS3ID
    _id
    appType
    bucket
    commonType
    doc_pages
    duration
    embedLink
    fileSize
    fileType
    filename
    framerate
    height
    iFrameAllow
    isCaption
    isHide
    isPasswordMaster
    javascriptMaxRetries
    javascriptRun
    level22renderEngine
    level22requireUserGesture
    level22simulateTouch
    level25renderEngine
    level25requireUserGesture
    level25simulateTouch
    levelOtherrenderEngine
    levelOtherrequireUserGesture
    levelOthersimulateTouch
    newWebView
    normalDuration
    refreshInterval
    requestDesktopSite
    slideDuration
    speed
    speedValue
    srcDuration
    status
    subType
    thumbnail
    transition
    type
    video_1080p
    video_bitrate
    video_codec
    webLink
    webType
    width
    youtubeType
  }
}
`;

const DELETE_PLAYLIST_MUTATION = `
mutation($payload: DeleteObjectInput!, $teamId: String) {
  deleteObjects(payload: $payload, teamId: $teamId)
}
`;

export class PlaylistsModule {
  constructor(private client: GraphQLClient) {}

  private handleGraphQLError(error: any, operation: string): never {
    if (error.response?.errors?.[0]?.message) {
      throw new Error(
        `Failed to ${operation}: ${error.response.errors[0].message}`
      );
    }
    throw new Error(`Failed to ${operation}`);
  }

  /**
   * Create a new playlist
   * @param input CreatePlaylistInput object containing playlist details
   * @param teamId Optional team ID
   */
  async createPlaylist(
    input: PlaylistMutationInput,
    teamId?: string
  ): Promise<Playlist> {
    try {
      const payload: PlaylistInput = {
        name: input.name,
        teamId,
      };

      const variables = { payload, teamId };
      const data = await this.client.request<SavePlaylistResponse>(
        SAVE_PLAYLIST_MUTATION,
        variables
      );
      return data.savePlaylist;
    } catch (e) {
      this.handleGraphQLError(e, "create playlist");
    }
  }

  /**
   * Edit an existing playlist
   * @param id Playlist ID
   * @param input EditPlaylistInput with updated playlist details
   * @param teamId Optional team ID
   */
  async editPlaylist(
    id: string,
    input: PlaylistMutationInput,
    teamId?: string
  ): Promise<Playlist> {
    try {
      const payload: PlaylistInput = {
        _id: id,
        name: input.name || "Untitled Playlist",
        teamId,
      };

      const variables = { payload, teamId };
      const data = await this.client.request<SavePlaylistResponse>(
        SAVE_PLAYLIST_MUTATION,
        variables
      );
      return data.savePlaylist;
    } catch (e) {
      this.handleGraphQLError(e, "edit playlist");
    }
  }

  /**
   * Add assets to a playlist
   * @param playlistId Playlist ID
   * @param assetIds Array of asset IDs to add
   * @param teamId Optional team ID
   */
  async addAssetsToPlaylist(
    playlistId: string,
    assetIds: string[],
    position: number,
    teamId?: string
  ): Promise<PlaylistItem[]> {
    try {
      const payload: AddPlaylistItemsInput = {
        ids: assetIds,
        pos: position,
        type: "ASSET",
      };

      const variables = { id: playlistId, payload, teamId };
      const data = await this.client.request<AddPlaylistItemsResponse>(
        ADD_PLAYLIST_ITEMS_MUTATION,
        variables
      );

      return data.addPlaylistItems;
    } catch (e) {
      this.handleGraphQLError(e, "add assets to playlist");
    }
  }

  /**
   * Remove assets from a playlist
   * @param playlistId Playlist ID
   * @param assetIds Array of asset IDs to remove
   * @param teamId Optional team ID
   */
  async removeAssetsFromPlaylist(
    playlistId: string,
    pos: number[],
    teamId?: string
  ): Promise<boolean> {
    try {
      const payload: RemovePlaylistItemsInput = {
        pos,
      };

      const variables = { id: playlistId, payload, teamId };
      const data = await this.client.request<{ removePlaylistItems: boolean }>(
        REMOVE_PLAYLIST_ITEMS_MUTATION,
        variables
      );

      return data.removePlaylistItems;
    } catch (e) {
      this.handleGraphQLError(e, "remove assets from playlist");
    }
  }

  /**
   * Set the duration for a playlist item
   * @param playlistId Playlist ID
   * @param duration New duration in seconds
   * @param teamId Optional team ID
   */
  async setPlaylistItemDuration(
    playlistId: string,
    duration: number,
    teamId?: string
  ): Promise<PlaylistItem[]> {
    const input: ModifyPlaylistItemInput = {
      duration,
    };
    return this.modifyPlaylistItem(playlistId, input, teamId);
  }

  /**
   * Change the order/position of a playlist item
   * @param playlistId Playlist ID
   * @param position New position in playlist (0-based index)
   * @param teamId Optional team ID
   */
  async setPlaylistItemOrder(
    playlistId: string,
    position: number,
    teamId?: string
  ): Promise<PlaylistItem[]> {
    const input: ModifyPlaylistItemInput = {
      position,
    };
    return this.modifyPlaylistItem(playlistId, input, teamId);
  }

  /**
   * Modify a playlist item's properties
   * @param playlistId Playlist ID
   * @param input ModifyPlaylistItemInput with updated item properties
   * @param teamId Optional team ID
   * @private
   */
  private async modifyPlaylistItem(
    playlistId: string,
    input: ModifyPlaylistItemInput,
    teamId?: string
  ): Promise<PlaylistItem[]> {
    try {
      // Convert ModifyPlaylistItemInput to UpdatePlaylistItemsInput
      let payload: UpdatePlaylistItemsInput;
      if (input.duration !== undefined) {
        payload = {
          items: [
            {
              item: {
                duration: input.duration,
              },
              pos: [0],
            },
          ],
        };
      } else if (input.position !== undefined) {
        payload = {
          items: [
            {
              item: {},
              pos: [input.position],
            },
          ],
        };
      } else {
        throw new Error("Either duration or position must be provided");
      }

      const variables = {
        id: playlistId,
        payload,
        teamId,
      };

      const data = await this.client.request<{
        updatePlaylistItems: PlaylistItem[];
      }>(UPDATE_PLAYLIST_ITEM_MUTATION, variables);

      return data.updatePlaylistItems;
    } catch (e) {
      this.handleGraphQLError(e, "modify playlist item");
    }
  }

  /**
   * Delete a playlist
   * @param id Playlist ID to delete
   * @param teamId Optional team ID
   */
  async deletePlaylist(id: string, teamId?: string): Promise<boolean> {
    const payload = {
      ids: [id],
      type: "PLAYLIST" as const, // must match the OBJECT_TYPES enum (defined in the graphql docs)
    };

    try {
      const response = await this.client.request<{
        deleteObjects: boolean;
      }>(DELETE_PLAYLIST_MUTATION, { payload, teamId });
      return response.deleteObjects;
    } catch (error: any) {
      throw this.handleGraphQLError(error, "delete asset");
    }
  }
}
