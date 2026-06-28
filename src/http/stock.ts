import { get } from './common'
import { stockApi } from './api'
import type { Params } from '@/types/common'

// ==================== 股票相关接口 ====================

/** 获取股票列表 */
export async function getStockList (params?: Params) {
  return await get(stockApi.stock(), params)
}

