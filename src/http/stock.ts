import { get } from './common'
import { stockApi } from './api'
import type { Params } from '@/types/common'

// ==================== 股票相关接口 ====================

/** 获取股票列表 */
export async function getStockList (params?: Params) {
  return await get(stockApi.list, params)
}

/** 关注/取消关注股票 */
export async function followStock (code: string, flag: number) {
  return await get(stockApi.follow(code, flag))
}
