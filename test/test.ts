import { OptiSigns } from "../src/index";
import * as dotenv from "dotenv";

dotenv.config();

async function testSDK() {
  const sdk = new OptiSigns({
    token: process.env.OPTISIGNS_API_TOKEN as string,
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
    const playlistInput = {
      name: "Web Services Playlist",
      // items: [
      //   {
      //     ...googleAsset,  // Spread the full asset object
      //     duration: 30
      //   },
      //   {
      //     ...youtubeAsset, // Spread the full asset object
      //     duration: 30
      //   }
      // ],
      rootAssetId: googleAsset._id,
      tags: ["test", "websites"],
      options: {
        defaultTransition: "fade",
        slideDuration: 30,
        shuffle: false,
      },
      color: "#FF0000",
      isDisable: false,
    };

    const newPlaylist = await sdk.playlists.createPlaylist(
      playlistInput,
      "1" // teamId
    );
    console.log("✅ Created Playlist with web assets:", newPlaylist);

    const editPlaylist = await sdk.playlists.editPlaylist(
      newPlaylist._id,
      {
        name: "Updated Playlist Name",
      },
      "1" // teamId
    );
    console.log("✅ Edited Playlist:", editPlaylist);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testSDK();
