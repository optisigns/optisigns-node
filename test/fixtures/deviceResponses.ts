// Define TypeScript interfaces to match your API structure
interface Device {
  _id: string;
  name: string;
  status: "ONLINE" | "OFFLINE";
  lastSeen: string;
  location?: string;
  description?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

interface DevicesResponse {
  devices: {
    nodes: Device[];
    pageInfo?: {
      hasNextPage: boolean;
      endCursor?: string;
    };
  };
}

interface DeviceResponse {
  device: Device;
}

// Mock responses
export const mockDevicesList = {
  devices: {
    page: {
      edges: [
        {
          node: {
            _id: "1",
            deviceName: "Device 1",
            UUID: "uuid-1",
            pairingCode: "pair-1",
            currentType: "DISPLAY",
            currentAssetId: "asset-1",
            currentPlaylistId: "playlist-1",
            localAppVersion: "1.0.0",
          },
        },
        {
          node: {
            _id: "2",
            deviceName: "Device 2",
            UUID: "uuid-2",
            pairingCode: "pair-2",
            currentType: "DISPLAY",
            currentAssetId: "asset-2",
            currentPlaylistId: "playlist-2",
            localAppVersion: "1.0.0",
          },
        },
      ],
    },
  },
};

export const mockDeviceDetails: DeviceResponse = {
  device: {
    _id: "1",
    name: "Device 1",
    status: "ONLINE",
    lastSeen: "2024-03-20T10:00:00Z",
    location: "Main Office",
    description: "Reception Display",
    tags: ["reception", "lobby"],
    metadata: {
      screenOrientation: "landscape",
      screenResolution: "1920x1080",
    },
  },
};

// Error responses
export const mockErrorResponses = {
  invalidToken: new Error("Invalid authentication token"),
};
