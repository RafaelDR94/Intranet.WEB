import React, { SVGProps } from 'react';

import type { Breakpoints, ResponsiveLayoutMatrix } from '@/app/components/DynamicForm/types';

export type InfoItem = {
  label: string;
  value?: React.ReactNode;
  className?: string;
  dataTestId?: string;
  icon?: React.FC<SVGProps<SVGSVGElement>>;
};

export interface InfoCardsProps {
  /** Matriz de tarjetas. Cada subarreglo representa una tarjeta. */
  cards: InfoItem[][];
  /** Distribución fija por filas (cada fila suma 10). Tiene prioridad. */
  layoutMatrix?: number[][];
  /** Distribución responsiva por breakpoint con fallback inteligente. */
  responsiveLayoutMatrix?: ResponsiveLayoutMatrix;
  /** Breakpoints en px. Default: { sm: 640, md: 1024 } */
  breakpoints?: Breakpoints;
  /** Clases del contenedor */
  className?: string;
  /** Clase de anchura máxima (ej: 'max-w-6xl'), centrado automático */
  maxWidthClassName?: string;
  /** Clases del card individual */
  cardClassName?: string;
  /** Clases para el contenedor interno de cada ítem */
  itemClassName?: string;
  /** Test id base del contenedor */
  dataTestId?: string;
}
