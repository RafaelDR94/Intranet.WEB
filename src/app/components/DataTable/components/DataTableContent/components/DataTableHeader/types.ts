import { ColumnDefinition } from "@/app/components/DataTable/types"

export interface TableHeaderProps<T> {
  columns: ColumnDefinition<T>[]
  enableSelection: boolean
  disableSelection?: boolean
  allSelected: boolean
  onSelectAll: (value: boolean) => void
  sortKey: keyof T | null
  sortDirection: 'asc' | 'desc' | null
  onSort: (key: keyof T) => void
}