export type CheckBoxListOption = {
  /** Identificador único del checkbox */
  value: string;
  /** Texto visible junto a la casilla */
  label: string;
  /** Permite deshabilitar la casilla individualmente */
  disabled?: boolean;
};

export type CheckBoxListOptionGroup = {
  /** Titulo visible del grupo de opciones */
  label: string;
  /** Opciones que pertenecen al grupo */
  options: CheckBoxListOption[];
};

export type CheckBoxListProps = {
  /** Título que se muestra en la parte superior de la lista */
  title: string;
  /** Opciones a renderizar */
  options: CheckBoxListOption[];
  /** Grupos opcionales para renderizar las opciones por secciones */
  optionGroups?: CheckBoxListOptionGroup[];
  /** Valores seleccionados en modo controlado */
  value?: string[];
  /** Valores iniciales en modo no controlado */
  defaultValue?: string[];
  /** Callback al cambiar la selección, devuelve todo el arreglo seleccionado */
  onChange?: (values: string[]) => void;
  /** Deshabilita todas las casillas */
  disabled?: boolean;
  /** Clases personalizadas para el contenedor */
  className?: string;
  /** Clase opcional para el título */
  titleClassName?: string;
  /** Clase opcional para el listado de opciones */
  optionsClassName?: string;
  /** Identificador para pruebas */
  dataTestId?: string;
  /** Posición de la etiqueta para todos los checkbox (default derecha) */
  labelPosition?: "left" | "right";
  /** Muestra el checkbox maestro para seleccionar/desmarcar todos */
  showSelectAll?: boolean;
  /** Define cuántas columnas usa la grilla de opciones */
  columns?: number;
};

export type UseCheckBoxListParams = {
  /** Opciones a renderizar */
  options: CheckBoxListOption[];
  /** Valores seleccionados en modo controlado */
  value?: string[];
  /** Valores iniciales en modo no controlado */
  defaultValue?: string[];
  /** Callback al cambiar la selección, devuelve todo el arreglo seleccionado */
  onChange?: (values: string[]) => void;
  /** Deshabilita todas las casillas */
  disabled?: boolean;
};

export type UseCheckBoxListReturn = {
  /** Alterna una opción individual */
  handleToggle: (option: CheckBoxListOption) => void;
  /** Selección normalizada considerando las opciones disponibles */
  selection: string[];
  /** Reemplaza la selección completa, útil para seleccionar/deseleccionar todos */
  setSelection: (values: string[]) => void;
};
