export interface MenuItem {
  label: string
  to?: string
  key: string
  children?: MenuItem[]
}

export const menuItems: MenuItem[] = [
  {
    label: '首页',
    to: '/',
    key: 'home',
  },
  {
    label: '股票',
    to: '/stock',
    key: 'stock',
  },
  {
    label: '基金',
    to: '/fund',
    key: 'fund',
    children: [
      {
        label: '全部基金',
        to: '/fund/all',
        key: 'fund-all',
      },
      {
        label: '基金排行',
        to: '/fund/rank',
        key: 'fund-rank',
      },
    ],
  },
  {
    label: '关注',
    to: '/follow',
    key: 'follow',
    children: [
      {
        label: '股票',
        to: '/follow/stock',
        key: 'follow-stock',
      },
      {
        label: '基金',
        to: '/follow/fund',
        key: 'follow-fund',
      },
    ],
  },
  {
    label: '任务',
    to: '/task',
    key: 'task',
    children: [
      {
        label: '任务运行',
        to: '/task/running',
        key: 'task-running',
      },
      {
        label: '市场监控',
        to: '/task/monitor',
        key: 'task-market-monitor',
      },
    ],
  },
  {
    label: '笔记',
    to: '/note',
    key: 'note',
  },
]