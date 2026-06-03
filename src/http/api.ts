type C = string | number | undefined

/** 监控任务相关API */
export const monitorApi = {
  task: '/api/v1/task',
  monitor: '/api/v1/monitor',
}

/** 股票相关API */
export const stockApi = {
  list: '/api/stock',
  follow: (code: C, flag: number) => `/api/stock/follow/${code}/${flag}`,
}

/** 基金相关API */
export const fundApi = {
  list: '/api/fund',
  favorite: (code: C, flag: number) => `/api/fund/favorite/${code}/${flag}`,
}
