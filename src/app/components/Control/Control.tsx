import React from "react";
import { Minus, Plus } from "lucide-react";
import clsx from "clsx";
import { controlStyles } from "./styles";
import { ControlProps } from "./types";

/**
 * Componente `Control` reutilizable que permite aumentar o disminuir un valor numérico.
 *
 * Presenta dos botones (incrementar y decrementar) con íconos y estilos condicionales,
 * ideal para componentes como contadores, selectores de cantidad, etc.
 *
 * @param value Valor numérico actual (no se muestra visualmente en el componente)
 * @param onIncrement Función que se ejecuta al hacer clic en el botón de incremento
 * @param onDecrement Función que se ejecuta al hacer clic en el botón de decremento
 * @param variant Variante de estilo visual: `"filled"` o `"outlined"` (por defecto: `"filled"`)
 */
export const Control = ({
  value,
  onIncrement,
  onDecrement,
  variant = "filled",
}: ControlProps) => {
  const isFilled = variant === "filled";

  return (
    <div
      className={clsx(
        controlStyles.controlCtn,
        isFilled
          ? controlStyles.controlIsFilled
          : controlStyles.controlIsOutlined
      )}
    >
      <button
        onClick={onDecrement}
        className={clsx(
          controlStyles.controlOnDecrement,
          isFilled
            ? controlStyles.controlTextFilled
            : controlStyles.controlTextOutlined
        )}
      >
        <Minus
            data-testid="minus-icon"
            className={controlStyles.minusIcon}
        />
      </button>

      <div className={controlStyles.controlDivider} />

      <button
        onClick={onIncrement}
        className={clsx(
          controlStyles.controlOnIncrement,
          isFilled
            ? controlStyles.onIncrementTextFilled
            : controlStyles.onIncrementTextOutlined
        )}
      >
        <Plus
            data-testid="plus-icon"
            className={controlStyles.plusIcon}
        />
      </button>
    </div>
  );
};
