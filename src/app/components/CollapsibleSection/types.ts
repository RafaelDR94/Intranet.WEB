// types.ts
import { ReactNode } from 'react';

export type CollapsibleSectionProps = {
  /** Título visible de la sección */
  title: ReactNode;
  /** Contenido interno a mostrar/ocultar */
  children: ReactNode;
  /** Habilita o deshabilita el comportamiento colapsable (por defecto: true) */
  enableCollapse?: boolean;
  /** Si la sección debe iniciar expandida (por defecto: true) */
  defaultOpen?: boolean;
  /** Clases adicionales para el wrapper */
  className?: string;
  /** Renderiza contenido al lado del divider */
  rightContent?: React.ReactNode;
  /** Permite ocultar el divider */
  showDivider?: boolean;
};
