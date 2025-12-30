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
        label: '国际基金',
        to: '/fund/foreign',
        key: 'fund-foreign',
      },
      {
        label: '国内基金',
        to: '/fund/internal',
        key: 'fund-internal',
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