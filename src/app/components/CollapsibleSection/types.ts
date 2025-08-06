// types.ts
import { ReactNode } from 'react';

export type CollapsibleSectionProps = {
  /** Título visible de la sección */
  title: string;
  /** Contenido interno a mostrar/ocultar */
  children: ReactNode;
  /** Habilita o deshabilita el comportamiento colapsable (por defecto: true) */
  enableCollapse?: boolean;
  /** Si la sección debe iniciar expandida (por defecto: true) */
  defaultOpen?: boolean;
  /** Clases adicionales para el wrapper */
  className?: string;
  /** Posición del ícono de colapso */
  iconPosition?: 'left' | 'right';
};
