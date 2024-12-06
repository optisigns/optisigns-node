import { OptiSignsSDK } from "../src/index";
import * as dotenv from "dotenv";

dotenv.config();

async function testSDK() {
  const sdk = new OptiSignsSDK({
    token: process.env.OPTISIGNS_API_TOKEN as string,
  });

  try {
    // Test devices module
    console.log("📱 Fetching all devices...");
    const devices = await sdk.devices.listAllDevices();
    console.log(`✅ Found ${devices.length} devices`);

    if (devices.length > 0) {
      const testDevice = devices[0];
      console.log(`\n🎯 Selected test device:`, {
        id: testDevice._id,
        name: testDevice.deviceName,
      });

      // Test immediate push
      console.log("\n🚀 Testing immediate content push...");
      const immediateResult = await sdk.devices.pushContentToDevice(
        testDevice._id,
        "your-content-id", // Replace with actual content ID
        "1" // Our team ID is 1
      );
      console.log("✅ Immediate push result:", immediateResult);

      // Test scheduled push
      console.log("\n📅 Testing scheduled content push...");
      const futureTime = new Date();
      futureTime.setMinutes(futureTime.getMinutes() + 5); // Schedule 5 minutes from now
      const scheduledResult = await sdk.devices.pushContentToDevice(
        testDevice._id,
        "your-content-id", // Replace with actual content ID
        "1", // Our team ID is 1
        "SCHEDULE",
        undefined,
        futureTime.toISOString()
      );
      console.log("✅ Scheduled push result:", scheduledResult);

      // Test temporary push
      console.log("\n⏱️ Testing temporary content push (30 minutes)...");
      const temporaryResult = await sdk.devices.pushContentToDevice(
        testDevice._id,
        "your-content-id", // Replace with actual content ID
        "1", // Our team ID is 1
        "TEMPORARILY",
        30
      );
      console.log("✅ Temporary push result:", temporaryResult);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testSDK();
