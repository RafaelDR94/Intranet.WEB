// types.ts
import { SpinnerSize } from "../Spinner/types";

export type LoadingOverlayProps = {
  open: boolean;
  message?: string;
  spinnerSize?: SpinnerSize;
  blur?: boolean;
  backdropOpacity?: number;
  ariaLabel?: string;
  /** 'viewport' => cubre toda la pantalla; 'container' => solo el contenedor relativo */
  scope?: 'viewport' | 'container';
};
