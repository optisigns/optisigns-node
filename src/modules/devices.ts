import { GraphQLClient } from "graphql-request";
import {
  Device,
  DeviceQueryParams,
  DeviceUpdateInput,
  PairDeviceInput,
} from "../types/device";

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

  // Add custom error class at the top of the class
  private handleGraphQLError(error: any, operation: string): never {
    if (error.response?.errors?.[0]?.message) {
      throw new Error(
        `Failed to ${operation}: ${error.response.errors[0].message}`
      );
    }
    throw new Error(`Failed to ${operation}`);
  }

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
      const response = await this.client.request<{
        devices: { page: { edges: { node: Device }[] } };
      }>(query);
      return response.devices.page.edges.map((edge) => edge.node);
    } catch (error: any) {
      throw this.handleGraphQLError(error, "fetch devices");
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
    try {
      const response = (await this.client.request(query, { name })) as {
        devices: { page: { edges: { node: Device }[] } };
      };
      return response.devices.page.edges.map((edge) => edge.node);
    } catch (error: any) {
      throw this.handleGraphQLError(error, "find device by name");
    }
  }

  async getDeviceById(id: string): Promise<Device> {
    const query = `
      query($id: String!) {
        devices(query: { _id: $id }) {
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
      const response = (await this.client.request(query, { id })) as {
        devices: { page: { edges: { node: Device }[] } };
      };

      const devices = response.devices.page.edges.map((edge) => edge.node);
      if (devices.length === 0) {
        throw new Error(`Device with id ${id} not found`);
      }
      return devices[0];
    } catch (error: any) {
      console.error(error);
      throw this.handleGraphQLError(error, "get device by id");
    }
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
    try {
      // Check if the device exists
      const existingDevice = await this.getDeviceById(id);
      if (!existingDevice) {
        throw new Error(`Device with id ${id} does not exist.`);
      }

      /**
       * TODO: Current playlist id + current schedule id - this is how you takeover the screen (no need to push content)
       * For moving folders updateDevice with PATH in the payload, just go to screens -> devices and check for the device and it's metadata associated with it
       * assign operational schedule is also another field in update screen - feature.scheduleOpsId
       * update content tag rule feature.contentTagRuleId
       */

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
      const response = (await this.client.request(mutation, {
        _id: id,
        ...payload,
      })) as { updateDevice: Device };
      return response.updateDevice;
    } catch (error: any) {
      throw this.handleGraphQLError(error, "update device");
    }
  }

  /**
   * Pairs a device with the given pairing code to a team
   * @param pairingCode - The pairing code displayed on the device
   * @param path - The folder path where the device should appear in app.optisigns.com. Use empty string "" if no folder is needed
   * @param teamId - The team ID to pair the device to
   * @returns The paired device object
   */
  async pairDevice(
    pairingCode: string,
    path: string,
    teamId: string
  ): Promise<Device> {
    const mutation = `
      mutation($payload: PairDeviceInput!, $teamId: String!) {
        pairDevice(payload: $payload, teamId: $teamId) {
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

    const payload: PairDeviceInput = {
      pairingCode,
      path,
      teamId,
    };

    try {
      const response = await this.client.request<{
        pairDevice: Device;
      }>(mutation, {
        payload,
        teamId,
      });
      return response.pairDevice;
    } catch (error: any) {
      throw this.handleGraphQLError(error, "pair device");
    }
  }

  /**
   * Unpairs a device from a team
   * @param id - The ID of the device to unpair
   * @param teamId - The team ID the device is currently paired to
   * @returns A boolean indicating whether the unpair was successful
   */
  async unpairDevice(id: string, teamId: string): Promise<boolean> {
    const mutation = `
      mutation($payload: UnPairDeviceInput!, $teamId: String!) {
        unPairDevices(payload: $payload, teamId: $teamId)
      }
    `;

    try {
      const response = await this.client.request<{
        unPairDevices: boolean;
      }>(mutation, {
        payload: { deviceIds: [id] },
        teamId,
      });

      return response.unPairDevices;
    } catch (error: any) {
      throw this.handleGraphQLError(error, "delete device");
    }
  }

  // TODO: These are phase 2 MDM command
  // async rebootDevice(id: string): Promise<boolean> {
  //   const mutation = `
  //     mutation($id: String!) {
  //       rebootDevice(id: $id)
  //     }
  //   `;
  //   try {
  //     const response = (await this.client.request(mutation, { id })) as {
  //       rebootDevice: boolean;
  //     };
  //     return response.rebootDevice;
  //   } catch (error: any) {
  //     throw this.handleGraphQLError(error, "reboot device");
  //   }
  // }

  // Updated Method
  // async pushContentToDevice(
  //   deviceId: string,
  //   contentId: string,
  //   teamId: string,
  //   type: PushToScreensType = "NOW",
  //   scheduleMinutes?: number,
  //   scheduleTime?: string
  // ): Promise<boolean> {
  //   const mutation = `
  //     mutation PushToScreens($force: Boolean, $payload: PushToScreensInput!, $teamId: String!) {
  //       pushToScreens(force: $force, payload: $payload, teamId: $teamId)
  //     }
  //   `;

  //   const payload: PushToScreensInput = {
  //     deviceIds: [deviceId],
  //     currentAssetId: contentId,
  //     type,
  //     ...(type === "SCHEDULE" &&
  //       scheduleTime && {
  //         scheduleData: {
  //           localTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  //           scheduleTime,
  //         },
  //       }),
  //     ...(type === "TEMPORARILY" &&
  //       scheduleMinutes && {
  //         temporarilyFlashData: {
  //           scheduleTimeMinutes: scheduleMinutes,
  //         },
  //       }),
  //   };

  //   try {
  //     const response = await this.client.request<{
  //       pushToScreens: boolean;
  //     }>(mutation, {
  //       force: type === "TEMPORARILY",
  //       payload,
  //       teamId,
  //     });

  //     return response.pushToScreens;
  //   } catch (error: any) {
  //     // console.log(`PUSH CONTENT TO DEVICEERROR`);
  //     // console.error(error);
  //     throw this.handleGraphQLError(error, "push content to device");
  //   }
  // }
}
