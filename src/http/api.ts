type C = string | number | undefined

/** 认证相关API */
export const authApi = {
  login: () => '/api/auth/login',
}

/** 监控任务相关API */
export const taskApi = {
  task: (id?: string) => id===undefined ? '/api/task' : `/api/task/${id}`,
  /**
 * 生成监控任务的 API 路径，支持获取全部列表或按 ID 获取单个详情
 * @param {string} [id] - 监控任务 ID，省略时返回列表路径
 * @returns {string} 对应的 API 路径
 */
monitor: (id?: string) => id===undefined ? '/api/monitor' : `/api/monitor/${id}`,
}
/** 股票相关API */
export const stockApi = {
  stock: (id?: string) => id===undefined ? '/api/stock' : `/api/stock/${id}`,
}

/** 基金相关API */
export const fundApi = {
  fund: (id?: string) => id===undefined ? '/api/fund' : `/api/fund/${id}`,
  favorite: (code: C, flag: number) => `/api/fund/favorite/${code}/${flag}`,
}

/** 监控相关API */
export const monitorApi = {
  fund: (id?: string) => id===undefined ? '/api/monitor' : `/api/monitor/${id}`,
  favorite: (code: C, flag: number) => `/api/monitor/favorite/${code}/${flag}`,
}

/** 其他相关API */
export const indicesApi = {
  indices: (id?: string) => id===undefined ? '/api/zs' : `/api/zs/${id}`,
}