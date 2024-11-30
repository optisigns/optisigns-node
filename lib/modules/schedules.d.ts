import { GraphQLClient } from "graphql-request";
import { Schedule, ScheduleCreateInput, ScheduleUpdateInput } from "../types/schedule";
export declare class SchedulesModule {
    private client;
    constructor(client: GraphQLClient);
    listAll(): Promise<Schedule[]>;
    create(data: ScheduleCreateInput): Promise<Schedule>;
    update(id: string, data: ScheduleUpdateInput): Promise<Schedule>;
    delete(id: string): Promise<boolean>;
}
