export interface TableHead {
  title: string
  key: keyof StockRow
}

// StockRow 包含了不确定个字段，每个字段的类型都是 number | string
export interface StockRow {
  [key: string]: number | string
}
export interface StockColumn {
  id: number
  key: string
  title: string
  color?: boolean
  isPercent?: boolean
  arrow?: boolean
}

export interface StockResponse {
  data: StockRow[]
  total: number
  msg: string
  code: number
}
