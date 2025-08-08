/**
 * Estructura básica utilizada por el hook para filtrar datos de la tabla
 */
export interface Table<T> {
  /** Conjunto de filas que se evaluarán */
  data: T[]
}

/**
 * Parámetros aceptados por el hook `useDataTable`
 */
export interface UseDataTableParams<T extends { id: string | number }> {
  /** Se ejecuta al cambiar el término de búsqueda */
  onSearchChange?: (
    value: string,
    startDate?: Date | null,
    endDate?: Date | null
  ) => void
  /** Habilita la búsqueda interna de manera predeterminada */
  enableInternalSearch?: boolean
  /** Llaves consideradas al realizar la búsqueda */
  searchableKeys?: (keyof T)[]
  /** Campo de fecha o función para obtenerla (string "DD/MM/YYYY" o Date) */
  dateKey?: keyof T | ((row: T) => string | Date | undefined)
}