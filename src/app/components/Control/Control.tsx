// src/app/components/Control/Control.tsx
import clsx from 'clsx';
import { Minus, Plus } from 'lucide-react';
import React from 'react';

import { controlCtn, controlBtn, controlDivider, iconClass } from './styles';
import { ControlProps } from './types';

/**
 * Control numérico con soporte de tamaños (`sm`, `md`, `lg`) y disables granulares.
 *
 * @component
 * @remarks
 * - Usa `inputSize` para alinear visualmente con el tamaño de tu `<Input>`.
 * - `disable` desactiva todo el control; `disablePlus` y `disableMinus` desactivan cada botón por separado.
 * - Si no pasas `onIncrement` o `onDecrement`, el botón correspondiente se deshabilita automáticamente.
 * - Accesible: se aplican `disabled`, `aria-disabled` y `tabIndex={-1}` cuando corresponde.
 *
 * @param {() => void}   [onIncrement]  Callback invocado al presionar el botón **+**. Si no se provee, el botón se deshabilita.
 * @param {() => void}   [onDecrement]  Callback invocado al presionar el botón **−**. Si no se provee, el botón se deshabilita.
 * @param {boolean}      [disable=false]       Deshabilita **todo** el control (ambos botones).
 * @param {boolean}      [disablePlus=false]   Deshabilita **solo** el botón **+** (no afecta al botón −).
 * @param {boolean}      [disableMinus=false]  Deshabilita **solo** el botón **−** (no afecta al botón +).
 * @param {'sm'|'md'|'lg'} [inputSize='md']    Tamaño visual del control, alineado con el componente `Input`.
 * @param {string}       [className]    Clases CSS extra para el contenedor.
 *
 * @example
 * // Control tamaño md, ambos botones activos
 * <Control
 *   inputSize="md"
 *   onIncrement={() => setQty(q => q + 1)}
 *   onDecrement={() => setQty(q => Math.max(0, q - 1))}
 * />
 *
 * @example
 * // Deshabilita solo el botón +
 * <Control
 *   inputSize="lg"
 *   onIncrement={() => setQty(q => q + 1)}
 *   onDecrement={() => setQty(q => Math.max(0, q - 1))}
 *   disablePlus
 * />
 *
 * @since 1.0.0
 */
export const Control: React.FC<ControlProps> = ({
  onIncrement,
  onDecrement,
  disable = false,
  disablePlus = false,
  disableMinus = false,
  inputSize = 'md',
  className,
}) => {
  // Estado efectivo de discapacitación por botón
  const isMinusDisabled = disable || disableMinus || !onDecrement;
  const isPlusDisabled = disable || disablePlus || !onIncrement;

  return (
    <div
      className={clsx(controlCtn(inputSize, className))}
      aria-disabled={disable ? 'true' : 'false'}
    >
      <button
        type="button"
        onClick={isMinusDisabled ? undefined : onDecrement}
        disabled={isMinusDisabled}
        aria-disabled={isMinusDisabled ? 'true' : 'false'}
        tabIndex={isMinusDisabled ? -1 : 0}
        className={controlBtn(inputSize, isMinusDisabled)}
      >
        <Minus data-testid="minus-icon" className={iconClass(inputSize)} />
      </button>

      <div className={controlDivider(inputSize)} />

      <button
        type="button"
        onClick={isPlusDisabled ? undefined : onIncrement}
        disabled={isPlusDisabled}
        aria-disabled={isPlusDisabled ? 'true' : 'false'}
        tabIndex={isPlusDisabled ? -1 : 0}
        className={controlBtn(inputSize, isPlusDisabled)}
      >
        <Plus data-testid="plus-icon" className={iconClass(inputSize)} />
      </button>
    </div>
  );
};
