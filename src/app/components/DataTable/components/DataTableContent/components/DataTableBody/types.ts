import { ColumnDefinition, SelectionMode } from "@/app/components/DataTable/types"
export interface DataTableBodyProps<T> {
  data: T[]
  columns: ColumnDefinition<T>[]
  enableSelection: boolean
  disableSelection?:boolean
  selectionMode?: SelectionMode
  selected: T[]
  onToggleSelect: (item: T) => void
}