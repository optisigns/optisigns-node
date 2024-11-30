"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptiSignsSDK = void 0;
var graphql_request_1 = require("graphql-request");
var devices_1 = require("./modules/devices");
var OptiSignsSDK = /** @class */ (function () {
    function OptiSignsSDK(config) {
        var endpoint = config.endpoint || "https://beta-graphql-gateway.optisigns.com/graphql";
        if (!this.isValidUrl(endpoint)) {
            throw new Error("Invalid endpoint URL");
        }
        this.client = new graphql_request_1.GraphQLClient(endpoint, {
            headers: {
                authorization: "Bearer ".concat(config.token),
            },
        });
        this.devices = new devices_1.DevicesModule(this.client);
    }
    OptiSignsSDK.prototype.isValidUrl = function (url) {
        try {
            new URL(url);
            return true;
        }
        catch (_a) {
            return false;
        }
    };
    return OptiSignsSDK;
}());
exports.OptiSignsSDK = OptiSignsSDK;
