/**
 * Props del componente `CustomRadio`.
 */
export type CustomRadioProps = {
  /** Identificador único del input */
  id: string;

  /** Nombre del grupo de botones de radio */
  name: string;

  /** Etiqueta visible junto al botón */
  label?: string;

  /** Valor asignado al botón */
  value: string;

  /** Indica si el botón está seleccionado */
  checked: boolean;

  /** Desactiva el botón si es `true` */
  disabled?: boolean;

  /** Callback que se ejecuta al cambiar la selección */
  onChange: (value: string) => void;
};
