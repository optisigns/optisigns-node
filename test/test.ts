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
    const fileName = "sample.pdf";
    const filePath = "./assets/sample.pdf"; // Make sure this file exists in assets folder

    // console.log(`🔥 Uploading file asset: ${filePath}`);

    const uploadedAsset = await sdk.assets.uploadFileAsset(
      filePath,
      fileName,
      teamId
    );
    console.log("✅ Uploaded Asset:", JSON.stringify(uploadedAsset, null, 2));

    // Test deleting the uploaded asset
    console.log("🔥 Deleting uploaded asset...");
    const deleteResult = await sdk.assets.deleteAssetById(
      uploadedAsset._id,
      teamId
    );
    console.log("✅ Asset deleted:", deleteResult);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testSDK();
