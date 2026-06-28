
import { get } from './common'
import { indicesApi } from './api'
import type { Params } from '@/types/common'

export async function getIndicesList (params?: Params) {   return await get(indicesApi.indices(), params) }