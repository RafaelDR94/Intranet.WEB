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
}