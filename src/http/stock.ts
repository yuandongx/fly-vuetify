import { stockApi } from './api'
import { get, post } from './common'

export async function getStockList (params?: Record<string, string>) {
  return await get(stockApi.list, params)
}
