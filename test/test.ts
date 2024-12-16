import { OptiSigns } from "../src/index";
import * as dotenv from "dotenv";

dotenv.config();

async function testSDK() {
  const sdk = new OptiSigns({
    token: process.env.OPTISIGNS_API_TOKEN as string
  });

  try {
    // Create Google website asset
    const googleAsset = await sdk.assets.createWebsiteAppAsset(
      {
        url: "https://www.google.com",
        title: "Google Homepage",
        description: "The homepage of Google",
      },
      "1" // teamId
    );
    console.log("✅ Created Google Website Asset:", googleAsset);

    // Create YouTube website asset
    const youtubeAsset = await sdk.assets.createWebsiteAppAsset(
      {
        url: "https://www.youtube.com",
        title: "YouTube Homepage",
        description: "The homepage of YouTube",
      },
      "1" // teamId
    );
    console.log("✅ Created YouTube Website Asset:", youtubeAsset);

    // Create a playlist with both assets
    const newPlaylist = await sdk.playlists.createPlaylist(
      {
        name: "Web Services Playlist",
        items: [
          { asset: googleAsset._id, duration: 30 }, // Changed assetId to asset
          { asset: youtubeAsset._id, duration: 30 }, // Changed assetId to asset
        ],
      },
      "1" // teamId
    );
    console.log("✅ Created Playlist with web assets:", newPlaylist);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testSDK();
