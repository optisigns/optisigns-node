import { OptiSigns } from "../src/index";
import { GraphQLClient } from "graphql-request";
import {
  mockDevicesList,
  mockErrorResponses,
} from "./fixtures/deviceResponses";

jest.mock("graphql-request", () => ({
  GraphQLClient: jest.fn().mockImplementation(() => ({
    request: jest.fn(),
  })),
}));

describe("OptiSignsSDK", () => {
  const mockToken = "test-token";
  let sdk: OptiSigns;
  let mockClient: jest.Mocked<GraphQLClient>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Get the mocked client directly from GraphQLClient
    mockClient = new GraphQLClient("") as jest.Mocked<GraphQLClient>;

    sdk = new OptiSigns({
      token: mockToken,
    });
  });

  describe("initialization", () => {
    it("should initialize with default endpoint", () => {
      expect(GraphQLClient).toHaveBeenCalledWith(
        "https://graphql-gateway.optisigns.com/graphql",
        {
          headers: {
            authorization: `Bearer ${mockToken}`,
          },
        }
      );
    });

    it("should throw error for invalid endpoint", () => {
      expect(() => {
        new OptiSigns({
          token: mockToken,
          endpoint: "invalid-url",
        });
      }).toThrow("Invalid endpoint URL");
    });

    it("should throw error for empty token", () => {
      expect(() => {
        new OptiSigns({
          token: "",
        });
      }).toThrow("Token is required");
    });
  });

  describe("devices module", () => {
    it("should initialize devices module", () => {
      expect(sdk.devices).toBeDefined();
      expect(sdk.devices).toHaveProperty("client");
    });

    it("should properly integrate with devices module", () => {
      // Basic device operations
      expect(sdk.devices.listAllDevices).toBeDefined();
      expect(sdk.devices.getDeviceByName).toBeDefined();
      expect(sdk.devices.getDeviceById).toBeDefined();

      // Device management operations
      expect(sdk.devices.moveDeviceToFolder).toBeDefined();
      expect(sdk.devices.assignOperationalSchedule).toBeDefined();
      expect(sdk.devices.updateContentTagRule).toBeDefined();

      // Pairing operations
      expect(sdk.devices.pairDevice).toBeDefined();
      expect(sdk.devices.unpairDevice).toBeDefined();

      // Commented out Phase 2 features
      // expect(sdk.devices.takeOverScreen).toBeDefined();
      // expect(sdk.devices.rebootDevice).toBeDefined();
      // expect(sdk.devices.pushContentToDevice).toBeDefined();
    });
  });

  describe("assets module", () => {
    it("should initialize assets module", () => {
      expect(sdk.assets).toBeDefined();
      expect(sdk.assets).toHaveProperty("client");
    });

    it("should properly integrate with assets module", () => {
      // Asset retrieval operations
      expect(sdk.assets.uploadFileAsset).toBeDefined();
      expect(sdk.assets.createWebsiteAppAsset).toBeDefined();
      expect(sdk.assets.modifyAssetSettings).toBeDefined();

      // Asset management operations
      expect(sdk.assets.deleteAssetById).toBeDefined();
    });
  });
});
