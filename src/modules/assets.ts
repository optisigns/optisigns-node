import { GraphQLClient } from "graphql-request";
import {
  Asset,
  CreateWebsiteAppAssetInput,
  ModifyAssetSettingsInput,
  AssetInput,
} from "../types/asset";

const SAVE_ASSET_MUTATION = `
  mutation saveAsset($payload: AssetInput!, $teamId: String) {
    saveAsset(payload: $payload, teamId: $teamId) {
      AWSS3ID
      _id
      accountId
      advancedOptions
      appType
      assetMeta
      assetRootId
      bucket
      changeContent
      commonType
      confidentLevel
      createdAt
      createdBy
      currentAssetId
      currentPlaylistId
      currentScheduleId
      delay
      doc_pages
      documentDuration
      duration
      durationPage
      embedLink
      engage
      faceSize
      fileExtension
      fileSize
      fileType
      filename
      framerate
      groupId
      height
      iFrameAllow
      isCaption
      isDisable
      isHide
      isScheduleDefault
      isSendDataOnly
      kioskUrl
      lastTeamId
      lastUpdatedBy
      lastUpdatedDate
      leastDuration
      meta
      model
      name
      num_pages
      oldRules
      options
      orientation
      originalAWSS3ID
      originalFileExtension
      originalFileName
      originalFileSize
      path
      placeGeometry
      placeId
      playbackType
      playlistId
      postsType
      preloadKioskUrl
      processId
      refreshInterval
      requestDesktopSite
      restDuration
      returnedUrl
      rules
      scale
      screenZones {
        currentAssetId
        currentPlaylistId
        currentScheduleId
        currentSelectionDate
        currentType
        documentDuration
        fitAsset
        height
        heightPixel
        id
        left
        leftPixel
        name
        playbackType
        scale
        stretchAsset
        top
        topPixel
        width
        widthPixel
      }
      serviceType
      shareTos
      showTouchHereIcon
      snapshotDuration
      snapshotResolution
      socialProfile
      status
      stretchAsset
      subType
      tags
      targetURL
      teamId
      thumbnail
      timeout
      touchIconBlinkingRate
      touchScreenIcon
      touchScreenIconAssetId
      touchScreenIconLocation
      touchScreenIconSize
      touchScreenIconUrl
      touchScreenIconUrlDefault
      type
      updateDisplay
      version
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

export class AssetsModule {
  constructor(private client: GraphQLClient) {}

  /**
   * Handles GraphQL errors in a consistent way across the module
   * @param error - The error object from GraphQL
   * @param operation - Description of the operation that failed
   * @throws Error with formatted message
   */
  private handleGraphQLError(error: any, operation: string): never {
    if (error.response?.errors?.[0]?.message) {
      throw new Error(
        `Failed to ${operation}: ${error.response.errors[0].message}`
      );
    }
    throw new Error(`Failed to ${operation}`);
  }

  /**
   * Create/Upload a file asset from either a local file path or S3 presigned URL
   * @param filePath - Path to local file or S3 presigned URL
   * @param teamId - Team ID to associate the asset with
   * @returns Promise resolving to the created Asset
   */
  async uploadFileAsset(
    filePath: string,
    fileName: string,
    teamId: string = "1"
  ): Promise<Asset> {
    const uploadOptionsQuery = `
      query {
        getFileUploadOptions
      }
    `;

    try {
      // Get upload options from server
      const uploadOptionsResponse = (await this.client.request(
        uploadOptionsQuery
      )) as {
        getFileUploadOptions: {
          params: Record<string, unknown>;
          signature: string;
        };
      };
      const uploadOptions = uploadOptionsResponse.getFileUploadOptions;

      const formData = new FormData();
      formData.append("params", JSON.stringify(uploadOptions.params));
      formData.append("signature", uploadOptions.signature);

      // Read and append file
      let file: Blob;
      let filename: string;

      // Check if filePath is a URL or local file path
      if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
        file = await fetch(filePath).then((r) => r.blob());
        filename = filePath.split("/").pop() || "unknown";
      } else {
        // Handle local file path
        const fs = require('fs');
        const path = require('path');
        const absolutePath = path.resolve(filePath);
        const buffer = fs.readFileSync(absolutePath);
        file = new Blob([buffer]);
        filename = path.basename(filePath);
      }

      formData.append("file", file, filename);

      // Upload file
      const uploadResponse = await fetch(
        "https://api2.transloadit.com/assemblies",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        const errorDetails = await uploadResponse.text(); // Get response text for debugging
        throw new Error(
          `Upload failed: ${uploadResponse.statusText}. Details: ${errorDetails}`
        );
      }

      const assembly = await uploadResponse.json();

      // Replace the duplicate mutation with SAVE_ASSET_MUTATION
      const uploadItem = assembly.uploads[0];
      const assetPayload = {
        type: "file",
        originalFileName: fileName,
        processId: assembly.assembly_id,
        status: "converting",
        path: null,
      };

      const response = (await this.client.request(SAVE_ASSET_MUTATION, {
        teamId,
        payload: assetPayload,
      })) as {
        saveAsset: Asset;
      };

      return response.saveAsset;
    } catch (error: any) {
      console.error("Upload File Asset Error:", error);
      throw this.handleGraphQLError(error, "upload file asset");
    }
  }

  /**
   * Create a Website App Asset
   * @param input - CreateWebsiteAppAssetInput
   */
  async createWebsiteAppAsset(
    input: CreateWebsiteAppAssetInput,
    teamId: string
  ): Promise<Asset> {
    try {
      const response = (await this.client.request(SAVE_ASSET_MUTATION, {
        teamId: teamId,
        payload: {
          type: "web",
          subType: "static",
          path: null,
          webLink: input.url,
          originalFileName: input.title,
          fileType: "web",
          webType: "website",
        },
      })) as {
        saveAsset: Asset;
      };
      return response.saveAsset;
    } catch (error: any) {
      throw this.handleGraphQLError(error, "create website app asset");
    }
  }

  /**
   * Modify asset settings
   * @param id - Asset ID
   * @param settings - ModifyAssetSettingsInput
   * @param teamId - Optional Team ID
   */
  async modifyAssetSettings(
    id: string,
    settings: Partial<AssetInput>,
    teamId?: string
  ): Promise<Asset> {
    // Determine asset type and call the appropriate private method
    // const assetDetail = await this.getAssetDetail(id, teamId);
    return this.modifyFileAssetSettings(id, settings, teamId);
    // if (assetDetail.type === "file") {
    //   return this.modifyFileAssetSettings(id, settings, teamId);
    // } else if (assetDetail.type === "web") {
    //   return this.modifyWebsiteAssetSettings(id, settings, teamId);
    // }
    // throw new Error(`Unsupported asset type: ${assetDetail.type}`);
  }

  // Private method to modify file asset settings
  private async modifyFileAssetSettings(
    id: string,
    settings: Partial<AssetInput>,
    teamId?: string
  ): Promise<Asset> {
    // const assetDetail = await this.getAssetDetail(id, teamId); // Get existing asset details
    try {
      const response = (await this.client.request(SAVE_ASSET_MUTATION, {
        teamId: teamId,
        payload: {
          ...settings,
        },
      })) as {
        saveAsset: Asset;
      };
      return response.saveAsset;
    } catch (error: any) {
      console.error("Modify File Asset Settings Error:", error);
      throw this.handleGraphQLError(error, "modify file asset settings");
    }
  }

  // Private method to modify website asset settings
  private async modifyWebsiteAssetSettings(
    id: string,
    settings: ModifyAssetSettingsInput,
    teamId?: string
  ): Promise<Asset> {
    console.log("🔥 Modifying website asset settings:", settings);
    // const assetDetail = await this.getAssetDetail(id, teamId); // Get existing asset details
    try {
      const response = (await this.client.request(SAVE_ASSET_MUTATION, {
        teamId: teamId,
        payload: {
          ...settings,
        },
      })) as {
        saveAsset: Asset;
      };
      return response.saveAsset;
    } catch (error: any) {
      throw this.handleGraphQLError(error, "modify website asset settings");
    }
  }

  // Private method to get asset details
  private async getAssetDetail(id: string, teamId?: string): Promise<Asset> {
    const query = `
      query($id: String!, $teamId: String) {
        getAssetDetail(_id: $id, teamId: $teamId)
      }
    `;

    try {
      const assetResponse = (await this.client.request(query, {
        id,
        teamId,
      })) as {
        getAssetDetail: Asset;
      };

      if (!assetResponse.getAssetDetail) {
        throw new Error(`Asset with id ${id} not found`);
      }

      return assetResponse.getAssetDetail;
    } catch (error: any) {
      throw this.handleGraphQLError(error, "get asset detail");
    }
  }

  /**
   * Delete an asset by ID using deleteObjects mutation
   * @param id - Asset ID
   * @param teamId - Team ID for authorization
   */
  async deleteAssetById(id: string, teamId: string): Promise<boolean> {
    const mutation = `
      mutation($payload: DeleteObjectInput!, $teamId: String) {
        deleteObjects(payload: $payload, teamId: $teamId)
      }
    `;

    const payload = {
      ids: [id],
      type: "ASSET" as const, // must match the OBJECT_TYPES enum (defined in the graphql docs)
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
