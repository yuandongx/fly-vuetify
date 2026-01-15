export interface TableRow {
    [key: string]: number | string;
}

export interface TableColumn {
  id: number;
  key: string;
  title: string;
  color?: boolean;
  isPercent?: boolean;
  arrow?: boolean;
}