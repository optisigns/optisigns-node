import { OptiSigns } from "../src/index";
import * as dotenv from "dotenv";

dotenv.config();

async function testSDK() {
  const sdk = new OptiSigns({
    token: process.env.OPTISIGNS_API_TOKEN as string,
  });

  try {
    // Add this new test before other operations
    // console.log("🔥 Pairing device with code X2B2F1...");
    // const pairedDevice = await sdk.devices.pairDevice(
    //   "X2B2F1",
    //   "",
    //   "1" // teamId
    // );
    // console.log("✅ Paired Device:", JSON.stringify(pairedDevice, null, 2));

    const device = await sdk.devices.getDeviceById(
      "671135a63cf4df001211fca0" as string
    );
    console.log("✅ Device:", JSON.stringify(device, null, 2));

    const unpairedDevice = await sdk.devices.unpairDevice(
      "671135a63cf4df001211fca0" as string,
      "1"
    );
    console.log("✅ Unpaired Device:", JSON.stringify(unpairedDevice, null, 2));
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testSDK();
