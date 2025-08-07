'use client'

import React, { useState } from 'react';
import { CollapsibleSectionProps } from './types';
import { cn } from '@/app/utilities/classname';
import styles from './styles';
import ArrowDown from '@/assets/icons/navegacion/nav-arrow-down.svg';
import ArrowUp from '@/assets/icons/navegacion/nav-arrow-up.svg';
/**
 * `CollapsibleSection` es un componente reutilizable que permite mostrar y ocultar contenido de forma interactiva.
 * Utiliza un botón con íconos SVG personalizados (flecha hacia arriba o abajo) y un divisor visual alineado a la derecha del título.
 *
 * ### Props:
 * - `title`: string — Título que se muestra en el encabezado de la sección.
 * - `children`: ReactNode — Contenido interno que se renderiza cuando la sección está expandida.
 * - `defaultOpen`: boolean — (opcional) Indica si la sección debe iniciarse abierta (por defecto: `true`).
 * - `className`: string — (opcional) Clases adicionales para el wrapper.
 * -`enableCollapse`: boolean — (opcional) Habilita o deshabilita el comportamiento colapsable..
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.title - Título visible de la sección.
 * @param {React.ReactNode} props.children - Contenido interno que será mostrado o colapsado.
 * @param {boolean} [props.defaultOpen=true] - Controla si la sección inicia expandida.
 * @param {boolean} [props.enableCollapse=true] - Habilita o deshabilita el comportamiento colapsable.
 * @param {string} [props.className] - Clases adicionales para el wrapper principal.

 *
 * ### Ejemplo de uso:
 * ```tsx
 * <CollapsibleSection title="Historial de eventos" defaultOpen={false}>
 *   <EventTable data={data} />
 * </CollapsibleSection>
 * ```
 */
export const CollapsibleSection = ({
  title,
  children,
  defaultOpen = true,
  enableCollapse = true,
  className,
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className={cn(styles.wrapper, className)}>
      <button
        type="button"
        className={styles.header}
        aria-expanded={isOpen}
        onClick={() => { if (enableCollapse) setIsOpen(!isOpen) }}
      >
        <div className={styles.headerContent}>
          {enableCollapse && (isOpen ? <ArrowDown className={styles.icon} /> : <ArrowUp className={styles.icon} />)}
          <span className={styles.title}>{title}</span>
        </div>
        <div className={styles.divider} />
      </button>
      {isOpen && <div className={styles.content}>{children}</div>}
    </section>
  );
};

export default CollapsibleSection;
