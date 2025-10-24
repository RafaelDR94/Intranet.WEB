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
}) => {
   const { handleToggle, selection } = useCheckBoxList({
       options,
       value,
       defaultValue,
       onChange,
       disabled,
   });

  return (
    <section
      data-testid={dataTestId}
      className={clsx("flex flex-col gap-3", className)}
      // aria-disabled={disabled}
    >
      <h3 className={clsx("text-b1 font-medium text-gray-70", titleClassName)}>
        {title}
      </h3>
      <div className={clsx("flex flex-col gap-2", optionsClassName)}>
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
