import { OptiSigns } from "../src/index";
import * as dotenv from "dotenv";

dotenv.config();

async function testSDK() {
  const sdk = new OptiSigns({
    // token: process.env.OPTISIGNS_API_TOKEN as string,
    token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJLRnhSbjdSN1N6b3NSaThvUiIsImNpZCI6InNaaUVRQ3BTRG1lVG9neTJMIiwiYWlkIjoiN0FtWnFOS0FjZTJNWDllVGEiLCJpYXQiOjE3MzI2NzMxMjUsImV4cCI6MTczMjY3NjcyNSwiaXNzIjoiN0FtWnFOS0FjZTJNWDllVGEifQ.V5oTmmXiY-sFv5VZY_3aRdmRWORiJW3F0y8s0WCThOu0bNYaFz880b8qL0PkX19kAXNpZnswu4kUhExwUtXKSG_M7xApkOtyq5tlgPg0PzGJlaFQ3OfK-AYwPFE44eC97pwiXJH9Yqs18QE7hu3Xza0hjWklcd5UkV_3xNhpQltoJj-GUO0tavnlMlE3N0UlLyJAu3zjS1kr2ruyUxt2UD30Dhy8ceVYxwUKdV2jMwQMXziYIpZxCqJ21Iv-k47oumIc5oha5PkPG1kHVBQsH1itsMz8fl84bcnZLvdAMwr5ivum2vV57JlFhO2oKs3vRU3D3oDVNK01ElRSOKcYcTFa7jaN7t9e3hIxUOOMfOvICck4Yn2PRW_-oUni32RV0QRqy5HMgctjiVwFnDtPTcO8PxHcoisVm3QVFBVBR7kepo1Vz1NeYRC41GB0wW5M4AMsqh22t0Ba01LvIF3VMVDHSMKUrsyYKrL_xq4gbNRoh-ihwSMXFwBknvwO7-QLiS5jKK5QmElFpuFbxCr172ofiIUvnFeu7J_x4knf8rG3sHMK4T57Cge-qNm6Q1jL2EQwK6jXyO_d4Ots_khRLdqKfM1k7DrR58sNxWOhTzyDpwY7ny7nVpRRZFPA2sjIi31VpLSfxmryIeejrR7seRSWXeLinCNv4MEKFR12NRI"
    // endpoint: "https://beta-graphql-gateway.optisigns.com/graphql",
  });

  try {
    // Test devices module

    // const device = await sdk.devices.getDeviceById("675360559cc0320012c3b51b");
    // // const device = await sdk.devices.findByDeviceName("Screen 1");
    // console.log(`Device: ${JSON.stringify(device)}`);
    // console.log("📱 Fetching all devices...");
    const devices = await sdk.devices.listAllDevices();
    console.log(`✅ Found ${devices.length} devices`);

    // Test creating a Website App Asset
    const websiteAsset = await sdk.assets.createWebsiteAppAsset({
      url: "https://www.youtube.com/watch?v=Qan_OvBeUpc",
      title: "YouTube Video",
      description: "The homepage of Google",
    }, "1"); // Assuming "1" is the teamId
    console.log("✅ Created Website App Asset:", websiteAsset);

    // Select a device that has an active content ID
    const testDevice = devices.find((device) => device.currentPlaylistId);
    
    // if (testDevice) {
    //   console.log(`\n🎯 Selected test device:`, {
    //     id: testDevice._id,
    //     name: testDevice.deviceName,
    //     currentAssetId: testDevice.currentAssetId,
    //     currentPlaylistId: testDevice.currentPlaylistId,
    //   });

    //   // Test immediate push with current asset
    //   console.log("\n🚀 Testing immediate content push...");
    //   const immediateResult = await sdk.devices.pushContentToDevice(
    //     testDevice._id as string,
    //     testDevice.currentAssetId as string,
    //     "1"
    //   );
    //   console.log("✅ Immediate push result:", immediateResult);

    //   // Test scheduled push
    //   console.log("\n📅 Testing scheduled content push...");
    //   const futureTime = new Date();
    //   futureTime.setMinutes(futureTime.getMinutes() + 5);
    //   const scheduledResult = await sdk.devices.pushContentToDevice(
    //     testDevice._id as string,
    //     testDevice.currentAssetId as string,
    //     "1",
    //     "SCHEDULE",
    //     undefined,
    //     futureTime.toISOString()
    //   );
    //   console.log("✅ Scheduled push result:", scheduledResult);

    //   // Test temporary push
    //   console.log("\n⏱️ Testing temporary content push (30 minutes)...");
    //   const temporaryResult = await sdk.devices.pushContentToDevice(
    //     testDevice._id as string,
    //     testDevice.currentAssetId as string,
    //     "1",
    //     "TEMPORARILY",
    //     30
    //   );
    //   console.log("✅ Temporary push result:", temporaryResult);
    // } else {
    //   console.log("❌ No suitable test device found with active content");
    // }

    // Test uploading a file asset
    const filePath = "https://fastly.picsum.photos/id/163/200/300.jpg?hmac=MHvt2U1kS_umJxJUqatJt-p78ljmX5Hxct3dxWTZRHA";
    const uploadedAsset = await sdk.assets.uploadFileAsset(filePath, "1");
    console.log("✅ Uploaded File Asset:", uploadedAsset);

    // Test deleting the uploaded asset
    const deleteResult = await sdk.assets.deleteAssetById(uploadedAsset._id, "1");
    console.log("✅ Deleted Asset Result:", deleteResult);

    // Test modifying the uploaded asset's settings
    // const modifiedAsset = await sdk.assets.modifyAssetSettings(
    //   uploadedAsset._id,
    //   {
    //     name: "Modified Test Image",
    //     metadata: {
    //       description: "A beautiful test image",
    //       tags: ["test", "image"]
    //     }
    //   },
    //   "1"
    // );
    // console.log("✅ Modified Asset Settings:", modifiedAsset);

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testSDK();
