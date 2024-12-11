import { OptiSigns } from "../src/index";
import * as dotenv from "dotenv";

dotenv.config();

async function testSDK() {
  const sdk = new OptiSigns({
    token: process.env.OPTISIGNS_API_TOKEN as string,
    endpoint: "https://beta-graphql-gateway.optisigns.com/graphql",
  });

  try {
    // Test devices module

    const device = await sdk.devices.getDeviceById("675360559cc0320012c3b51b");
    // const device = await sdk.devices.findByDeviceName("Screen 1");
    console.log(`Device: ${JSON.stringify(device)}`);
    console.log("📱 Fetching all devices...");
    const devices = await sdk.devices.listAllDevices();
    console.log(`✅ Found ${devices.length} devices`);

    // Select a device that has an active content ID
    const testDevice = devices.find((device) => device.currentPlaylistId);

    if (testDevice) {
      console.log(`\n🎯 Selected test device:`, {
        id: testDevice._id,
        name: testDevice.deviceName,
        currentAssetId: testDevice.currentAssetId,
        currentPlaylistId: testDevice.currentPlaylistId,
      });

      // Test immediate push with current asset
      console.log("\n🚀 Testing immediate content push...");
      const immediateResult = await sdk.devices.pushContentToDevice(
        testDevice._id as string,
        testDevice.currentAssetId as string,
        "1"
      );
      console.log("✅ Immediate push result:", immediateResult);

      // Test scheduled push
      console.log("\n📅 Testing scheduled content push...");
      const futureTime = new Date();
      futureTime.setMinutes(futureTime.getMinutes() + 5);
      const scheduledResult = await sdk.devices.pushContentToDevice(
        testDevice._id as string,
        testDevice.currentAssetId as string,
        "1",
        "SCHEDULE",
        undefined,
        futureTime.toISOString()
      );
      console.log("✅ Scheduled push result:", scheduledResult);

      // Test temporary push
      console.log("\n⏱️ Testing temporary content push (30 minutes)...");
      const temporaryResult = await sdk.devices.pushContentToDevice(
        testDevice._id as string,
        testDevice.currentAssetId as string,
        "1",
        "TEMPORARILY",
        30
      );
      console.log("✅ Temporary push result:", temporaryResult);
    } else {
      console.log("❌ No suitable test device found with active content");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testSDK();
