import { get } from './common'
import { fundApi } from './api'
import type { Params } from '@/types/common'

// ==================== 基金相关接口 ====================

/** 基金列表(收藏) */
export async function getFundFavorite (code: string, flag: number) {
  return await get(fundApi.favorite(code, flag))
}

/** 获取基金列表 */
export async function getFundList (params?: Params) {
  return await get(fundApi.list || '/api/fund/list', params)
}
