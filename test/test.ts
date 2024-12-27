import { OptiSigns } from "../src/index";
import * as dotenv from "dotenv";

dotenv.config();

async function testSDK() {
  const sdk = new OptiSigns({
    token: process.env.OPTISIGNS_API_TOKEN as string,
  });

  try {
    // Test uploading a file asset
    console.log("🔥 Uploading file asset...");
    const teamId = "1";
    const fileName = "sample.jpg";
    const filePath = "https://picsum.photos/200/300"; // Make sure this file exists

    console.log(`🔥 Uploading file asset: ${filePath}`);

    const uploadedAsset = await sdk.assets.uploadFileAsset(
      filePath,
      fileName,
      teamId
    );
    console.log("✅ Uploaded Asset:", JSON.stringify(uploadedAsset, null, 2));

    console.log("🔥 Creating website app asset...");
    const websiteAppAsset = await sdk.assets.createWebsiteAppAsset(
      {
        url: "https://www.google.com",
        title: "Google",
      },
      teamId
    );
    console.log(
      "✅ Created Website App Asset:",
      JSON.stringify(websiteAppAsset, null, 2)
    );
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testSDK();
