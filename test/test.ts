import { OptiSigns } from "../src/index";
import * as dotenv from "dotenv";

dotenv.config();

async function testSDK() {
  const sdk = new OptiSigns({
    token: process.env.OPTISIGNS_API_TOKEN as string,
  });

  try {
    // Test updating content tag rule
    console.log("🔥 Updating content tag rule...");
    const deviceId = "671135a63cf4df001211fca0";
    const teamId = "1";
    const contentTagRuleId = "default";

    const updatedDevice = await sdk.devices.updateContentTagRule(
      deviceId,
      contentTagRuleId,
      teamId
    );
    console.log("✅ Updated Device:", JSON.stringify(updatedDevice, null, 2));

    // List all devices to verify changes
    console.log(`🔥 Listing all devices...`);
    const devices = await sdk.devices.listAllDevices();
    console.log("✅ Devices Length", devices.length);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testSDK();
