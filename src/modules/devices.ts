import { GraphQLClient } from "graphql-request";
import { Device, DeviceQueryParams, DeviceUpdateInput } from "../types/device";

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

  async pushContent(
    id: string,
    contentId: string,
    temporary: boolean = false
  ): Promise<boolean> {
    const mutation = `
      mutation($id: String!, $contentId: String!, $temporary: Boolean!) {
        pushContentToDevice(id: $id, contentId: $contentId, temporary: $temporary)
      }
    `;
    const response = (await this.client.request(mutation, {
      id,
      contentId,
      temporary,
    })) as { pushContentToDevice: boolean };
    return response.pushContentToDevice;
  }
}
