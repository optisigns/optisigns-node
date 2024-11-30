var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class DevicesModule {
    constructor(client) {
        this.client = client;
    }
    listAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      query {
        devices(query: {}) {
          page {
            edges {
              node {
                _id
                deviceName
                UUID
                pairingCode
                currentType
                currentAssetId
                currentPlaylistId
                localAppVersion
              }
            }
          }
        }
      }
    `;
            const response = yield this.client.request(query);
            return response.devices.page.edges.map((edge) => edge.node);
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      query($name: String!) {
        devices(query: { deviceName: $name }) {
          page {
            edges {
              node {
                _id
                deviceName
                UUID
                pairingCode
                currentType
                currentAssetId
                currentPlaylistId
                localAppVersion
              }
            }
          }
        }
      }
    `;
            const response = yield this.client.request(query, { name });
            return response.devices.page.edges.map((edge) => edge.node);
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      query($id: String!) {
        device(id: $id) {
          _id
          deviceName
          UUID
          pairingCode
          currentType
          currentAssetId
          currentPlaylistId
          localAppVersion
        }
      }
    `;
            const response = yield this.client.request(query, { id });
            return response.device;
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const mutation = `
      mutation($id: String!, $data: DeviceUpdateInput!) {
        updateDevice(id: $id, data: $data) {
          _id
          deviceName
          UUID
          pairingCode
          currentType
          currentAssetId
          currentPlaylistId
          localAppVersion
        }
      }
    `;
            const response = yield this.client.request(mutation, { id, data });
            return response.updateDevice;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const mutation = `
      mutation($id: String!) {
        deleteDevice(id: $id)
      }
    `;
            const response = yield this.client.request(mutation, { id });
            return response.deleteDevice;
        });
    }
    reboot(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const mutation = `
      mutation($id: String!) {
        rebootDevice(id: $id)
      }
    `;
            const response = yield this.client.request(mutation, { id });
            return response.rebootDevice;
        });
    }
    pushContent(id, contentId, temporary = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const mutation = `
      mutation($id: String!, $contentId: String!, $temporary: Boolean!) {
        pushContentToDevice(id: $id, contentId: $contentId, temporary: $temporary)
      }
    `;
            const response = yield this.client.request(mutation, { id, contentId, temporary });
            return response.pushContentToDevice;
        });
    }
}
