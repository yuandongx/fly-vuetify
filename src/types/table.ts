export interface TableRow {
  [key: string]: number | string
}

export interface TableColumn {
  id: number
  key: string
  title: string
  color?: boolean
  isPercent?: boolean
  arrow?: boolean
  sortable?: false, 
  align?: "start" | "end" | "center" | undefined,
  width?: string | number | undefined;
  maxWidth?: string | number | undefined;
}
