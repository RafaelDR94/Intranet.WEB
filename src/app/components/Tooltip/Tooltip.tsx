import React from "react";
import clsx from "clsx";
import { tooltipStyles } from "./styles";
import { TooltipProps } from "./types";

/**
 * Componente `Tooltip` reutilizable para mostrar mensajes flotantes contextualizados.
 *
 * Permite mostrar un mensaje (tooltip) al pasar el cursor sobre el contenido hijo.
 * Soporta múltiples posiciones y estilos personalizados.
 *
 * @param text Texto que se mostrará en el tooltip
 * @param position Posición del tooltip relativa al contenido (`top`, `bottom`, `left`, `right`)
 * @param children Elemento sobre el que se mostrará el tooltip
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
