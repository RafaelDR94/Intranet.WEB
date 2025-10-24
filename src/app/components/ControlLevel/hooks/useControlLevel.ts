import { useCallback, useMemo, useState } from "react";
import type { ControlLevelProps } from "../types";

const clampValue = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const useControlLevel = (props: ControlLevelProps) => {
  const {
    title = "Nivel",
    showSemicircle = true,
    showLinear = true,
    min = 0,
    max = 1,
    divisions = 4,
    labelMode = "fraction",
    decimals = 2,
    level: controlledLevel,
    setLevel: controlledSetLevel,
    onChange,
    className,
    initialValue,
  } = props;

  const [internalLevel, setInternalLevel] = useState<number>(() =>
    clampValue(initialValue ?? min, min, max)
  );
  const level = controlledLevel ?? internalLevel;

  const clamp = useCallback(
    (value: number) => clampValue(value, min, max),
    [min, max]
  );

  const setLevel = useCallback(
    (value: number) => {
      const next = clamp(value);
      if (controlledSetLevel) controlledSetLevel(next);
      else setInternalLevel(next);
      onChange?.(next);
    },
    [clamp, controlledSetLevel, onChange]
  );

  const fractionLabel = useMemo(() => {
    if (divisions <= 0) return "0";
    const step = (max - min) / divisions;
    if (step === 0) return "0";
    const index = Math.round((level - min) / step);
    const numerator = Math.max(0, Math.min(divisions, index));
    if (numerator === 0) return "0";
    if (numerator === divisions) return "1";
    return `${numerator}/${divisions}`;
  }, [divisions, level, max, min]);

  const numericLabel = useMemo(() => {
    const factor = Math.pow(10, decimals);
    const rounded = Math.round(clamp(level) * factor) / factor;
    return rounded.toFixed(decimals);
  }, [clamp, decimals, level]);

  const label = labelMode === "fraction" ? fractionLabel : numericLabel;

  const shouldOffsetLinear = showSemicircle && showLinear;

  return {
    title,
    showSemicircle,
    showLinear,
    min,
    max,
    divisions,
    labelMode,
    decimals,
    className,
    level,
    label,
    setLevel,
    shouldOffsetLinear,
  };
};

export default useControlLevel;

