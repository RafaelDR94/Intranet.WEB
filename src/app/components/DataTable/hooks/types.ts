import type { ColumnDefinition } from "../types"

/**
 * Estructura basica utilizada por el hook para filtrar datos de la tabla.
 */
export interface Table<T> {
  /** Conjunto de filas que se evaluaran. */
  data: T[]
  /** Columnas visibles usadas como fuente adicional de busqueda y fecha. */
  columns?: ColumnDefinition<T>[]
}

/**
 * Parametros aceptados por el hook `useDataTable`.
 */
export interface UseDataTableParams<T extends { id: string | number }> {
  /** Se ejecuta al cambiar el termino de busqueda. */
  onSearchChange?: (
    value: string,
    startDate?: Date | null,
    endDate?: Date | null
  ) => void
  /** Habilita la busqueda interna de manera predeterminada. */
  enableInternalSearch?: boolean
  /** Llaves consideradas al realizar la busqueda. */
  searchableKeys?: (keyof T)[]
  /** Campo de fecha o funcion para obtenerla. */
  dateKey?: keyof T | ((row: T) => string | Date | undefined)
  /** Se ejecuta al cambiar la seleccion de filas. */
  onSelectedChange?: (index: number, rows: T[]) => void
}
