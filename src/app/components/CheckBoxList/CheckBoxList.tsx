import React from "react";
import clsx from "clsx";

import { Checkbox } from "../CheckBox/CheckBox";
import type { CheckBoxListProps } from "./types";
import useCheckBoxList from "./hooks/useCheckBoxList";

const CheckBoxList: React.FC<CheckBoxListProps> = ({
  title,
  options,
  value,
  defaultValue,
  onChange,
  disabled = false,
  className,
  dataTestId,
  labelPosition = "right",
  titleClassName,
  optionsClassName,
  showSelectAll = false,
  columns = 1, // prop para definir columnas
}) => {
  const { handleToggle, selection, setSelection } = useCheckBoxList({
    options,
    value,
    defaultValue,
    onChange,
    disabled,
  });

  const selectableValues = options
    .filter((option) => !option.disabled)
    .map((option) => option.value);

  const selectableValuesSet = new Set(selectableValues);

  const allSelected = selectableValues.every((value) => selection.includes(value));

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      const nextSelection = Array.from(
        new Set([...selection, ...selectableValues]),
      );
      setSelection(nextSelection);
      return;
    }

    const nextSelection = selection.filter(
      (value) => !selectableValuesSet.has(value),
    );
    setSelection(nextSelection);
  };

  return (
    <section
      data-testid={dataTestId}
      className={clsx("flex flex-col gap-3", className)}
    >
      <div className="flex justify-between items-center w-full">
        <h3
          className={clsx("text-b2 text-gray-70 font-medium", titleClassName)}
        >
          {title}
        </h3>
        {showSelectAll && (
          <Checkbox
            checked={allSelected}
            indeterminate={
              selection.some((value) => selectableValuesSet.has(value)) &&
              !allSelected
            }
            onChange={handleToggleAll}
            label="Seleccionar todo"
            disabled={disabled}
            labelPosition={labelPosition}
          />
        )}
      </div>

      {/* ✅ Se usa CSS Grid para columnas dinámicas */}
      <div
        className={clsx(
          "gap-2",
          optionsClassName,
        )}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {options.map((option) => (
          <Checkbox
            key={option.value}
            checked={selection.includes(option.value)}
            onChange={() => handleToggle(option)}
            label={option.label}
            disabled={disabled || option.disabled}
            labelPosition={labelPosition}
            className="w-full"
          />
        ))}
      </div>
    </section>
  );
};

export default CheckBoxList;
