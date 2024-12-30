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

    // Test modifying asset tags
    console.log("🔥 Modifying asset tags...");
    const modifiedAsset = await sdk.assets.modifyAssetSettings(
      uploadedAsset._id,
      {
        _id: uploadedAsset._id,
        tags: ["test-tag", "sample-pdf"],
      },
      teamId
    );
    console.log("✅ Modified Asset Tags:", JSON.stringify(modifiedAsset, null, 2));

    console.log("🔥 Creating website app asset...");
    const websiteAppAsset = await sdk.assets.createWebsiteAppAsset(
      {
        url: "https://www.youtube.com/watch?v=Qan_OvBeUpc",
        title: "YouTube",
      },
      teamId
    );
    console.log(
      "✅ Created Website App Asset:",
      JSON.stringify(websiteAppAsset, null, 2)
    );

    // Test modifying website asset settings
    // console.log("🔥 Modifying website asset settings...");
    // const modifiedAsset = await sdk.assets.modifyAssetSettings(
    //   "RYb8h4PJEiTE278T",
    //   {
    //     _id: "RYb8h4PJEiTE278T",
    //     path: "/A",
    //   },
    //   teamId
    // );
    // console.log(
    //   "✅ Modified Website Asset:",
    //   JSON.stringify(modifiedAsset, null, 2)
    // );
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testSDK();
