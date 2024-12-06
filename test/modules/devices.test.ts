import { GraphQLClient } from "graphql-request";
import { DevicesModule } from "../../src/modules/devices";
import {
  mockDevicesList,
  mockDeviceDetails,
  mockErrorResponses,
} from "../fixtures/deviceResponses";

describe("DevicesModule", () => {
  let devicesModule: DevicesModule;
  let mockClient: jest.Mocked<GraphQLClient>;

  beforeEach(() => {
    mockClient = new GraphQLClient("") as jest.Mocked<GraphQLClient>;
    devicesModule = new DevicesModule(mockClient);
  });

  describe("listAll", () => {
    it("should fetch devices list successfully", async () => {
      mockClient.request.mockResolvedValueOnce(mockDevicesList);
      const devices = await devicesModule.listAllDevices();
      expect(devices).toEqual(
        mockDevicesList.devices.page.edges.map((edge) => edge.node)
      );
    });

    it("should handle authentication errors", async () => {
      mockClient.request.mockRejectedValueOnce({
        response: { errors: [{ message: "Invalid authentication token" }] },
      });
      await expect(devicesModule.listAllDevices()).rejects.toThrow(
        "Invalid authentication token"
      );
    });
  });

  describe("findByName", () => {
    it("should find devices by name", async () => {
      const deviceName = "Device 1";
      mockClient.request.mockResolvedValueOnce({
        devices: {
          page: {
            edges: [mockDevicesList.devices.page.edges[0]],
          },
        },
      });

      const devices = await devicesModule.findByDeviceName(deviceName);
      expect(devices[0].deviceName).toBe(deviceName);
    });
  });

  describe("getById", () => {
    it("should fetch device by id", async () => {
      const deviceId = "1";
      mockClient.request.mockResolvedValueOnce({
        device: mockDevicesList.devices.page.edges[0].node,
      });

      const device = await devicesModule.getDeviceById(deviceId);
      expect(device._id).toBe(deviceId);
    });
  });

  describe("update", () => {
    it("should update device successfully", async () => {
      const deviceId = "1";
      const updateData = { deviceName: "Updated Device" };
      const updatedDevice = {
        ...mockDevicesList.devices.page.edges[0].node,
        deviceName: "Updated Device",
      };

      mockClient.request.mockResolvedValueOnce({ updateDevice: updatedDevice });

      const result = await devicesModule.updateDevice(deviceId, updateData);
      expect(result.deviceName).toBe(updateData.deviceName);
    });
  });

  describe("delete", () => {
    it("should delete device successfully", async () => {
      mockClient.request.mockResolvedValueOnce({ deleteDevice: true });
      const result = await devicesModule.deleteDeviceById("1", "1");
      expect(result).toBe(true);
    });
  });

  describe("reboot", () => {
    it("should reboot device successfully", async () => {
      mockClient.request.mockResolvedValueOnce({ rebootDevice: true });
      const result = await devicesModule.rebootDevice("1");
      expect(result).toBe(true);
    });
  });

  describe("pushContent", () => {
    it("should push content to device successfully", async () => {
      mockClient.request.mockResolvedValueOnce({ pushContentToDevice: true });
      const result = await devicesModule.pushContent("1", "content-1", false);
      expect(result).toBe(true);
    });
  });
});
