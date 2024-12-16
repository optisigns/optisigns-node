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
      expect(sdk.devices.listAllDevices).toBeDefined();
      expect(sdk.devices.findByDeviceName).toBeDefined();
      expect(sdk.devices.getDeviceById).toBeDefined();
      expect(sdk.devices.updateDevice).toBeDefined();
      expect(sdk.devices.createDevice).toBeDefined();
      expect(sdk.devices.deleteDeviceById).toBeDefined();
      expect(sdk.devices.rebootDevice).toBeDefined();
      // expect(sdk.devices.pushContentToDevice).toBeDefined();
    });
  });
});
