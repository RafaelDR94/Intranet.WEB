import { ColumnDefinition, SelectionMode } from '../../types'

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
  /** Controla si la selecci?n es simple o m?ltiple */
  selectionMode?: SelectionMode
  /** Data-tour para checkbox de seleccion por fila */
  selectionDataTour?: (row: T, index: number) => string | undefined
  /** Identificadores de filas que deben iniciar seleccionadas */
  initialSelectedIds?: Array<T['id']>
  /** Clave inicial para ordenar */
  defaultSortKey?: keyof T
  /** Dirección inicial de ordenamiento */
  defaultSortDirection?: 'asc' | 'desc'
  /** Habilita la paginación */
  enablePagination?: boolean
  /** Número máximo de filas por página */
  disableSelection?: boolean
  rowsPerPage?: number
  /** Total de filas disponibles (para paginación externa) */
  totalRows?: number
  /** Indica si la búsqueda es interna */
  enableInternalSearch?: boolean
  /** Callback cuando cambia la página */
  onPageChange?: (page: number) => void
  /** Callback cuando cambia la selección de filas */
  onSelectedChange?: (selected: T[]) => void
  showButton?: boolean;
  actionsRender?: () => React.ReactNode;
  onTableActionClick?: () => void;
  actionLabel?: string;
}
