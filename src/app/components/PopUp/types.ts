// src/app/components/PopUp/types.ts

/**
 * Props del componente `PopUp`.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Título del pop-up */
  title?: string;

  /** Contenido o mensaje a mostrar dentro del pop-up */
  content?: string;

  /** Si se debe mostrar el botón de acción principal */
  showPrimaryButton?: boolean;

  /** Si se debe mostrar el botón de acción secundaria */
  showSecondaryButton?: boolean;

  /** Texto para el botón principal (por defecto: "Aceptar") */
  primaryButtonText?: string;

  /** Texto para el botón secundario (por defecto: "Cancelar") */
  secondaryButtonText?: string;

  /** Callback al hacer clic en el botón principal */
  onPrimaryButtonClick?: () => void;

  /** Callback al hacer clic en el botón secundario */
  onSecondaryButtonClick?: () => void;

  /** Contenido adicional que se renderiza dentro del pop-up */
  children?: React.ReactNode;
}
