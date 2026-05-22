/**
 * Props del componente `Tab`.
 */
export interface TabProps {
  /** Texto visible de la pestaña */
  label: string;

  /** Si la pestaña está seleccionada (estilo activo) */
  selected?: boolean;

  /** Si la pestaña está deshabilitada e inactiva */
  disabled?: boolean;

  /** Controla si se muestra el icono de navegación al final. */
  showTrailingIcon?: boolean;

  /** Función que se ejecuta al hacer clic en la pestaña */
  onClick?: () => void;
}
