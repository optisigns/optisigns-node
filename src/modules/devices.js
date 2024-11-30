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
exports.DevicesModule = void 0;
var DevicesModule = /** @class */ (function () {
    function DevicesModule(client) {
        this.client = client;
    }
    DevicesModule.prototype.listAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, response, error_1;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        query = "\n      query {\n        devices(query: {}) {\n          page {\n            edges {\n              node {\n                _id\n                deviceName\n                UUID\n                pairingCode\n                currentType\n                currentAssetId\n                currentPlaylistId\n                localAppVersion\n              }\n            }\n          }\n        }\n      }\n    ";
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client.request(query)];
                    case 2:
                        response = _d.sent();
                        return [2 /*return*/, response.devices.page.edges.map(function (edge) { return edge.node; })];
                    case 3:
                        error_1 = _d.sent();
                        if ((_c = (_b = (_a = error_1.response) === null || _a === void 0 ? void 0 : _a.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message) {
                            throw new Error(error_1.response.errors[0].message);
                        }
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DevicesModule.prototype.findByName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var query, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n      query($name: String!) {\n        devices(query: { deviceName: $name }) {\n          page {\n            edges {\n              node {\n                _id\n                deviceName\n                UUID\n                pairingCode\n                currentType\n                currentAssetId\n                currentPlaylistId\n                localAppVersion\n              }\n            }\n          }\n        }\n      }\n    ";
                        return [4 /*yield*/, this.client.request(query, { name: name })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.devices.page.edges.map(function (edge) { return edge.node; })];
                }
            });
        });
    };
    DevicesModule.prototype.getById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n      query($id: String!) {\n        device(id: $id) {\n          _id\n          deviceName\n          UUID\n          pairingCode\n          currentType\n          currentAssetId\n          currentPlaylistId\n          localAppVersion\n        }\n      }\n    ";
                        return [4 /*yield*/, this.client.request(query, { id: id })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.device];
                }
            });
        });
    };
    DevicesModule.prototype.update = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var mutation, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mutation = "\n      mutation($id: String!, $data: DeviceUpdateInput!) {\n        updateDevice(id: $id, data: $data) {\n          _id\n          deviceName\n          UUID\n          pairingCode\n          currentType\n          currentAssetId\n          currentPlaylistId\n          localAppVersion\n        }\n      }\n    ";
                        return [4 /*yield*/, this.client.request(mutation, { id: id, data: data })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.updateDevice];
                }
            });
        });
    };
    DevicesModule.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var mutation, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mutation = "\n      mutation($id: String!) {\n        deleteDevice(id: $id)\n      }\n    ";
                        return [4 /*yield*/, this.client.request(mutation, { id: id })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.deleteDevice];
                }
            });
        });
    };
    DevicesModule.prototype.reboot = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var mutation, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mutation = "\n      mutation($id: String!) {\n        rebootDevice(id: $id)\n      }\n    ";
                        return [4 /*yield*/, this.client.request(mutation, { id: id })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.rebootDevice];
                }
            });
        });
    };
    DevicesModule.prototype.pushContent = function (id_1, contentId_1) {
        return __awaiter(this, arguments, void 0, function (id, contentId, temporary) {
            var mutation, response;
            if (temporary === void 0) { temporary = false; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mutation = "\n      mutation($id: String!, $contentId: String!, $temporary: Boolean!) {\n        pushContentToDevice(id: $id, contentId: $contentId, temporary: $temporary)\n      }\n    ";
                        return [4 /*yield*/, this.client.request(mutation, { id: id, contentId: contentId, temporary: temporary })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.pushContentToDevice];
                }
            });
        });
    };
    return DevicesModule;
}());
exports.DevicesModule = DevicesModule;
