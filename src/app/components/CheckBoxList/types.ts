export type CheckBoxListOption = {
  /** Identificador único del checkbox */
  value: string;
  /** Texto visible junto a la casilla */
  label: string;
  /** Permite deshabilitar la casilla individualmente */
  disabled?: boolean;
};

export type CheckBoxListProps = {
  /** Título que se muestra en la parte superior de la lista */
  title: string;
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
};


export type useCheckBoxListProps = {

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
