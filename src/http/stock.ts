import { get, post } from './common';

export async function getStockList(params?: Record<string, string>) {
    return await get('/api/stock/list/all', params);
}

