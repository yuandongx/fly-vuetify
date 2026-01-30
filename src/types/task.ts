
export type TaskHistory = {
    id: number|string;
    name: string;
    desc: string;
    start_time: string;
    end_time: string;
    duration: string;
    status: string;
    error: string;
}

export interface TaskArgItem {
    flag: "up"|"down"|null,
    value: number,
    interval: string,
    key: number,
}

export type TaskArgs = Array<TaskArgItem>;