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
    to: '/favorate',
    key: 'favorate',
    children: [
      {
        label: '股票',
        to: '/favorate/stock',
        key: 'favorate-stock',
      },
      {
        label: '基金',
        to: '/favorate/fund',
        key: 'favorate-fund',
      },
    ],
  },
  {
    label: '任务',
    to: '/task',
    key: 'task',
  },
  {
    label: '笔记',
    to: '/note',
    key: 'note',
  },
]