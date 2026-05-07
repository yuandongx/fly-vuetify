import { get, post } from './common';
import { stockApi } from './api';

export async function getStockList(params?: Record<string, string>) {
    return await get(stockApi.list, params);
}

