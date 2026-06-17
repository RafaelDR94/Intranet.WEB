import type { ActionMenuCellProps } from "../ActionMenuCell/types"
import type { Variant } from "../Button/types"
import type { TextSize } from "./components/DataTableContent/components/DataTableBody/DataTableBody"

export type SelectionMode = "single" | "multiple"

/**
 * Define la estructura de cada columna de la tabla.
 *
 * @template T Tipo de la fila (objeto) que renderiza la tabla.
 *
 * @example
 * interface User { id: number; name: string; role: string }
 * const columns: ColumnDefinition<User>[] = [
 *   { key: 'name', label: 'Nombre' },
 *   {
 *     key: 'role',
 *     label: 'Rol',
 *     render: (row) => <Badge>{row.role}</Badge>,
 *     headerClass: 'text-left',
 *     cellClass: 'truncate',
 *   },
 * ];
 */
export interface ColumnDefinition<T> {
  /**
   * Clave del objeto a mostrar en la celda (propiedad de T).
   * Si usas `render`, esta clave puede usarse solo como â€œidentificador semÃ¡nticoâ€.
   */
  key: keyof T;
  /** Etiqueta visible en el encabezado de la columna. Omite para usar `key` en su lugar. */
  label?: string;
  /**
   * Render personalizado del contenido de la celda.
   * Si se define, tiene prioridad sobre el render â€œpor claveâ€.
   */
  render?: (row: T) => React.ReactNode;
  /**
   * Render personalizado del encabezado de la columna.
   * Ãštil para incluir Ã­conos, tooltips o estilos avanzados.
   */
  headerRender?: () => React.ReactNode;
  /** Clases extra de Tailwind para el encabezado. */
  headerClass?: string;
  /** Clases extra de Tailwind para la celda. */
  cellClass?: string;
  /** Si es `false`, desactiva el ordenamiento en esta columna. */
  sortable?: boolean;
  /** Si es `false`, oculta el indicador visual de ordenamiento sin desactivar el sort. */
  showSortIndicator?: boolean;
  /** Si `true`, oculta la columna tanto en encabezado como en filas. */
  invisible?: boolean;
}

/**
 * Agrupa los datos y configuraciÃ³n de cada tabla a renderizar dentro de `DataTable`.
 *
 * @template T Tipo de la fila (objeto) renderizada en esta tabla.
 */
export interface DataTableGroup<T> {
  /** Definiciones de columnas para la tabla */
  columns: ColumnDefinition<T>[]
  /** Conjunto de filas que se mostrarÃ¡n */
  data: T[]
  /** Identificadores de filas que deben iniciar seleccionadas */
  initialSelectedRowIds?: Array<any>
  /** TÃ­tulo visible de la tabla */
  title: string
  /** Esconde el titulo */
  hidetitle?: boolean
  /** Habilita selecciÃ³n de filas */
  enableSelection?: boolean
  /** Controla si la selecci?n es simple o m?ltiple */
  selectionMode?: SelectionMode
  /** Data-tour para checkbox de seleccion por fila */
  selectionDataTour?: (row: T, index: number) => string | undefined
  /** Permite colapsar la secciÃ³n que contiene la tabla */
  enableCollaps?: boolean

  /**Deja visible la seleccion pero no permite el click */
  disableSelection?: boolean
  /** Clave inicial para ordenar */
  defaultSortKey?: keyof T
  /** DirecciÃ³n inicial de ordenamiento */
  defaultSortDirection?: 'asc' | 'desc'
  /** Total de filas disponibles (para paginaciÃ³n externa) */
  totalRows?: number
  /**
   * Altura mÃ¡xima del cuerpo de la tabla. Si se define,
   * el contenido excedente podrÃ¡ desplazarse con scroll interno.
   * Acepta valores en px o cualquier unidad CSS vÃ¡lida.
   */
  scrollMaxHeight?: number | string
  /** Adaptador para vista como tarjetas (opcional por tabla) */
  cardAdapt?: CardAdapt<T>
  /** Nuevo: tamaÃ±o de texto especÃ­fico para esta tabla (fallback global en DataTable) */
  textSize?: TextSize
}

