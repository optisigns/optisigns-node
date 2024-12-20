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

    const unpairedDevice = await sdk.devices.unpairDevice(
      "6423c6f994f90f00153db1f4" as string,
      "1"
    );
    console.log("✅ Unpaired Device:", JSON.stringify(unpairedDevice, null, 2));
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testSDK();
