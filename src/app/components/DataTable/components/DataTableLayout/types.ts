
/**
 * Propiedades del encabezado del DataTable que contiene búsqueda y acciones
 */
export interface TableLayoutProps {
  /** Se ejecuta cuando el usuario escribe en la barra de búsqueda */
  onSearchChange?: (
    value: string,
    startDate?: Date | null,
    endDate?: Date | null
  ) => void
  /** Maneja el clic en el botón de calendario */
  onCalendarClick?: (start?: Date , end?: Date ) => void // admite rango
  /** Notifica el cambio de rango de fechas */
  onDateRangeChange?: (start?: Date , end?: Date ) => void
  /** Maneja el clic en el botón de filtros */
  onFilterClick?: () => void
  /** Callback ejecutado cuando el usuario selecciona un filtro del menú. */
  onFilterChange?: (value: string | null) => void
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
  /** Opciones disponibles para el menú de filtros. */
  filterOptions?: Array<{ label: string; value: string; disabled?: boolean }>
  /** Valor seleccionado actualmente en el menú de filtros. */
  filterValue?: string | null
  /** Título mostrado en el menú contextual de filtros. */
  filterTitle?: string
  /** Muestra el botón de acción principal */
  showButton?: boolean
  /** Muestra el botón de descarga de tabla */
  showDownloadTable?: boolean
    /** Deshabilita las opciones de descarga */
  downloadDisabled?: boolean
  /** Maneja la acción de descarga */
  onDownload?: (kind: 'pdf' | 'excel') => void

  /** Muestra conmutador de vista (lista/tarjetas) */
  showViewToggle?: boolean
  /** Vista actual: true si es tarjetas */
  isCardsView?: boolean
  /** Cambia la vista */
  onToggleView?: (isCards: boolean) => void
}
