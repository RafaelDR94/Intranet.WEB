import { ColumnDefinition } from "../../types"
export interface DataTableContentProps<T> {
  data: T[]
  columns: ColumnDefinition<T>[]
  enableSelection?: boolean
  defaultSortKey?: keyof T
  defaultSortDirection?: 'asc' | 'desc'
}