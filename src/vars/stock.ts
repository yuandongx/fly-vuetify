import type { StockColumn } from '@/types/stock';

export const stockColumns: Array<StockColumn> = [
    {
        id: 1,
        title: '股票代码',
        key: 'code',
    },
    {
        id: 2,
        title: '股票名称',
        key: 'name',
    },
    {
        id: 3,
        title: "最新价",
        key: "open"
    },
    {
        id: 4,
        title: '今日最高',
        key: 'high',
    },
    {
        id: 5,
        title: '今日最低',
        key: 'low',
    },
    {
        id: 6,
        title: '最新价',
        key: 'trade',
    },
    {
        id: 7,
        title: '今日变化',
        key: 'pricechange',
        arrow: true,
        color: true,
    },
    {
        id: 8,
        title: '今日变化率',
        key: 'changepercent',
        isPercent: true,
        color: true,
        arrow: true,
    },
    {
        id: 9,
        title: '今日开盘价',
        key: 'open',
    },
    {
        id: 10,
        title: '昨收',
        key: 'settlement',
    },
    {
        id: 11,
        title: '更新时间',
        key: 'update_time',
    }
]
export const FOLLOW_COLUMNS: Array<StockColumn> = [...stockColumns.slice(0, 9)
    , {
    id: 10,
    title: '关注时价格',
    key: 'follow_price',
}, {
    id: 11,
    title: '从关注至今变化',
    key: 'change_since_follow',
    arrow: true,
    color: true,
}, {
    id: 12,
    title: '从关注至今变率',
    key: 'change_percent_since_follow',
    isPercent: true,
    arrow: true,
    color: true,
}
    , {
    id: 13,
    title: '从关注至今变率',
    key: 'change_percent_since_follow',
    isPercent: true,
    arrow: true,
    color: true,
}
    , {
    id: 13,
    title: '更新时间',
    key: 'update_time',
}
];
