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
   * @param teamId - Optional Team ID
   */
  async modifyAssetSettings(
    id: string,
    settings: ModifyAssetSettingsInput,
    teamId?: string
  ): Promise<Asset> {
    // Determine asset type and call the appropriate private method
    const assetDetail = await this.getAssetDetail(id, teamId);
    if (assetDetail.type === "file") {
      return this.modifyFileAssetSettings(id, settings, teamId);
    } else if (assetDetail.type === "web") {
      return this.modifyWebsiteAssetSettings(id, settings, teamId);
    }
    throw new Error(`Unsupported asset type: ${assetDetail.type}`);
  }

  // Private method to modify file asset settings
  private async modifyFileAssetSettings(
    id: string,
    settings: ModifyAssetSettingsInput,
    teamId?: string
  ): Promise<Asset> {
    const assetDetail = await this.getAssetDetail(id, teamId); // Get existing asset details
    const mutation = `
      mutation($teamId: String, $payload: SaveAssetInput!) {
        saveAsset(teamId: $teamId, payload: $payload) {
          _id
          name
          type
          url
          metadata
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
          ...assetDetail, // Spread existing asset details
          ...settings, // Include new settings
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
    const assetDetail = await this.getAssetDetail(id, teamId); // Get existing asset details
    const mutation = `
      mutation($teamId: String, $payload: SaveAssetInput!) {
        saveAsset(teamId: $teamId, payload: $payload) {
          _id
          name
          type
          url
          metadata
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
          ...assetDetail, // Spread existing asset details
          ...settings, // Include new settings
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
