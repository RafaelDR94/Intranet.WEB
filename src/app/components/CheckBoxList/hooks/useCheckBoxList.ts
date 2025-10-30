import { useCallback, useEffect, useState } from "react";

import type {
  CheckBoxListOption,
  UseCheckBoxListParams,
  UseCheckBoxListReturn,
} from "../types";

const normalizeInitial = (
  options: CheckBoxListOption[],
  values: string[] | undefined,
): string[] => {
  if (!values) return [];
  const optionValues = new Set(options.map((option) => option.value));
  return values.filter((value) => optionValues.has(value));
};

const useCheckBoxList = ({
  options,
  value,
  defaultValue,
  onChange,
  disabled,
}: UseCheckBoxListParams): UseCheckBoxListReturn => {
  const [internalSelection, setInternalSelection] = useState<string[]>(() =>
    normalizeInitial(options, defaultValue),
  );

  const isControlled = value !== undefined;
  const selection = isControlled
    ? normalizeInitial(options, value)
    : internalSelection;

  useEffect(() => {
    if (!isControlled) {
      setInternalSelection(normalizeInitial(options, defaultValue));
    }
  }, [defaultValue, isControlled, options]);

  const applySelection = useCallback(
    (nextSelection: string[]) => {
      const normalized = normalizeInitial(options, nextSelection);

      if (!isControlled) {
        setInternalSelection(normalized);
      }

      onChange?.(normalized);
    },
    [isControlled, onChange, options],
  );

  const handleToggle = useCallback(
    (option: CheckBoxListOption) => {
      if (disabled || option.disabled) return;

      const exists = selection.includes(option.value);
      const nextSelection = exists
        ? selection.filter((value) => value !== option.value)
        : [...selection, option.value];

      applySelection(nextSelection);
    },
    [applySelection, disabled, selection],
  );

  return {
    handleToggle,
    selection,
    setSelection: applySelection,
  };
};

export default useCheckBoxList;
