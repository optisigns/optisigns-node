import { OptiSignsSDK } from "../src/index";
import * as dotenv from "dotenv";

dotenv.config();

// FOR LOGGING PURPOSES ONLY

async function testSDK() {
  // Initialize the SDK with your API token
  const sdk = new OptiSignsSDK({
    // token: process.env.OPTISIGNS_API_TOKEN as string,
    token:
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJLRnhSbjdSN1N6b3NSaThvUiIsImNpZCI6InNaaUVRQ3BTRG1lVG9neTJMIiwiYWlkIjoiN0FtWnFOS0FjZTJNWDllVGEiLCJpYXQiOjE3MzI2NzMxMjUsImV4cCI6MTczMjY3NjcyNSwiaXNzIjoiN0FtWnFOS0FjZTJNWDllVGEifQ.V5oTmmXiY-sFv5VZY_3aRdmRWORiJW3F0y8s0WCThOu0bNYaFz880b8qL0PkX19kAXNpZnswu4kUhExwUtXKSG_M7xApkOtyq5tlgPg0PzGJlaFQ3OfK-AYwPFE44eC97pwiXJH9Yqs18QE7hu3Xza0hjWklcd5UkV_3xNhpQltoJj-GUO0tavnlMlE3N0UlLyJAu3zjS1kr2ruyUxt2UD30Dhy8ceVYxwUKdV2jMwQMXziYIpZxCqJ21Iv-k47oumIc5oha5PkPG1kHVBQsH1itsMz8fl84bcnZLvdAMwr5ivum2vV57JlFhO2oKs3vRU3D3oDVNK01ElRSOKcYcTFa7jaN7t9e3hIxUOOMfOvICck4Yn2PRW_-oUni32RV0QRqy5HMgctjiVwFnDtPTcO8PxHcoisVm3QVFBVBR7kepo1Vz1NeYRC41GB0wW5M4AMsqh22t0Ba01LvIF3VMVDHSMKUrsyYKrL_xq4gbNRoh-ihwSMXFwBknvwO7-QLiS5jKK5QmElFpuFbxCr172ofiIUvnFeu7J_x4knf8rG3sHMK4T57Cge-qNm6Q1jL2EQwK6jXyO_d4Ots_khRLdqKfM1k7DrR58sNxWOhTzyDpwY7ny7nVpRRZFPA2sjIi31VpLSfxmryIeejrR7seRSWXeLinCNv4MEKFR12NRI",
    // endpoint: 'optional_custom_endpoint'
  });

  try {
    // Test create method - should throw an error
    // const newDevice = await sdk.devices.createDevice({
    //   deviceName: "New Test Device",
    //   currentType: "ASSET",
    //   currentAssetId: "123456789012345678901234",
    //   orientation: "LANDSCAPE",
    // });
    // console.log("New Device:", JSON.stringify(newDevice, null, 2));

    // Test devices module
    const devices = await sdk.devices.listAllDevices();

    console.log("Devices:", JSON.stringify(devices, null, 2));
    const device = devices[0];

    const deleted = await sdk.devices.deleteDeviceById(device._id, "1");
    console.log("Deleted:", JSON.stringify(deleted, null, 2));

    // Test updateScreen
    // if (device?._id) {
    //   console.log(`Updating screen`);
    //   const updatedDevice = await sdk.devices.updateDevice(device._id, {
    //     deviceName: "Updated Test Screen",
    //     currentType: "ASSET",
    //     currentAssetId: "666666666666666666666666",
    //     orientation: "LANDSCAPE",
    //   });
    // }
  } catch (error) {
    console.error("Error:", error);
  }
}

testSDK();
