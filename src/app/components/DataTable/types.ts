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
 * Agrupa los datos y configuración de cada tabla a renderizar
 */
export interface DataTableGroup<T> {
  /** Definiciones de columnas para la tabla */
  columns: ColumnDefinition<T>[]
  /** Conjunto de filas que se mostrarán */
  data: T[]
  /** Título visible de la tabla */
  title: string
  /** Habilita selección de filas */
  enableSelection?: boolean
  /** Permite colapsar la sección que contiene la tabla */
  enableCollaps?: boolean
  /** Clave inicial para ordenar */
  defaultSortKey?: keyof T
  /** Dirección inicial de ordenamiento */
  defaultSortDirection?: 'asc' | 'desc'
  /** Total de filas disponibles (para paginación externa) */
  totalRows?: number
  /**
   * Altura máxima del cuerpo de la tabla. Si se define,
   * el contenido excedente podrá desplazarse con scroll interno.
   * Acepta valores en px o cualquier unidad CSS válida.
   */
  scrollMaxHeight?: number | string
}

/**
 * Props del componente DataTable
 */
export interface DataTableProps<T = any> {
  /** Se ejecuta al presionar el botón de búsqueda */
  onSearch?: () => void
  /** Se ejecuta al cambiar el valor del campo de búsqueda */
  onSearchChange?: (
    value: string,
    startDate?: Date | null,
    endDate?: Date | null
  ) => void
  /** Se ejecuta al hacer clic en el botón de calendario */
  onCalendarClick?: () => void
  /** Se ejecuta al hacer clic en el botón de filtros */
  onFilterClick?: () => void
  /** Se ejecuta al hacer clic en el botón de acción principal */
  onTableActionClick?: () => void
  /** Etiqueta del botón de acción principal */
  actionLabel?: string
  /** Muestra el botón de calendario */
  showCalendar?: boolean
  /** Muestra el botón de filtros */
  showFilter?: boolean
  /** Muestra el botón de acción principal */
  showButton?: boolean
  /** Render personalizado de acciones adicionales */
  actionsRender?: () => React.ReactNode
  /** Tablas a mostrar */
  tables: DataTableGroup<T>[]
  /** Habilita la búsqueda interna por defecto */
  enableInternalSearch?: boolean
  /** Llaves utilizadas para la búsqueda interna */
  searchableKeys?: (keyof T)[]
  /** Habilita la paginación */
  enablePagination?: boolean
  /** Número máximo de filas por página */
  rowsPerPage?: number
  /** Callback de cambio de página */
  onPageChange?: (page: number) => void
  /**
   * Campo/selector de fecha por fila para filtrar por rango.
   * Puede ser clave del objeto o función que devuelva string/Date.
   */
  dateKey?: keyof T | ((row: T) => string | Date | undefined);
  /** Rango de fechas aplicado desde el calendario */
  onDateRangeChange?: (start: Date, end: Date) => void;
}

