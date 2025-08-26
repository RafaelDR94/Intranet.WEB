import { ColumnDefinition } from "@/app/components/DataTable/types"
export interface DataTableBodyProps<T> {
  data: T[]
  columns: ColumnDefinition<T>[]
  enableSelection: boolean
  selected: T[]
  onToggleSelect: (item: T) => void
}