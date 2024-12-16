import { GraphQLClient } from "graphql-request";

import {
  Playlist,
  PlaylistInput,
  PlaylistItem,
  CreatePlaylistInput,
  EditPlaylistInput,
  ModifyPlaylistItemInput,
} from "../types/playlist";

const SAVE_PLAYLIST_MUTATION = `
mutation SavePlaylist($payload: PlaylistInput!, $teamId: String) {
  savePlaylist(payload: $payload, teamId: $teamId) {
    _id
    name
    teamId
    tags
    totalDuration
    assets {
      _id
      assetId
      duration
    }
  }
}
`;

// Add interface for the response type
interface SavePlaylistResponse {
  savePlaylist: Playlist;
}

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
    input: CreatePlaylistInput,
    teamId?: string
  ): Promise<Playlist> {
    try {
      const payload: PlaylistInput = {
        name: input.name,
        assets: input.items || [],
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
    input: EditPlaylistInput,
    teamId?: string
  ): Promise<Playlist> {
    try {
      const payload: PlaylistInput = {
        _id: id,
        name: input.name || "Untitled Playlist",
        assets: input.items || [],
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
    // TODO: Implement adding assets to playlist
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
    // TODO: Implement removing assets from playlist
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
    // TODO: Implement modifying playlist item
    throw new Error("Not implemented");
  }

  /**
   * Delete a playlist
   * @param id Playlist ID to delete
   * @param teamId Optional team ID
   */
  async deletePlaylist(id: string, teamId?: string): Promise<boolean> {
    // TODO: Implement playlist deletion
    throw new Error("Not implemented");
  }
}
