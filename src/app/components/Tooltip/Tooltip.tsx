import React from "react";
import clsx from "clsx";
import { tooltipStyles } from "./styles";
import { TooltipProps } from "./types";

/**
 * Tooltip flotante para mostrar mensajes contextualizados al pasar el cursor
 * (o al enfocar, si tus estilos lo contemplan).
 *
 * @remarks
 * - La **visibilidad** del tooltip suele controlarse con CSS (p. ej. `:hover` del contenedor).
 * - Si deseas que también aparezca al **enfocar** con teclado, agrega estilos para `:focus-within`.
 * - Se añaden atributos ARIA para mejorar la accesibilidad:
 *   - El contenido del tooltip usa `role="tooltip"`.
 *   - El contenedor expone `aria-describedby` apuntando al tooltip.
 *
 * @accessibility
 * - Si el hijo no es enfoc-able, considera envolverlo en un elemento con `tabIndex={0}` o un control nativo.
 * - `aria-describedby` ayuda a lectores de pantalla aunque el tooltip se controle con CSS.
 *
 * @example
 * ```tsx
 * <Tooltip text="Editar" position="right">
 *   <button>✏️</button>
 * </Tooltip>
 * ```
 */
export const Tooltip: React.FC<TooltipProps> = ({
  children,
  text,
  position = "top",
}) => {
  return (
    <div className={tooltipStyles.tooltipCtn}>
      {children}
      <div
        className={clsx(tooltipStyles.tooltip, tooltipStyles.tooltipAfter, {
          [tooltipStyles.tooltipTop]: position === "top",
          [tooltipStyles.tooltipBottom]: position === "bottom",
          [tooltipStyles.tooltipLeft]: position === "left",
          [tooltipStyles.tooltipRight]: position === "right",
        })}
      >
        {text}
      </div>
    </div>
  );
};
