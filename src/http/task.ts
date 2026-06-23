import { del, get, post, put } from './common'
import { taskApi } from './api'
import type { Params } from '@/types/common'

// ==================== 任务/监控相关接口 ====================

/** 获取监控列表 */
export async function getTaskList (params?: Params) {
  return await get(taskApi.task(), params)
}

/** 创建/更新监控任务 */
export async function saveTask (data: any) {
  return await post(taskApi.task(), data)
}

export async function updateTask (id: string, data: any) {
  return await put(taskApi.task(id), data)
}

/** 删除监控任务 */
export async function deleteTask (id: string) {
  return await del(taskApi.task(id))
}

/** 获取监控列表 */
export async function getMonitorList (params?: Params) {
  return await get(taskApi.monitor(), params)
}

/** 创建/更新监控任务 */
export async function saveMonitorTask (data: any) {
  return await post(taskApi.monitor(), data)
}

/** 删除监控任务 */
export async function deleteMonitorTask (id: string) {
  return await del(taskApi.monitor(id))
}
