"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../src/index");
var dotenv = require("dotenv");
dotenv.config();
function testSDK() {
    return __awaiter(this, void 0, void 0, function () {
        var sdk, devices, device, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sdk = new index_1.OptiSignsSDK({
                        token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJLRnhSbjdSN1N6b3NSaThvUiIsImNpZCI6InNaaUVRQ3BTRG1lVG9neTJMIiwiYWlkIjoiN0FtWnFOS0FjZTJNWDllVGEiLCJpYXQiOjE3MzI2NzMxMjUsImV4cCI6MTczMjY3NjcyNSwiaXNzIjoiN0FtWnFOS0FjZTJNWDllVGEifQ.V5oTmmXiY-sFv5VZY_3aRdmRWORiJW3F0y8s0WCThOu0bNYaFz880b8qL0PkX19kAXNpZnswu4kUhExwUtXKSG_M7xApkOtyq5tlgPg0PzGJlaFQ3OfK-AYwPFE44eC97pwiXJH9Yqs18QE7hu3Xza0hjWklcd5UkV_3xNhpQltoJj-GUO0tavnlMlE3N0UlLyJAu3zjS1kr2ruyUxt2UD30Dhy8ceVYxwUKdV2jMwQMXziYIpZxCqJ21Iv-k47oumIc5oha5PkPG1kHVBQsH1itsMz8fl84bcnZLvdAMwr5ivum2vV57JlFhO2oKs3vRU3D3oDVNK01ElRSOKcYcTFa7jaN7t9e3hIxUOOMfOvICck4Yn2PRW_-oUni32RV0QRqy5HMgctjiVwFnDtPTcO8PxHcoisVm3QVFBVBR7kepo1Vz1NeYRC41GB0wW5M4AMsqh22t0Ba01LvIF3VMVDHSMKUrsyYKrL_xq4gbNRoh-ihwSMXFwBknvwO7-QLiS5jKK5QmElFpuFbxCr172ofiIUvnFeu7J_x4knf8rG3sHMK4T57Cge-qNm6Q1jL2EQwK6jXyO_d4Ots_khRLdqKfM1k7DrR58sNxWOhTzyDpwY7ny7nVpRRZFPA2sjIi31VpLSfxmryIeejrR7seRSWXeLinCNv4MEKFR12NRI",
                        // endpoint: 'optional_custom_endpoint'
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, sdk.devices.listAll()];
                case 2:
                    devices = _a.sent();
                    return [4 /*yield*/, sdk.devices.findByName("test")];
                case 3:
                    device = _a.sent();
                    console.log("Devices:", JSON.stringify(devices, null, 2));
                    console.log("Device:", JSON.stringify(device, null, 2));
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error("Error:", error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
testSDK();
