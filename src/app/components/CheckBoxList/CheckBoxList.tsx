import React from "react";
import clsx from "clsx";

import { Checkbox } from "../CheckBox/CheckBox";
import type { CheckBoxListProps } from "./types";
import useCheckBoxList from "./hooks/useCheckBoxList";

const CheckBoxList: React.FC<CheckBoxListProps> = ({
  title,
  options,
  optionGroups,
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
  const hasGroups = Boolean(optionGroups?.length);
  const effectiveOptions = React.useMemo(
    () =>
      hasGroups
        ? (optionGroups ?? []).flatMap((group) => group.options)
        : options,
    [hasGroups, optionGroups, options],
  );

  const { handleToggle, selection, setSelection } = useCheckBoxList({
    options: effectiveOptions,
    value,
    defaultValue,
    onChange,
    disabled,
  });

  const selectableValues = effectiveOptions
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
        {hasGroups
          ? optionGroups?.map((group) => (
              <div key={group.label} className="flex min-w-0 flex-col gap-2">
                <h4 className="text-b2 text-green-80 font-medium">
                  {group.label}
                </h4>
                <div className="flex flex-col gap-2">
                  {group.options.map((option) => (
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
              </div>
            ))
          : options.map((option) => (
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
