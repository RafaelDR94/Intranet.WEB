// src/app/components/DataTable/types.ts

/**
 * Define la estructura de cada columna de la tabla
 */
export interface ColumnDefinition<T> {
  /** Clave del objeto a mostrar */
  key: keyof T
  /** Etiqueta visible en el encabezado */
  label?: string
  /** Render personalizado del contenido */
  render?: (row: T) => React.ReactNode
  /** Render personalizado header */
  headerRender?: () => React.ReactNode
  /** Clases extra para el encabezado */
  headerClass?: string
  /** Clases extra para la celda */
  cellClass?: string
}

/**
 * Props del componente DataTable
 */

export interface DataTableGroup<T = any> {
  columns: ColumnDefinition<T>[]
  data: T[]
  title: string
  enableSelection?: boolean
  enableCollaps?: boolean
  defaultSortKey?: keyof T
  defaultSortDirection?: 'asc' | 'desc'
}

export interface DataTableProps<T = any> {
  // Props generales para el layout y header
  onSearch?: () => void
  onSearchChange?: (value: string) => void
  onCalendarClick?: () => void
  onFilterClick?: () => void
  onTableActionClick?: () => void
  actionLabel?: string
  showCalendar?: boolean
  showFilter?: boolean
  showButton?: boolean
  actionsRender?: () => React.ReactNode
  tables: DataTableGroup<T>[]
  enableInternalSearch?: boolean
  searchableKeys?: (keyof T)[]
}

