import { useCallback, useEffect, useRef, useState } from 'react';
import { UseNumberControlArgs,UseNumberControlReturn } from './types';
import { clamp,parseMaybeNumber } from '../utilities/numberControlutils';

/**
 * Hook para gestionar la lógica de NumberControl (controlado/no-controlado,
 * incrementos/decrementos, clamp, parsing y disables).
 */
export function useNumberControl({
  value,
  defaultValue = 0,
  min,
  max,
  step = 1,
  disabled = false,
  clampOnBlur = true,
  onChange,
}: UseNumberControlArgs): UseNumberControlReturn {
  const isControlled = typeof value === 'number';
  const [inner, setInner] = useState<number>(clamp(defaultValue, min, max));
  const liveValue = isControlled ? (value as number) : inner;

  const [editing, setEditing] = useState<string>(String(liveValue));
  const inputRef = useRef<HTMLInputElement>(null);

  const decDisabled =
    disabled || (typeof min === 'number' ? liveValue - step < min : false);
  const incDisabled =
    disabled || (typeof max === 'number' ? liveValue + step > max : false);

  const commit = useCallback(
    (next: number) => {
      const nextClamped = clamp(next, min, max);
      if (isControlled) {
        onChange?.(nextClamped);
      } else {
        setInner(nextClamped);
        onChange?.(nextClamped);
      }
      setEditing(String(nextClamped));
    },
    [isControlled, min, max, onChange],
  );

  const handleIncrement = useCallback(() => {
    if (disabled || incDisabled) return;
    commit(liveValue + step);
  }, [commit, disabled, incDisabled, liveValue, step]);

  const handleDecrement = useCallback(() => {
    if (disabled || decDisabled) return;
    commit(liveValue - step);
  }, [commit, disabled, decDisabled, liveValue, step]);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setEditing(e.target.value);
  };

  const handleInputBlur: React.FocusEventHandler<HTMLInputElement> = () => {
    const parsed = parseMaybeNumber(editing);
    if (parsed === null) {
      // No es número: regresa al valor vigente
      setEditing(String(liveValue));
      return;
    }
    commit(clampOnBlur ? clamp(parsed, min, max) : parsed);
  };

  // Mantén sincronizado el texto si cambia el valor “vivo”
  useEffect(() => {
    setEditing(String(liveValue));
  }, [liveValue]);

  return {
    liveValue,
    editing,
    inputRef,
    decDisabled,
    incDisabled,
    handleIncrement,
    handleDecrement,
    handleInputChange,
    handleInputBlur,
  };
}