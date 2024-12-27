import { GraphQLClient } from "graphql-request";
import { Device, PairDeviceInput, UpdateDeviceInput } from "../types/device";

export class DevicesModule {
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
   * Retrieves all devices accessible to the authenticated user
   * @returns Promise<Device[]> Array of all devices
   * @throws Error if the GraphQL query fails
   */
  async listAllDevices(): Promise<Device[]> {
    const query = `
      query {
        devices(query: {}) {
          page {
            edges {
              node {
                UUID
                _id
                accountId
                activationDate
                aiVersion
                backgroundType
                createdAt
                createdBy
                creationDate
                currentAssetId
                currentPlaylistId
                currentScheduleId
                currentSelectionDate
                currentType
                device
                deviceName
                documentDuration
                externalStorage
                feature
                featureData
                flashAssetId
                groupId
                heartbeatInterval
                isVirtual
                isWebViewer
                lastHeartBeat
                lastTeamId
                lastUpdatedBy
                lastUpdatedDate
                localAppVersion
                location {
                  coordinates
                  name
                  place_id
                }
                manufacturer
                model
                muted
                name
                orientation
                original
                os
                osVersion
                pairingCode
                path
                platform
                pollingInterval
                preloadId
                recentAssignments
                scale
                scheduleGoLive
                sendData
                serialNo
                status
                statusContent
                stretchAsset
                syncPlay
                tags
                takeScreens
                teamId
                temporarily
                totalStorage
                typeBuild
                usedStorage
                utilsOnline
                utilsVersion
                videoPlayerType
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

  /**
   * Searches for devices by name
   * @param name - The device name to search for
   * @returns Promise<Device[]> Array of matching devices
   * @throws Error if the GraphQL query fails
   */
  async getDeviceByName(name: string): Promise<Device[]> {
    const query = `
      query($name: String!) {
        devices(query: { deviceName: $name }) {
          page {
            edges {
              node {
                UUID
                _id
                accountId
                activationDate
                aiVersion
                backgroundType
                createdAt
                createdBy
                creationDate
                currentAssetId
                currentPlaylistId
                currentScheduleId
                currentSelectionDate
                currentType
                device
                deviceName
                documentDuration
                externalStorage
                feature
                featureData
                flashAssetId
                groupId
                heartbeatInterval
                isVirtual
                isWebViewer
                lastHeartBeat
                lastTeamId
                lastUpdatedBy
                lastUpdatedDate
                localAppVersion
                location {
                  coordinates
                  name
                  place_id
                }
                manufacturer
                model
                muted
                name
                orientation
                original
                os
                osVersion
                pairingCode
                path
                platform
                pollingInterval
                preloadId
                recentAssignments
                scale
                scheduleGoLive
                sendData
                serialNo
                status
                statusContent
                stretchAsset
                syncPlay
                tags
                takeScreens
                teamId
                temporarily
                totalStorage
                typeBuild
                usedStorage
                utilsOnline
                utilsVersion
                videoPlayerType
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

  /**
   * Retrieves a device by its ID
   * @param id - The unique identifier of the device
   * @returns Promise resolving to the Device object
   * @throws Error if device is not found or request fails
   */
  async getDeviceById(id: string): Promise<Device> {
    const query = `
      query($id: String!) {
        devices(query: { _id: $id }) {
          page {
            edges {
              node {
                  UUID
                _id
                accountId
                activationDate
                aiVersion
                backgroundType
                createdAt
                createdBy
                creationDate
                currentAssetId
                currentPlaylistId
                currentScheduleId
                currentSelectionDate
                currentType
                device
                deviceName
                documentDuration
                externalStorage
                feature
                featureData
                flashAssetId
                groupId
                heartbeatInterval
                isVirtual
                isWebViewer
                lastHeartBeat
                lastTeamId
                lastUpdatedBy
                lastUpdatedDate
                localAppVersion
                location {
                  coordinates
                  name
                  place_id
                }
                manufacturer
                model
                muted
                name
                orientation
                original
                os
                osVersion
                pairingCode
                path
                platform
                pollingInterval
                preloadId
                recentAssignments
                scale
                scheduleGoLive
                sendData
                serialNo
                status
                statusContent
                stretchAsset
                syncPlay
                tags
                takeScreens
                teamId
                temporarily
                totalStorage
                typeBuild
                usedStorage
                utilsOnline
                utilsVersion
                videoPlayerType
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
      throw this.handleGraphQLError(error, "get device by id");
    }
  }

  private async updateDevice(
    id: string,
    payload: UpdateDeviceInput,
    teamId: string
  ): Promise<Device> {
    try {
      const existingDevice = await this.getDeviceById(id);
      if (!existingDevice) {
        throw new Error(`Device with id ${id} does not exist.`);
      }

      const mutation = `
        mutation($id: String!, $payload: UpdateDeviceInput!, $teamId: String!) {
          updateDevice(_id: $id, payload: $payload, teamId: $teamId) {
            _id
            deviceName
            currentType
            currentAssetId
            currentPlaylistId
            currentScheduleId
            orientation
            path
            feature
            tags
          }
        }
      `;

      const response = (await this.client.request(mutation, {
        id,
        payload,
        teamId,
      })) as { updateDevice: Device };

      return response.updateDevice;
    } catch (error: any) {
      throw this.handleGraphQLError(error, "update device");
    }
  }

  /**
   * Moves a device to a different folder in the OptiSigns folder hierarchy
   * @param id - The ID of the device to move
   * @param folderPath - The target folder path starting with / (e.g. "/Marketing/Displays").
   *                     The folder must already exist. Use "/" for root folder.
   * @param teamId - The team ID that owns the device
   * @returns The updated device object
   * @throws Error if the folder does not exist or if the device cannot be moved
   */
  async moveDeviceToFolder(
    id: string,
    folderPath: string,
    teamId: string
  ): Promise<Device> {
    return this.updateDevice(
      id,
      {
        path: folderPath,
      },
      teamId
    );
  }

  // Helper method to assign operational schedule
  async assignOperationalSchedule(
    id: string,
    scheduleOpsId: string,
    teamId: string
  ): Promise<Device> {
    return this.updateDevice(
      id,
      {
        feature: {
          scheduleOpsId,
        },
      },
      teamId
    );
  }

  // Helper method to update content tag rules
  async updateContentTagRule(
    id: string,
    contentTagRuleId: string,
    teamId: string
  ): Promise<Device> {
    return this.updateDevice(
      id,
      {
        feature: {
          contentTagRuleId,
        },
      },
      teamId
    );
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

  // ============================================
  // TODO: Phase 2 MDM Commands (Planned Features)
  // ============================================

  /**
   * @todo Implement in Phase 2 - MDM command for taking over screen
   */
  // async takeOverScreen(
  //   id: string,
  //   input: {
  //     currentPlaylistId?: string;
  //     currentScheduleId?: string;
  //   },
  //   teamId: string
  // ): Promise<Device> {
  //   return this.updateDevice(
  //     id,
  //     {
  //       currentType: input.currentPlaylistId
  //         ? MEDIA_TYPES.PLAYLIST
  //         : MEDIA_TYPES.SCHEDULE,
  //       currentPlaylistId: input.currentPlaylistId,
  //       currentScheduleId: input.currentScheduleId,
  //     },
  //     teamId
  //   );
  // }

  /**
   * @todo Implement in Phase 2 - MDM command for rebooting device
   */
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

  /**
   * @todo Implement in Phase 2 - MDM command for pushing content
   */
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
