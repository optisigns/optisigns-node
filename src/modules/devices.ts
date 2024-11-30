import { GraphQLClient } from "graphql-request";
import { Device, DeviceQueryParams, DeviceUpdateInput } from "../types/device";

export class DevicesModule {
  constructor(private client: GraphQLClient) {}

  async listAll(): Promise<Device[]> {
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
      const response = await this.client.request(query) as { devices: { page: { edges: { node: Device }[] } } };
      return response.devices.page.edges.map((edge) => edge.node);
    } catch (error: any) {
      if (error.response?.errors?.[0]?.message) {
        throw new Error(error.response.errors[0].message);
      }
      throw error;
    }
  }

  async findByName(name: string): Promise<Device[]> {
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
    const response = await this.client.request(query, { name }) as { devices: { page: { edges: { node: Device }[] } } };
    return response.devices.page.edges.map((edge) => edge.node);
  }

  async getById(id: string): Promise<Device> {
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
    const response = await this.client.request(query, { id }) as { device: Device };
    return response.device;
  }

  async update(id: string, data: DeviceUpdateInput): Promise<Device> {
    const mutation = `
      mutation($id: String!, $data: DeviceUpdateInput!) {
        updateDevice(id: $id, data: $data) {
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
    const response = await this.client.request(mutation, { id, data }) as { updateDevice: Device };
    return response.updateDevice;
  }

  async delete(id: string): Promise<boolean> {
    const mutation = `
      mutation($id: String!) {
        deleteDevice(id: $id)
      }
    `;
    const response = await this.client.request(mutation, { id }) as { deleteDevice: boolean };
    return response.deleteDevice;
  }

  async reboot(id: string): Promise<boolean> {
    const mutation = `
      mutation($id: String!) {
        rebootDevice(id: $id)
      }
    `;
    const response = await this.client.request(mutation, { id }) as { rebootDevice: boolean };
    return response.rebootDevice;
  }

  async pushContent(id: string, contentId: string, temporary: boolean = false): Promise<boolean> {
    const mutation = `
      mutation($id: String!, $contentId: String!, $temporary: Boolean!) {
        pushContentToDevice(id: $id, contentId: $contentId, temporary: $temporary)
      }
    `;
    const response = await this.client.request(mutation, { id, contentId, temporary }) as { pushContentToDevice: boolean };
    return response.pushContentToDevice;
  }
}
