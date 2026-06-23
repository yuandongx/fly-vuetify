type C = string | number | undefined

/** 监控任务相关API */
export const taskApi = {
  task: (id?: string) => id===undefined ? '/api/task' : `/api/task/${id}`,
  monitor: (id?: string) => id===undefined ? '/api/monitor' : `/api/monitor/${id}`,
}
/** 股票相关API */
export const stockApi = {
  fund: (id?: string) => id===undefined ? '/api/stock' : `/api/stock/${id}`,
  detail: (code: string) => `/api/stock/detail/${code}`,
  follow: (code: C, flag: number) => `/api/stock/follow/${code}/${flag}`,
}

/** 基金相关API */
export const fundApi = {
  list: (id?: string) => id===undefined ? '/api/fund' : `/api/fund/${id}`,
  favorite: (code: C, flag: number) => `/api/fund/favorite/${code}/${flag}`,
}
