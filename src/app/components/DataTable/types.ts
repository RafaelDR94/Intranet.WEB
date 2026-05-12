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
   * Si usas `render`, esta clave puede usarse solo como “identificador semántico”.
   */
  key: keyof T;
  /** Etiqueta visible en el encabezado de la columna. Omite para usar `key` en su lugar. */
  label?: string;
  /**
   * Render personalizado del contenido de la celda.
   * Si se define, tiene prioridad sobre el render “por clave”.
   */
  render?: (row: T) => React.ReactNode;
  /**
   * Render personalizado del encabezado de la columna.
   * Útil para incluir íconos, tooltips o estilos avanzados.
   */
  headerRender?: () => React.ReactNode;
  /** Clases extra de Tailwind para el encabezado. */
  headerClass?: string;
  /** Clases extra de Tailwind para la celda. */
  cellClass?: string;
  /** Si `true`, oculta la columna tanto en encabezado como en filas. */
  invisible?: boolean;
}

/**
 * Agrupa los datos y configuración de cada tabla a renderizar dentro de `DataTable`.
 *
 * @template T Tipo de la fila (objeto) renderizada en esta tabla.
 */
export interface DataTableGroup<T> {
  /** Definiciones de columnas para la tabla */
  columns: ColumnDefinition<T>[]
  /** Conjunto de filas que se mostrarán */
  data: T[]
  /** Identificadores de filas que deben iniciar seleccionadas */
  initialSelectedRowIds?: Array<any>
  /** Título visible de la tabla */
  title: string
  /** Esconde el titulo */
  hidetitle?: boolean
  /** Habilita selección de filas */
  enableSelection?: boolean
  /** Controla si la selecci?n es simple o m?ltiple */
  selectionMode?: SelectionMode
  /** Data-tour para checkbox de seleccion por fila */
  selectionDataTour?: (row: T, index: number) => string | undefined
  /** Permite colapsar la sección que contiene la tabla */
  enableCollaps?: boolean

  /**Deja visible la seleccion pero no permite el click */
  disableSelection?: boolean
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
  /** Adaptador para vista como tarjetas (opcional por tabla) */
  cardAdapt?: CardAdapt<T>
  /** Nuevo: tamaño de texto específico para esta tabla (fallback global en DataTable) */
  textSize?: TextSize
}

/** Opción disponible dentro del menú de filtros del DataTable. */
export interface DataTableFilterOption<T, Value extends string = string> {
  /** Texto mostrado en la opción. */
  label: string
  /** Valor que identifica la opción. */
  value: Value
  /** Permite deshabilitar la opción. */
  disabled?: boolean
  /** Predicado opcional utilizado por consumidores para filtrar datos. */
  predicate?: (row: T) => boolean
}

