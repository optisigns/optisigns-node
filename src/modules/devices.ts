import { GraphQLClient } from "graphql-request";
import { Device, DeviceQueryParams, DeviceUpdateInput } from "../types/device";

// Move these type definitions to the top of the file, before the class
export type PushToScreensType = "NOW" | "SCHEDULE" | "TEMPORARILY";
export type MediaTypes = "ASSET" | "NONE" | "PLAYLIST" | "SCHEDULE";

export interface TemporarilyFlashDevicesInput {
  scheduleTimeMinutes: number; // Duration in minutes
}

export interface ScheduleGoLiveTimeDevicesInput {
  afterExpire?: PushToScreensType; // Action after expiry
  expireScheduleTime?: string; // Expiration time in ISO format
  isCheckExpireTime?: boolean; // Whether to check expiration time
  localTimezone: string; // Timezone, required
  scheduleTime: string; // Scheduled time in ISO format
}

export interface PushToScreenPlaylistInput {
  duration?: number; // Playlist duration in seconds
  isAppendPlaylist?: boolean; // Whether to append to existing playlist
}

export interface PushToScreensInput {
  addToPlaylist?: boolean;
  currentAssetId?: string;
  currentPlaylistId?: string;
  currentScheduleId?: string;
  currentType?: MediaTypes;
  deviceIds: string[]; // Required: Device or screen IDs
  documentDuration?: number;
  engage?: boolean;
  playlistData?: PushToScreenPlaylistInput;
  scale?: string;
  scheduleData?: ScheduleGoLiveTimeDevicesInput;
  stretchAsset?: boolean;
  tagRules?: string[];
  tags?: string[];
  teamId?: string;
  temporarilyFlashData?: TemporarilyFlashDevicesInput;
  type: PushToScreensType; // Type of push action
}

export interface PushToScreensMutationInput {
  force?: boolean;
  payload: PushToScreensInput;
  teamId: string;
}

export class DevicesModule {
  constructor(private client: GraphQLClient) {}

  // TODO: Update Screen

  // {
  //   code: 200
  //   data: {}
  //   error? extends Error
  // }

  async listAllDevices(): Promise<Device[]> {
    const query = `
      query {
        devices(query: {}) {
          page {
            edges {
              node {
                _id
                deviceName
                UUID
                pairingCode
                currentType
                currentAssetId
                currentPlaylistId
                localAppVersion
              }
            }
          }
        }
      }
    `;
    try {
      const response = (await this.client.request(query)) as {
        devices: { page: { edges: { node: Device }[] } };
      };
      return response.devices.page.edges.map((edge) => edge.node);
    } catch (error: any) {
      if (error.response?.errors?.[0]?.message) {
        throw new Error(error.response.errors[0].message);
      }
      throw error;
    }
  }

  async findByDeviceName(name: string): Promise<Device[]> {
    const query = `
      query($name: String!) {
        devices(query: { deviceName: $name }) {
          page {
            edges {
              node {
                _id
                deviceName
                UUID
                pairingCode
                currentType
                currentAssetId
                currentPlaylistId
                localAppVersion
              }
            }
          }
        }
      }
    `;
    const response = (await this.client.request(query, { name })) as {
      devices: { page: { edges: { node: Device }[] } };
    };
    return response.devices.page.edges.map((edge) => edge.node);
  }

  async getDeviceById(id: string): Promise<Device> {
    const query = `
      query($id: String!) {
        device(id: $id) {
          _id
          deviceName
          UUID
          pairingCode
          currentType
          currentAssetId
          currentPlaylistId
          localAppVersion
        }
      }
    `;
    const response = (await this.client.request(query, { id })) as {
      device: Device;
    };
    return response.device;
  }

