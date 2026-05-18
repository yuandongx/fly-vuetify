import { del, get, post } from './common'
import { stockApi, monitorApi, fundApi } from './api'
import type { Params } from '@/types/common'

// ==================== 任务/监控相关接口 ====================

/** 获取监控列表 */
export async function getTaskist (params?: Params) {
  return await get(monitorApi.task, params)
}

/** 创建/更新监控任务 */
export async function saveTask (data: any) {
  return await post(monitorApi.task, data)
}

/** 删除监控任务 */
export async function deleteTask (id: string) {
  return await del(`${monitorApi.task}/${id}`)
}

/** 获取监控列表 */
export async function getMonitorList (params?: Params) {
  return await get(monitorApi.monitor, params)
}

/** 创建/更新监控任务 */
export async function saveMonitorTask (data: any) {
  return await post(monitorApi.monitor, data)
}

/** 删除监控任务 */
export async function deleteMonitorTask (id: string) {
  return await post(`${monitorApi.monitor}/delete`, { id })
}

// ==================== 交易记录相关接口 ====================

/** 交易记录API */
export const tradeApi = {
  list: '/api/v1/trade/list',
  add: '/api/v1/trade/add',
  update: '/api/v1/trade/update',
  delete: '/api/v1/trade/delete',
}

/** 获取交易记录列表 */
export async function getTradeList (params?: Params) {
  return await get(tradeApi.list, params)
}

/** 添加交易记录 */
export async function addTradeRecord (data: Record<string, unknown>) {
  return await post(tradeApi.add, data)
}

/** 更新交易记录 */
export async function updateTradeRecord (id: string, data: Record<string, unknown>) {
  return await post(tradeApi.update, { id, ...data })
}

/** 删除交易记录 */
export async function deleteTradeRecord (id: string) {
  return await post(tradeApi.delete, { id })
}
