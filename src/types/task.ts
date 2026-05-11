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

// ==================== 监控任务类型 ====================

/** 通知类型 */
export type NoticeType = 'rise' | 'fall' | 'stable'

/** 通知单位 */
export type NoticeUnit = 'percent' | 'price' | 'amount'

/** 通知配置 */
export interface NoticeConfig {
  noticeType: NoticeType
  noticeUnit: NoticeUnit
  noticeValue: number
  key?: string|number
}

/** 股票信息 */
export interface StockInfo {
  name: string
  code: string
}

/** 监控记录 */
export interface MonitorRecord {
  id?: string
  code: string
  name: string
  stock: StockInfo | null
  noticeConfigs: NoticeConfig[]
  start_date: string
  start_price: number
}

/** 通知配置(提交格式) */
export interface NoticeConfigSubmit {
  id: string
  notice_type: NoticeType
  notice_unit: NoticeUnit
  notice_value: number
}

/** 监控记录提交数据 */
export interface MonitorSubmitData {
  id?: string
  code: string
  name: string
  notice_configs: NoticeConfigSubmit[]
  start_date: string
  start_price: number
}