  async updateDevice(
    id: string,
    payload: {
      deviceName?: string;
      currentType?: "ASSET" | "PLAYLIST";
      currentAssetId?: string;
      orientation?: "LANDSCAPE" | "PORTRAIT";
    }
  ): Promise<Device> {
    // Check if the device exists
    const existingDevice = await this.getDeviceById(id);
    if (!existingDevice) {
      throw new Error(`Device with id ${id} does not exist.`);
    }

    const mutation = `
      mutation(
        $_id: String!, 
        $deviceName: String,
        $currentType: MEDIA_TYPES,
        $currentAssetId: String,
        $orientation: ORIENTATION_TYPES
      ) {
        updateDevice(
          _id: $_id, 
          payload: {
            deviceName: $deviceName,
            currentType: $currentType,
            currentAssetId: $currentAssetId,
            orientation: $orientation
          }
        ) {
          _id
          deviceName
          currentType
          currentAssetId
          orientation
        }
      }
    `;
    try {
      const response = (await this.client.request(mutation, {
        _id: id,
        ...payload,
      })) as { updateDevice: Device };
      return response.updateDevice;
    } catch (error: any) {
      if (error.response?.errors?.[0]?.message) {
        throw new Error(
          `Failed to update screen: ${error.response.errors[0].message}`
        );
      }
      throw new Error("Failed to update screen");
    }
  }

  async createDevice(payload: {
    deviceName: string;
    currentType?: "ASSET" | "PLAYLIST";
    currentAssetId?: string;
    orientation?: "LANDSCAPE" | "PORTRAIT";
  }): Promise<Device> {
    const existingDevice = await this.findByDeviceName(payload.deviceName);
    if (existingDevice) {
      throw new Error(`Device with name ${payload.deviceName} already exists.`);
    }

    const mutation = `
      mutation(
        $deviceName: String!, 
        $currentType: MEDIA_TYPES,
        $currentAssetId: String,
        $orientation: ORIENTATION_TYPES
      ) {
        upsertDevice(
          payload: {
            deviceName: $deviceName,
            currentType: $currentType,
            currentAssetId: $currentAssetId,
            orientation: $orientation
          }
        ) {
          _id
          deviceName
          UUID
          pairingCode
          currentType
          currentAssetId
          currentPlaylistId
          localAppVersion
          orientation
        }
      }
    `;
    try {
      const response = (await this.client.request(mutation, payload)) as {
        upsertDevice: Device;
      };
      return response.upsertDevice;
    } catch (error: any) {
      if (error.response?.errors?.[0]?.message) {
        throw new Error(
          `Failed to create device: ${error.response.errors[0].message}`
        );
      }
      throw new Error("Failed to create device");
    }
  }

  /**
   * Notes - Cannot use deleteObjects mutation + this only works for unpairing not actual deletion
   */
  async deleteDeviceById(id: string, teamId: string): Promise<boolean> {
    const mutation = `
      mutation($payload: UnPairDeviceInput!, $teamId: String!) {
        unPairDevices(payload: $payload, teamId: $teamId)
      }
    `;

    const payload = {
      deviceIds: [id],
    };

    const response = (await this.client.request(mutation, {
      payload,
      teamId,
    })) as {
      deleteObjects: boolean;
    };

    return response.deleteObjects;
  }

  async rebootDevice(id: string): Promise<boolean> {
    const mutation = `
      mutation($id: String!) {
        rebootDevice(id: $id)
      }
    `;
    const response = (await this.client.request(mutation, { id })) as {
      rebootDevice: boolean;
    };
    return response.rebootDevice;
  }

  // Updated Method
  async pushContentToDevice(
    deviceId: string,
    contentId: string,
    teamId: string,
    type: PushToScreensType = "NOW",
    scheduleMinutes?: number,
    scheduleTime?: string
  ): Promise<boolean> {
    const mutation = `
      mutation PushToScreens(
        $force: Boolean,
        $payload: PushToScreensInput!,
        $teamId: String!
      ) {
        pushToScreens(force: $force, payload: $payload, teamId: $teamId)
      }
    `;

    // Prepare payload based on type
    const payload: PushToScreensInput = {
      deviceIds: [deviceId],
      currentAssetId: contentId,
      type,
    };

    // Add schedule data for scheduled pushes
    if (type === "SCHEDULE" && scheduleTime) {
      payload.scheduleData = {
        localTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        scheduleTime,
      };
    }

    // Add temporarily flash data for temporary pushes
    if (type === "TEMPORARILY" && scheduleMinutes) {
      payload.temporarilyFlashData = {
        scheduleTimeMinutes: scheduleMinutes,
      };
    }

    const variables = {
      force: type === "TEMPORARILY", // Force flag for temporary takeover
      payload,
      teamId,
    };

    try {
      const response = (await this.client.request(mutation, variables)) as {
        pushToScreens: boolean;
      };
      return response.pushToScreens;
    } catch (error) {
      console.error("Error pushing content to device:", error);
      throw new Error("Failed to push content to device");
    }
  }
}
