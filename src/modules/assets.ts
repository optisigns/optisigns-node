import { GraphQLClient } from "graphql-request";
import { Asset } from "../types/asset";

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
  name?: string;
  metadata?: Record<string, any>;
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

export class AssetsModule {
  constructor(private client: GraphQLClient) {}

  // Custom Error Handler
  private handleGraphQLError(error: any, operation: string): never {
    if (error.response?.errors?.[0]?.message) {
      throw new Error(
        `Failed to ${operation}: ${error.response.errors[0].message}`
      );
    }
    throw new Error(`Failed to ${operation}`);
  }

  /**
   * Create/Upload a file asset
   * @param input - UploadFileInput
   */
  async uploadFileAsset(
    filePath: string,
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
      const file = await fetch(filePath).then((r) => r.blob());
      formData.append("file", file, filePath.split("/").pop());

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

      // Create asset from uploaded file
      const createAssetMutation = `
        mutation saveAsset($payload: AssetInput!, $teamId: String) {
          saveAsset(payload: $payload, teamId: $teamId) {
            _id
            type
            originalFileName
            createdAt
            status
            lastUpdatedDate
            teamId
            path
          }
        }
      `;

      const uploadItem = assembly.uploads[0];
      const assetPayload = {
        type: "file",
        originalFileName: uploadItem.name,
        processId: assembly.assembly_id,
        status: "converting",
        path: null,
      };

      const response = (await this.client.request(createAssetMutation, {
        teamId,
        payload: assetPayload,
      })) as {
        saveAsset: Asset;
      };

      return response.saveAsset;
    } catch (error: any) {
      console.error("Upload File Asset Error:", error); // Log the error for debugging
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
    const mutation = `
      mutation saveAsset($payload: AssetInput!, $teamId: String!) {
        saveAsset(payload: $payload, teamId: $teamId) {
          _id
          type
          originalFileName
          createdAt
          status
          lastUpdatedDate
          teamId
          path
        }
      }
    `;
    try {
      const response = (await this.client.request(mutation, {
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
   */
  async modifyAssetSettings(
    id: string,
    settings: ModifyAssetSettingsInput
  ): Promise<Asset> {
    // TODO
    const mutation = `
      mutation($id: String!, $name: String, $metadata: JSON) {
        updateAsset(_id: $id, payload: { name: $name, metadata: $metadata }) {
          _id
          name
          type
          url
          metadata
          expirationTime
          createdAt
          updatedAt
        }
      }
    `;
    try {
      const response = (await this.client.request(mutation, {
        id,
        ...settings,
      })) as {
        updateAsset: Asset;
      };
      return response.updateAsset;
    } catch (error: any) {
      throw this.handleGraphQLError(error, "modify asset settings");
    }
  }

  /**
   * Schedule an asset to expire
   * @param input - ScheduleAssetExpirationInput
   */
  async scheduleAssetExpiration(
    input: ScheduleAssetExpirationInput
  ): Promise<Asset> {
    // TODO
    const mutation = `
      mutation($assetId: String!, $expirationTime: String!, $actionAfterExpire: String) {
        scheduleAssetExpiration(payload: { assetId: $assetId, expirationTime: $expirationTime, actionAfterExpire: $actionAfterExpire }) {
          _id
          name
          type
          url
          metadata
          expirationTime
          createdAt
          updatedAt
        }
      }
    `;
    try {
      const response = (await this.client.request(mutation, input)) as {
        scheduleAssetExpiration: Asset;
      };
      return response.scheduleAssetExpiration;
    } catch (error: any) {
      throw this.handleGraphQLError(error, "schedule asset expiration");
    }
  }

  /**
   * Delete an asset by ID
   * @param id - Asset ID
   * @param teamId - Team ID for authorization
   */
  async deleteAssetById(id: string, teamId: string): Promise<boolean> {
    // TODO
    const mutation = `
      mutation($id: String!, $teamId: String!) {
        deleteAsset(_id: $id, teamId: $teamId)
      }
    `;
    try {
      const response = await this.client.request<{
        deleteAsset: boolean;
      }>(mutation, { id, teamId });
      return response.deleteAsset;
    } catch (error: any) {
      throw this.handleGraphQLError(error, "delete asset");
    }
  }

  /**
   * Push assets to devices/screens
   * @param payload - PushToScreensInput
   * @param teamId - Team ID
   * @param force - Optional force flag
   */
  async pushAssetsToScreens(
    payload: PushToScreensInput,
    teamId: string,
    force: boolean = false
  ): Promise<boolean> {
    // TODO
    const mutation = `
      mutation PushAssetsToScreens($force: Boolean, $payload: PushToScreensInput!, $teamId: String!) {
        pushToScreens(force: $force, payload: $payload, teamId: $teamId)
      }
    `;
    try {
      const response = await this.client.request<{
        pushToScreens: boolean;
      }>(mutation, {
        force,
        payload,
        teamId,
      });
      return response.pushToScreens;
    } catch (error: any) {
      console.error("PUSH ASSETS TO SCREENS ERROR:", error);
      throw this.handleGraphQLError(error, "push assets to screens");
    }
  }
}
