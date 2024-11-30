import { OptiSignsSDK } from "../src/index";
import * as dotenv from "dotenv";

dotenv.config();

// FOR LOGGING PURPOSES ONLY

async function testSDK() {
  // Initialize the SDK with your API token
  const sdk = new OptiSignsSDK({
    token: process.env.OPTISIGNS_API_TOKEN as string,
    // endpoint: 'optional_custom_endpoint'
  });

  try {
    // Test devices module
    const devices = await sdk.devices.listAll();
    const device = await sdk.devices.findByName("test");
    console.log("Devices:", JSON.stringify(devices, null, 2));
    console.log("Device:", JSON.stringify(device, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

testSDK();
 