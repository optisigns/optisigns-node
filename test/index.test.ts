import { OptiSignsSDK } from "../src/index";
import { GraphQLClient } from "graphql-request";
import { mockDevicesList, mockErrorResponses } from "./fixtures/deviceResponses";

jest.mock('graphql-request', () => ({
  GraphQLClient: jest.fn().mockImplementation(() => ({
    request: jest.fn()
  }))
}));

describe('OptiSignsSDK', () => {
  const mockToken = 'test-token';
  let sdk: OptiSignsSDK;
  let mockClient: jest.Mocked<GraphQLClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Get the mocked client directly from GraphQLClient
    mockClient = new GraphQLClient('') as jest.Mocked<GraphQLClient>;
    
    sdk = new OptiSignsSDK({
      token: mockToken
    });
  });

  describe('initialization', () => {
    it('should initialize with default endpoint', () => {
      expect(GraphQLClient).toHaveBeenCalledWith(
        'https://beta-graphql-gateway.optisigns.com/graphql',
        {
          headers: {
            authorization: `Bearer ${mockToken}`,
          },
        }
      );
    });

    it('should throw error for invalid endpoint', () => {
      expect(() => {
        new OptiSignsSDK({
          token: mockToken,
          endpoint: 'invalid-url',
        });
      }).toThrow('Invalid endpoint URL');
    });

    it('should throw error for empty token', () => {
      expect(() => {
        new OptiSignsSDK({
          token: '',
        });
      }).toThrow('Token is required');
    });
  });

  describe('devices module', () => {
    it('should initialize devices module', () => {
      expect(sdk.devices).toBeDefined();
      expect(sdk.devices).toHaveProperty('client');
    });

    it('should properly integrate with devices module', () => {
      expect(sdk.devices.listAll).toBeDefined();
      expect(sdk.devices.findByName).toBeDefined();
      expect(sdk.devices.getById).toBeDefined();
      expect(sdk.devices.update).toBeDefined();
      expect(sdk.devices.delete).toBeDefined();
      expect(sdk.devices.reboot).toBeDefined();
      expect(sdk.devices.pushContent).toBeDefined();
    });
  });
});