/** OpciÃ³n disponible dentro del menÃº de filtros del DataTable. */
export interface DataTableFilterOption<T, Value extends string = string> {
  /** Texto mostrado en la opciÃ³n. */
  label: string
  /** Valor que identifica la opciÃ³n. */
  value: Value
  /** Permite deshabilitar la opciÃ³n. */
  disabled?: boolean
  /** Predicado opcional utilizado por consumidores para filtrar datos. */
  predicate?: (row: T) => boolean
}

/**
 * Props del componente `DataTable`.
 *
 * Este componente puede renderizar una o mÃºltiples tablas con:
 * - BÃºsqueda interna/externa
 * - Filtro por rango de fechas
 * - PaginaciÃ³n
 * - SelecciÃ³n de filas y descarga (opcional)
 *
 * @template T Tipo de la fila que renderiza cada tabla (debe incluir `id`).
 *
 * @example
 * <DataTable<User>
 *   tables={[{ title: 'Usuarios', columns, data, enableSelection: true }]}
 *   enableInternalSearch
 *   searchableKeys={['name', 'role']}
 *   showCalendar
 *   onDateRangeChange={(s, e) => console.log(s, e)}
 * />
 */
export interface DataTableProps<T = any> {
  /** Se ejecuta al presionar el botÃ³n de bÃºsqueda (modo externo). */
  onSearch?: () => void;
  /**
   * Se ejecuta al cambiar el valor del campo de bÃºsqueda (modo externo o mixto).
   * Si usas `enableInternalSearch`, tambiÃ©n puedes escuchar aquÃ­ para telemetrÃ­a o analÃ­tica.
   */
  onSearchChange?: (
    value: string,
    startDate?: Date | null,
    endDate?: Date | null
  ) => void;
  /** Se ejecuta al hacer clic en el botÃ³n de calendario (abrir date picker externo, etc.). */
  onCalendarClick?: (start?: Date, end?: Date) => void
  /** Se ejecuta al hacer clic en el botÃ³n de filtros (abrir un drawer o modal de filtros). */
  onFilterClick?: () => void;
  /** Se ejecuta al hacer clic en el botÃ³n de acciÃ³n principal (p.ej. â€œAgregarâ€). */
  onTableActionClick?: () => void;
  /** Etiqueta del botÃ³n de acciÃ³n principal (por defecto: `'Agregar'`). */
  actionLabel?: string;
  /** Muestra el botÃ³n de calendario (por defecto: `true`). */
  showCalendar?: boolean;
  /** Muestra el campo de bÃºsqueda (por defecto: `true`). */
  showSearch?: boolean;
  /** Muestra el botÃ³n de filtros (por defecto: `false`). */
  showFilter?: boolean;
  /** Muestra el botÃ³n de recarga parcial del contenido. */
  showRefresh?: boolean;
  /** Data-tour para input de bÃ³Âºsqueda */
  searchDataTour?: string;
  /** Data-tour para calendario */
  calendarDataTour?: string;
  /** Data-tour para filtros */
  filterDataTour?: string;
  /** Data-tour para botÃ³n refrescar */
  refreshDataTour?: string;
  /** Data-tour para botÃ³n de acciÃ³n principal */
  actionButtonDataTour?: string;
  /** Opciones mostradas dentro del menÃº contextual de filtros. */
  filterOptions?: DataTableFilterOption<T>[];
  /** Valor seleccionado actualmente en el filtro. */
  filterValue?: string | null;
  /** TÃ­tulo visible dentro del menÃº contextual de filtros. */
  filterTitle?: string;
  /** Callback ejecutado cuando se selecciona una opciÃ³n del filtro. */
  onFilterChange?: (
    value: string,
    option?: DataTableFilterOption<T>,
  ) => void;
  /** Ejecuta la recarga del contenido visible cuando se presiona el botÃ³n de actualizar. */
  onRefreshPage?: () => void;
  /** Muestra el botÃ³n de acciÃ³n principal (por defecto: `true`). */
  showButton?: boolean;
  /**
   * Muestra el botÃ³n/menÃº para descargar selecciÃ³n o tablas (por defecto: `false`).
   * La lÃ³gica de descarga se maneja internamente via `useDataTable`.
   */
  showDownloadTable?: boolean;
  /**
   * Render personalizado para agregar acciones adicionales en el header.
   * Si lo usas y no quieres el botÃ³n principal, pon `showButton={false}`.
   */
  actionsRender?: () => React.ReactNode;
  /** ColecciÃ³n de tablas a renderizar. Si el array tiene longitud > 1, se renderiza un header global. */
  tables: DataTableGroup<T>[];
  /**
   * Habilita la bÃºsqueda interna (por defecto: `true`).
   * - `true`: filtra localmente usando `searchableKeys`.
   * - `false`: la bÃºsqueda depende de `onSearch`/`onSearchChange` externos.
   */
  enableInternalSearch?: boolean;
  /**
   * Lista de claves del objeto `T` usadas para filtrar en la bÃºsqueda interna.
   * Requeridas si `enableInternalSearch` es `true`.
   */
  searchableKeys?: (keyof T)[];
  /** Habilita la paginaciÃ³n (por defecto: `true`). */
  enablePagination?: boolean;
  /** Controla si la paginaciÃ³n se resuelve localmente o desde el servidor. */
  paginationMode?: "client" | "server";
  /** NÃºmero mÃ¡ximo de filas por pÃ¡gina (por defecto: `10`). */
  rowsPerPage?: number;
  /** PÃ¡gina actual controlada por el consumidor en modo server. */
  currentPage?: number;
  /** Callback de cambio de pÃ¡gina (modo controlado/externo). */
  onPageChange?: (page: number) => void;
  /**
   * Campo/selector de fecha por fila para filtrar por rango de fechas.
   * Puede ser la clave de T o una funciÃ³n que derive la fecha.
   */
  dateKey?: keyof T | ((row: T) => string | Date | undefined);
  /** Rango de fechas aplicado desde el calendario (si administras el date picker fuera). */
  onDateRangeChange?: (start: Date, end: Date) => void;
  /** Callback invocado cuando cambia la selecciÃ³n de filas en una tabla. */
  onSelectedChange?: (index: number, rows: T[]) => void;
  /** TÃ­tulo global de la (o las) tablas. Se usa en descargas y cabeceras. */
  dataTableTitle?: string;
  /** Inicia con la tabla colapsada. */
  startCollpas?: boolean;
  /** Si es verdadero, intenta renderizar cada tabla como grilla de tarjetas usando `cardAdapt` */
  useCardsView?: boolean;
  /** Muestra el conmutador de vista en el layout */
  showViewSwitcher?: boolean;
   /** Nuevo: tamaÃ±o de texto global (fallback si la tabla no define textSize) */
  textSize?: TextSize
  rightContent?: React.ReactNode
}

