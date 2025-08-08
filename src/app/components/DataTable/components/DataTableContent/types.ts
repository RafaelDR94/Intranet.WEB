import { ColumnDefinition } from '../../types'

/**
 * Propiedades del componente que renderiza el contenido de la tabla
 */
export interface DataTableContentProps<T extends { id: string | number }> {
  /** Datos a mostrar en el cuerpo de la tabla */
  data: T[]
  /** Definición de columnas y sus renderizadores */
  columns: ColumnDefinition<T>[]
  /** Permite la selección de filas */
  enableSelection?: boolean
  /** Clave inicial para ordenar */
  defaultSortKey?: keyof T
  /** Dirección inicial de ordenamiento */
  defaultSortDirection?: 'asc' | 'desc'
  /** Habilita la paginación */
  enablePagination?: boolean
  /** Número máximo de filas por página */
  rowsPerPage?: number
  /** Total de filas disponibles (para paginación externa) */
  totalRows?: number
  /** Indica si la búsqueda es interna */
  enableInternalSearch?: boolean
  /** Callback cuando cambia la página */
  onPageChange?: (page: number) => void
}