import { GraphQLClient } from "graphql-request";

import {
  Playlist,
  PlaylistInput,
  PlaylistItem,
  SavePlaylistResponse,
  PlaylistMutationInput,
  ModifyPlaylistItemInput,
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
    teamId?: string
  ): Promise<Playlist> {
    // TODO: Implement adding assets to playlist - mutation addPlaylistItems
    throw new Error("Not implemented");
  }

  /**
   * Remove assets from a playlist
   * @param playlistId Playlist ID
   * @param assetIds Array of asset IDs to remove
   * @param teamId Optional team ID
   */
  async removeAssetsFromPlaylist(
    playlistId: string,
    assetIds: string[],
    teamId?: string
  ): Promise<Playlist> {
    // TODO: Implement removing assets from playlist - mutation removePlaylistItems
    throw new Error("Not implemented");
  }

  /**
   * Modify a playlist item's properties
   * @param playlistId Playlist ID
   * @param itemId Playlist item ID
   * @param input ModifyPlaylistItemInput with updated item properties
   * @param teamId Optional team ID
   */
  async modifyPlaylistItem(
    playlistId: string,
    itemId: string,
    input: ModifyPlaylistItemInput,
    teamId?: string
  ): Promise<Playlist> {
    // TODO: Implement modifying playlist item - mutation updatePlaylistItems or movePlaylistItems
    throw new Error("Not implemented");
  }

  /**
   * Delete a playlist
   * @param id Playlist ID to delete
   * @param teamId Optional team ID
   */
  async deletePlaylist(id: string, teamId?: string): Promise<boolean> {
    const mutation = `
    mutation($payload: DeleteObjectInput!, $teamId: String) {
      deleteObjects(payload: $payload, teamId: $teamId)
    }
  `;

    const payload = {
      ids: [id],
      type: "PLAYLIST" as const, // must match the OBJECT_TYPES enum (defined in the graphql docs)
    };

    try {
      const response = await this.client.request<{
        deleteObjects: boolean;
      }>(mutation, { payload, teamId });
      return response.deleteObjects;
    } catch (error: any) {
      throw this.handleGraphQLError(error, "delete asset");
    }
  }
}
