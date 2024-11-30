var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class SchedulesModule {
    constructor(client) {
        this.client = client;
    }
    listAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      query {
        schedules {
          _id
          name
          items {
            playlistId
            startTime
            endTime
          }
        }
      }
    `;
            const response = yield this.client.request(query);
            return response.schedules;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const mutation = `
      mutation($data: ScheduleCreateInput!) {
        createSchedule(data: $data) {
          _id
          name
          items {
            playlistId
            startTime
            endTime
          }
        }
      }
    `;
            const response = yield this.client.request(mutation, { data });
            return response.createSchedule;
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const mutation = `
      mutation($id: String!, $data: ScheduleUpdateInput!) {
        updateSchedule(id: $id, data: $data) {
          _id
          name
          items {
            playlistId
            startTime
            endTime
          }
        }
      }
    `;
            const response = yield this.client.request(mutation, { id, data });
            return response.updateSchedule;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const mutation = `
      mutation($id: String!) {
        deleteSchedule(id: $id)
      }
    `;
            const response = yield this.client.request(mutation, { id });
            return response.deleteSchedule;
        });
    }
}
