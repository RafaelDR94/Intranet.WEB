export type Item = {
  title: string;
  description?: string;
  image?: string;
};

export interface ActivitiesViewerProps {
  items: Item[];
  dataTestId?: string;
  maxWidthClassName?: string; // e.g. max-w-6xl
  /** Opcional: forzar columnas (1..3). Útil para tests o contenedores especiales */
  columns?: number;
}
