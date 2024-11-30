export interface Schedule {
    _id: string;
    name: string;
    items: ScheduleItem[];
}
export interface ScheduleItem {
    playlistId: string;
    startTime: string;
    endTime: string;
}
export interface ScheduleCreateInput {
    name: string;
    items: ScheduleItem[];
}
export interface ScheduleUpdateInput {
    name?: string;
    items?: ScheduleItem[];
}
