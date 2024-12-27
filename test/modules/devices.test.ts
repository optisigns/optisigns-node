import { GraphQLClient } from "graphql-request";
import { DevicesModule } from "../../src/modules/devices";
import {
  mockDevicesList,
  mockDeviceDetails,
  mockErrorResponses,
} from "../fixtures/deviceResponses";
import { Device } from "../../src/types/device";

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

      const devices = await devicesModule.getDeviceByName(deviceName);
      expect(devices[0].deviceName).toBe(deviceName);
    });
  });

  describe("getById", () => {
    it("should fetch device by id", async () => {
      const deviceId = "1";
      mockClient.request.mockResolvedValueOnce({
        devices: mockDevicesList.devices,
      });

      const device = await devicesModule.getDeviceById(deviceId);
      expect(device._id).toBe(deviceId);
    });
  });

  describe("delete", () => {
    it("should delete device successfully", async () => {
      mockClient.request.mockResolvedValueOnce({ deleteDevice: undefined });
      const result = await devicesModule.unpairDevice("1", "1");
      expect(result).toBeUndefined();
    });

    it("should handle errors when deleting device", async () => {
      mockClient.request.mockRejectedValueOnce(new Error("Delete failed"));
      await expect(devicesModule.unpairDevice("1", "1")).rejects.toThrow();
    });
  });

  describe("moveDeviceToFolder", () => {
    it("should move device to new folder successfully", async () => {
      const deviceId = "1";
      const folderPath = "/Marketing/Displays";
      const existingDevice = mockDevicesList.devices.page.edges[0].node;
      const updatedDevice = {
        ...existingDevice,
        path: folderPath,
      };

      // Mock the getDeviceById request
      mockClient.request.mockResolvedValueOnce({
        devices: mockDevicesList.devices,
      });
      // Mock the updateDevice request
      mockClient.request.mockResolvedValueOnce({ updateDevice: updatedDevice });

      const result = await devicesModule.moveDeviceToFolder(
        deviceId,
        folderPath,
        "team-1"
      );
      expect(result.path).toBe(folderPath);
    });
  });

  describe("assignOperationalSchedule", () => {
    it("should assign operational schedule successfully", async () => {
      const deviceId = "1";
      const scheduleOpsId = "schedule-1";
      const existingDevice = mockDevicesList.devices.page.edges[0].node;
      const updatedDevice = {
        ...existingDevice,
        feature: { scheduleOpsId },
      };

      // Mock the getDeviceById request
      mockClient.request.mockResolvedValueOnce({
        devices: mockDevicesList.devices,
      });
      // Mock the updateDevice request
      mockClient.request.mockResolvedValueOnce({ updateDevice: updatedDevice });

      const result = await devicesModule.assignOperationalSchedule(
        deviceId,
        scheduleOpsId,
        "team-1"
      );
      expect((result.feature as { scheduleOpsId: string }).scheduleOpsId).toBe(scheduleOpsId);
    });
  });

  describe("updateContentTagRule", () => {
    it("should update content tag rule successfully", async () => {
      const deviceId = "1";
      const contentTagRuleId = "rule-1";
      const existingDevice = mockDevicesList.devices.page.edges[0].node;
      const updatedDevice = {
        ...existingDevice,
        feature: { contentTagRuleId },
      };

      // Mock the getDeviceById request
      mockClient.request.mockResolvedValueOnce({
        devices: mockDevicesList.devices,
      });
      // Mock the updateDevice request
      mockClient.request.mockResolvedValueOnce({ updateDevice: updatedDevice });

      const result = await devicesModule.updateContentTagRule(
        deviceId,
        contentTagRuleId,
        "team-1"
      );
      expect((result.feature as { contentTagRuleId: string }).contentTagRuleId).toBe(contentTagRuleId);
    });
  });

  describe("pairDevice", () => {
    it("should pair device successfully", async () => {
      const pairingCode = "123456";
      const path = "/Marketing";
      const teamId = "team-1";
      const pairedDevice = {
        _id: "1",
        deviceName: "New Device",
        UUID: "uuid-1",
        pairingCode,
        currentType: "PLAYLIST",
        currentAssetId: "asset-1",
        currentPlaylistId: "playlist-1",
        localAppVersion: "1.0.0",
        orientation: "landscape"
      };

      mockClient.request.mockResolvedValueOnce({ pairDevice: pairedDevice });

      const result = await devicesModule.pairDevice(pairingCode, path, teamId);
      expect(result).toEqual(pairedDevice);
    });

    it("should handle errors when pairing device", async () => {
      mockClient.request.mockRejectedValueOnce({
        response: { errors: [{ message: "Invalid pairing code" }] }
      });

      await expect(devicesModule.pairDevice("invalid", "", "team-1"))
        .rejects.toThrow("Failed to pair device: Invalid pairing code");
    });
  });

  describe("unpairDevice", () => {
    it("should unpair device successfully", async () => {
      mockClient.request.mockResolvedValueOnce({ unPairDevices: true });
      const result = await devicesModule.unpairDevice("1", "team-1");
      expect(result).toBe(true);
    });

    it("should handle errors when unpairing device", async () => {
      mockClient.request.mockRejectedValueOnce({
        response: { errors: [{ message: "Device not found" }] }
      });

      await expect(devicesModule.unpairDevice("invalid", "team-1"))
        .rejects.toThrow("Failed to delete device: Device not found");
    });
  });
});