/** Mapeo de campos para adaptar filas (T) a tarjetas renderizables */
export interface CardAdapt<T> {
  /** key o funciÃ³n para el tÃ­tulo */
  titleKey: keyof T | ((row: T) => string)
  /** key o funciÃ³n para el label pequeÃ±o */
  labelKey?: keyof T | ((row: T) => string)
  /** key o funciÃ³n para la descripciÃ³n */
  descriptionKey?: keyof T | ((row: T) => string)
  /** key o funciÃ³n para la URL de imagen */
  imageKey?: keyof T | ((row: T) => string)
  /** AcciÃ³n primaria (click en botÃ³n principal) */
  onPrimaryAction: (row: T) => void
  /** Etiqueta de botÃ³n primario */
  primaryLabel?: string
  /** AcciÃ³n secundaria opcional */
  onSecondaryAction?: (row: T) => void
  /** Etiqueta de botÃ³n secundario */
  secondaryLabel?: string
  /** Mostrar/ocultar botones */
  showPrimaryButton?: boolean
  showSecondaryButton?: boolean
  /** Variant visual del boton secundario */
  secondaryVariant?: Variant
  /** Enable opening image preview in fullscreen */
  enableImagePreview?: boolean
  /** Props para renderizar el menu contextual en cada tarjeta */
  actionMenuProps?: (row: T) => ActionMenuCellProps<T>
  /** NÃºmero de tarjetas por pÃ¡gina (opcional, por defecto `rowsPerPage`) */
  cardsPerPage?: number
}





