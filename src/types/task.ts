export type TaskHistory = {
  id: number | string
  name: string
  desc: string
  start_time: string
  end_time: string
  duration: string
  status: string
  error: string
}

// export interface TaskArgItem {
//     flag: "up"|"down"|null,
//     label: string,
//     value: number|null,
//     interval: number|null,
//     key: number,
// }

export type Trigger = {
  enabled: boolean
  end_at: string
  end_time: string
  period: number
  range_time: Array<string[]>
  skip_days: Array<string>
  start_at: string
  start_time: string
  type: number
  weekdays: Array<number>
}
export type Task = {
  _id: string
  collection: string
  id: string
  interface_name: string
  msg: string
  name: string
  status: string
  start_time: string
  end_time: string
  duration: string
  next_time: string
  histories: Array<TaskHistory>
  trigger: Trigger; }

export type TaskArgs = Array<Trigger>
