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
  const { handleToggle, selection } = useCheckBoxList({
    options,
    value,
    defaultValue,
    onChange,
    disabled,
  });

  const allSelected = options.every(
    (option) => selection.includes(option.value) || option.disabled,
  );

  const handleToggleAll = () => {
    const selectableOptions = options.filter((opt) => !opt.disabled);
    if (allSelected) {
      selectableOptions.forEach((option) => {
        if (selection.includes(option.value)) {
          handleToggle(option);
        }
      });
    } else {
      selectableOptions.forEach((option) => {
        if (!selection.includes(option.value)) {
          handleToggle(option);
        }
      });
    }
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
