export type ErrorScreenProps = {
  title?: string;
  message?: string;
  error?: Error | null;
  /** stack y componentStack se muestran sólo en no-producción si se proveen */
  stack?: string | null;
  componentStack?: string | null;
  onGoHome?: () => void;
  onRetry?: () => void;
  className?: string;
  /** Forzar mostrar detalles en producción (por defecto false) */
  forceShowDetails?: boolean;
};