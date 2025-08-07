
/**
 * Propiedades del encabezado del DataTable que contiene búsqueda y acciones
 */
export interface TableLayoutProps {
  /** Se ejecuta cuando el usuario escribe en la barra de búsqueda */
  onSearchChange?: (value: string) => void
  /** Maneja el clic en el botón de calendario */
  onCalendarClick?: () => void
  /** Maneja el clic en el botón de filtros */
  onFilterClick?: () => void
  /** Maneja el clic en el botón de acción principal */
  onTableActionClick?: () => void
  /** Se ejecuta al confirmar la búsqueda */
  onSearch?: () => void
  /** Render opcional de acciones adicionales */
  actionsRender?: () => React.ReactNode
  /** Texto del botón de acción principal */
  actionLabel?: string
  /** Muestra el botón de calendario */
  showCalendar?: boolean
  /** Muestra el botón de filtros */
  showFilter?: boolean
  /** Muestra el botón de acción principal */
  showButton?: boolean
}
