
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
    label: string,
    value: number|null,
    interval: number|null,
    key: number,
}

export type TaskArgs = Array<TaskArgItem>;