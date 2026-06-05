import { ColumnDefinition, SelectionMode } from '../../types'

/**
 * Propiedades del componente que renderiza el contenido de la tabla
 */
export interface DataTableContentProps<T extends { id: string | number }> {
  /** Datos a mostrar en el cuerpo de la tabla */
  data: T[]
  /** DefiniciÃ³n de columnas y sus renderizadores */
  columns: ColumnDefinition<T>[]
  /** Permite la selecciÃ³n de filas */
  enableSelection?: boolean
  /** Controla si la selecci?n es simple o m?ltiple */
  selectionMode?: SelectionMode
  /** Data-tour para checkbox de seleccion por fila */
  selectionDataTour?: (row: T, index: number) => string | undefined
  /** Identificadores de filas que deben iniciar seleccionadas */
  initialSelectedIds?: Array<T['id']>
  /** Clave inicial para ordenar */
  defaultSortKey?: keyof T
  /** DirecciÃ³n inicial de ordenamiento */
  defaultSortDirection?: 'asc' | 'desc'
  /** Habilita la paginaciÃ³n */
  enablePagination?: boolean
  /** Controla si la paginaciÃ³n se resuelve localmente o desde el servidor */
  paginationMode?: "client" | "server"
  /** NÃºmero mÃ¡ximo de filas por pÃ¡gina */
  disableSelection?: boolean
  rowsPerPage?: number
  /** PÃ¡gina actual controlada por el consumidor en modo server */
  currentPage?: number
  /** Total de filas disponibles (para paginaciÃ³n externa) */
  totalRows?: number
  /** Indica si la bÃºsqueda es interna */
  enableInternalSearch?: boolean
  /** Callback cuando cambia la pÃ¡gina */
  onPageChange?: (page: number) => void
  /** Callback cuando cambia la selecciÃ³n de filas */
  onSelectedChange?: (selected: T[]) => void
  showButton?: boolean;
  actionsRender?: () => React.ReactNode;
  onTableActionClick?: () => void;
  actionLabel?: string;
}