/**
 * Props del componente `DataTable`.
 *
 * Este componente puede renderizar una o múltiples tablas con:
 * - Búsqueda interna/externa
 * - Filtro por rango de fechas
 * - Paginación
 * - Selección de filas y descarga (opcional)
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
  /** Se ejecuta al presionar el botón de búsqueda (modo externo). */
  onSearch?: () => void;
  /**
   * Se ejecuta al cambiar el valor del campo de búsqueda (modo externo o mixto).
   * Si usas `enableInternalSearch`, también puedes escuchar aquí para telemetría o analítica.
   */
  onSearchChange?: (
    value: string,
    startDate?: Date | null,
    endDate?: Date | null
  ) => void;
  /** Se ejecuta al hacer clic en el botón de calendario (abrir date picker externo, etc.). */
  onCalendarClick?: (start?: Date, end?: Date) => void
  /** Se ejecuta al hacer clic en el botón de filtros (abrir un drawer o modal de filtros). */
  onFilterClick?: () => void;
  /** Se ejecuta al hacer clic en el botón de acción principal (p.ej. “Agregar”). */
  onTableActionClick?: () => void;
  /** Etiqueta del botón de acción principal (por defecto: `'Agregar'`). */
  actionLabel?: string;
  /** Muestra el botón de calendario (por defecto: `true`). */
  showCalendar?: boolean;
  /** Muestra el campo de búsqueda (por defecto: `true`). */
  showSearch?: boolean;
  /** Muestra el botón de filtros (por defecto: `false`). */
  showFilter?: boolean;
  /** Muestra el botón de recarga parcial del contenido. */
  showRefresh?: boolean;
  /** Data-tour para input de bóºsqueda */
  searchDataTour?: string;
  /** Data-tour para calendario */
  calendarDataTour?: string;
  /** Data-tour para filtros */
  filterDataTour?: string;
  /** Data-tour para botón refrescar */
  refreshDataTour?: string;
  /** Data-tour para botón de acción principal */
  actionButtonDataTour?: string;
  /** Opciones mostradas dentro del menú contextual de filtros. */
  filterOptions?: DataTableFilterOption<T>[];
  /** Valor seleccionado actualmente en el filtro. */
  filterValue?: string | null;
  /** Título visible dentro del menú contextual de filtros. */
  filterTitle?: string;
  /** Callback ejecutado cuando se selecciona una opción del filtro. */
  onFilterChange?: (
    value: string,
    option?: DataTableFilterOption<T>,
  ) => void;
  /** Ejecuta la recarga del contenido visible cuando se presiona el botón de actualizar. */
  onRefreshPage?: () => void;
  /** Muestra el botón de acción principal (por defecto: `true`). */
  showButton?: boolean;
  /**
   * Muestra el botón/menú para descargar selección o tablas (por defecto: `false`).
   * La lógica de descarga se maneja internamente via `useDataTable`.
   */
  showDownloadTable?: boolean;
  /**
   * Render personalizado para agregar acciones adicionales en el header.
   * Si lo usas y no quieres el botón principal, pon `showButton={false}`.
   */
  actionsRender?: () => React.ReactNode;
  /** Colección de tablas a renderizar. Si el array tiene longitud > 1, se renderiza un header global. */
  tables: DataTableGroup<T>[];
  /**
   * Habilita la búsqueda interna (por defecto: `true`).
   * - `true`: filtra localmente usando `searchableKeys`.
   * - `false`: la búsqueda depende de `onSearch`/`onSearchChange` externos.
   */
  enableInternalSearch?: boolean;
  /**
   * Lista de claves del objeto `T` usadas para filtrar en la búsqueda interna.
   * Requeridas si `enableInternalSearch` es `true`.
   */
  searchableKeys?: (keyof T)[];
  /** Habilita la paginación (por defecto: `true`). */
  enablePagination?: boolean;
  /** Número máximo de filas por página (por defecto: `10`). */
  rowsPerPage?: number;
  /** Callback de cambio de página (modo controlado/externo). */
  onPageChange?: (page: number) => void;
  /**
   * Campo/selector de fecha por fila para filtrar por rango de fechas.
   * Puede ser la clave de T o una función que derive la fecha.
   */
  dateKey?: keyof T | ((row: T) => string | Date | undefined);
  /** Rango de fechas aplicado desde el calendario (si administras el date picker fuera). */
  onDateRangeChange?: (start: Date, end: Date) => void;
  /** Callback invocado cuando cambia la selección de filas en una tabla. */
  onSelectedChange?: (index: number, rows: T[]) => void;
  /** Título global de la (o las) tablas. Se usa en descargas y cabeceras. */
  dataTableTitle?: string;
  /** Inicia con la tabla colapsada. */
  startCollpas?: boolean;
  /** Si es verdadero, intenta renderizar cada tabla como grilla de tarjetas usando `cardAdapt` */
  useCardsView?: boolean;
  /** Muestra el conmutador de vista en el layout */
  showViewSwitcher?: boolean;
   /** Nuevo: tamaño de texto global (fallback si la tabla no define textSize) */
  textSize?: TextSize
  rightContent?: React.ReactNode
}

/** Mapeo de campos para adaptar filas (T) a tarjetas renderizables */
export interface CardAdapt<T> {
  /** key o función para el título */
  titleKey: keyof T | ((row: T) => string)
  /** key o función para el label pequeño */
  labelKey?: keyof T | ((row: T) => string)
  /** key o función para la descripción */
  descriptionKey?: keyof T | ((row: T) => string)
  /** key o función para la URL de imagen */
  imageKey?: keyof T | ((row: T) => string)
  /** Acción primaria (click en botón principal) */
  onPrimaryAction: (row: T) => void
  /** Etiqueta de botón primario */
  primaryLabel?: string
  /** Acción secundaria opcional */
  onSecondaryAction?: (row: T) => void
  /** Etiqueta de botón secundario */
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
  /** Número de tarjetas por página (opcional, por defecto `rowsPerPage`) */
  cardsPerPage?: number
}




