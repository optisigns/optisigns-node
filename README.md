# OptiSigns SDK

Official TypeScript SDK for the OptiSigns API, providing easy integration for digital signage management.

## Installation

```bash
npm install @optisigns/optisigns
```

## Quick Start

```typescript
import { OptiSigns } from "@optisigns/optisigns";

const client = new OptiSigns("YOUR_API_KEY");
```

## Features

### Devices/Screens

- List all devices
- Find device by name
- Get device by ID
- Create device
- Update device
- Delete device
- Reboot device
- Push content to screen

### Assets

- Upload file asset (local or S3 URL)
- Create website asset
- Modify asset settings
- Delete asset

## Example Usage

### Managing Devices

```typescript
// List all devices
const devices = await client.devices.listAllDevices();

// Find device by name
const device = await client.devices.findByDeviceName("Reception");

// Get device by ID
const device = await client.devices.getDeviceById("device_id");

// Create new device
const newDevice = await client.devices.createDevice({
  deviceName: "Reception Screen",
  orientation: "LANDSCAPE",
});

// Update device
await client.devices.updateDevice("device_id", {
  deviceName: "Updated Screen Name",
});

// Delete device
await client.devices.deleteDeviceById("device_id", "team_id");

// Push content to screen
await client.devices.pushContentToDevice(
  "device_id",
  "content_id",
  "team_id",
  "NOW"
);
```

### Managing Assets

```typescript
// Upload file asset
const asset = await client.assets.uploadFileAsset(
  "./path/to/image.jpg",
  "team_id"
);

// Create website asset
const websiteAsset = await client.assets.createWebsiteAppAsset({
  url: "https://example.com",
  title: "Company Website",
}, "team_id");

// Modify asset settings
await client.assets.modifyAssetSettings("asset_id", {
  name: "Updated Asset Name",
  metadata: { key: "value" }
}, "team_id");

// Delete asset
await client.assets.deleteAssetById("asset_id", "team_id");
```

## Documentation

For detailed API documentation, visit [OptiSigns Documentation](https://docs.optisigns.com)

## Support

For support, please contact support@optisigns.com or visit our [Support Center](https://support.optisigns.com)
