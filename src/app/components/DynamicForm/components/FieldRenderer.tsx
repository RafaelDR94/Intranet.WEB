import React from "react";
import clsx from "clsx";

import { Checkbox } from "../../CheckBox/CheckBox";
import CheckBoxList from "../../CheckBoxList/CheckBoxList";
import type { CheckBoxListOption } from "../../CheckBoxList/types";
import { ControlLevel } from "../../ControlLevel/ControlLevel";
import { FileUploader } from "../../FileUploader/FileUploader";
import ImageUploaderExpanded from "../../ImageUploaderExpanded/ImageUploaderExpanded";
import { Input } from "../../Input/Input";
import { helperClasses } from "../../Input/styles";
import type { InputVariant } from "../../Input/types.tsx";
import { NumberControl } from "../../NumberControl/NumberControl";
import { Select } from "../../Select/Select";
import { ToggleButton } from "../../ToogleButton/ToogleButton";

import { fieldRendererStyles } from "./styles";
import type { FieldRendererProps } from "./types";

/**
 * Renderiza un campo individual dentro de un formulario dinámico.
 * El tipo de campo se determina por `field.type`.
 *
 * @param field Modelo del campo, incluyendo tipo, label, opciones, etc.
 * @param value Valor actual del campo desde Formik
 * @param allValues Todos los valores del formulario (para `onChange` condicionales)
 * @param onChange Callback al cambiar el valor
 * @param onBlur Callback opcional para eventos de blur
 * @param variant Variante visual del campo (`default`, `success`, `warning`, etc.)
 * @param helperText Texto auxiliar o mensaje de error
 */

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  allValues,
  onChange,
  onBlur,
  variant,
  helperText,
  formDataTestId,
}) => {
  const baseProps = {
    label: field.label,
    name: field.name,
    placeholder: field.placeholder,
    helperText,
    variant,
    inputSize: field.inputSize || "md",
    className: field.className,
  };

  const handleChange = (newValue: any) => {
    const nextValue = field.onChange?.(newValue, allValues);
    onChange(nextValue !== undefined ? nextValue : newValue);
  };

  const handleFocus = (newValue: any) => {
    const nextValue = field.onFocus?.(newValue, allValues);
    if (nextValue !== undefined) {
      onChange(nextValue);
    }
  };

  if (field.onlyText) {
    let rendervalue = value || field.value;
    if (field.type === "select") {
      rendervalue = field.options?.find(
        (opt) => opt.value === field?.value
      )?.label;
    }
    return (
      <div className={fieldRendererStyles.onlyTextContainer}>
        {field.label && (
          <label className={fieldRendererStyles.onlyTextLabel}>
            {field.label} :
          </label>
        )}
        <span className={fieldRendererStyles.onlyTextValue}>{rendervalue}</span>
      </div>
    );
  }

  switch (field.type) {
    case "select":
      return (
        <Select
          {...baseProps}
          selected={[value ?? field.value]}
          onChange={(vals) => handleChange(vals[0])}
          options={(field.options || []).map((opt) => ({
            ...opt,
          }))}
          disabled={field.disabled}
        />
      );

    case "multiSelect":
      return (
        <Select
          {...baseProps}
          multiple
          selected={value ?? field.value}
          onChange={(vals) => handleChange(vals)}
          options={(field.options || []).map((opt) => ({
            ...opt,
          }))}
          disabled={field.disabled}
        />
      );

    case "checkbox":
      return (
        <Checkbox
          checked={value ?? field.value}
          onChange={handleChange}
          label={field.label}
          disabled={field.disabled}
          className={field.className}
          dataTestId={formDataTestId ? `${formDataTestId}-${field.name}` : undefined}
        />
      );

    case "toggle":
      return (
        <ToggleButton
          checked={value ?? field.value}
          onChange={handleChange}
          label={field.label}
          className={field.className}
          disabled={field.disabled}
          dataTestId={formDataTestId ? `${formDataTestId}-${field.name}` : undefined}
        />
      );

    case "file":
      return (
        <div className={fieldRendererStyles.fileWrapper}>
          <FileUploader
            accept={field.accept || ""}
            label={field.label}
            placeholder={field.placeholder}
            value={value instanceof File ? value : null}
            onFile={handleChange}
            disabled={field.disabled}
            className={field.className}
            icon={field.icon}
            initialFile={field.initialFile}
            dataTestId={formDataTestId ? `${formDataTestId}-${field.name}` : undefined}
          />
          {helperText && (
            <span className={helperClasses(variant as InputVariant)}>
              {helperText}
            </span>
          )}
        </div>
      );
    case "imageUploaderExpanded":
      return (
        <div className={fieldRendererStyles.fileWrapper}>
          <ImageUploaderExpanded
            label={field.label}
            placeholder={field.placeholder}
            onImage={handleChange}
            disabled={field.disabled}
            className={field.className}
            defaultFacingMode={field.defaultFacingMode}
            accept={field.accept || "image/*"}
            buttonLabel={field.buttonLabel}
            cameraLabels={field.cameraLabels}
            cameraButtonAriaLabel={field.cameraButtonAriaLabel}
            initialFile={field.initialFile}
            initialFiles={field.initialFiles}
            dataTestId={formDataTestId ? `${formDataTestId}-${field.name}` : undefined}
            preview={field.preview}
            multiple={field.multiple}
          />
          {helperText && (
            <span className={helperClasses(variant as InputVariant)}>
              {helperText}
            </span>
          )}
        </div>
      );
    case "numberControl":
      return (
        <NumberControl
          label={field.label}
          value={value === null ? undefined : (value as number)}
          onChange={handleChange}
          min={field.min}
          max={field.max}
          step={field.step}
          size={(field.inputSize as any) || "md"}
          variant={field.disabled ? "disabled" : (variant as any)}
          disabled={field.disabled}
          helperText={helperText}
          className={field.className}
          dataTestId={formDataTestId ? `${formDataTestId}-${field.name}` : undefined}
        />
      );
    case "controlLevel": {
      const controlLevelProps = field.controlLevelProps ?? {};
      const {
        className: controlLevelClassName,
        title,
        initialValue,
        ...restControlProps
      } = controlLevelProps;
      const numericValue =
        typeof value === "number"
          ? value
          : initialValue ?? restControlProps.min ?? 0;

      return (
        <div className="flex flex-col gap-1">
          <ControlLevel
            {...restControlProps}
            title={title ?? field.label}
            className={clsx(
              controlLevelClassName,
              field.className,
              field.disabled && "pointer-events-none opacity-60"
            )}
            level={numericValue}
            setLevel={field.disabled ? () => undefined : handleChange}
            initialValue={initialValue}
          />
          {helperText && (
            <span className={helperClasses(variant as InputVariant)}>
              {helperText}
            </span>
          )}
        </div>
      );
    }
    case "checkboxList": {
      const options = (field.options ?? []) as CheckBoxListOption[];
      const arrayValue = Array.isArray(value)
        ? value
        : Array.isArray(field.value)
        ? (field.value as string[])
        : [];

      return (
        <div className="flex flex-col gap-1">
          <CheckBoxList
            title={field.label}
            options={options}
            value={arrayValue}
            onChange={handleChange}
            disabled={field.disabled}
            className={field.className}
            dataTestId={
              formDataTestId ? `${formDataTestId}-${field.name}` : undefined
            }
            labelPosition={field.checkboxListProps?.labelPosition}
            titleClassName={field.checkboxListProps?.titleClassName}
            optionsClassName={field.checkboxListProps?.listClassName}
            showSelectAll={field.checkboxListProps?.showSelectAll}
            columns={field.checkboxListProps?.columns}
          />
          {helperText && (
            <span className={helperClasses(variant as InputVariant)}>
              {helperText}
            </span>
          )}
        </div>
      );
    }
    case "textarea":
      return (
        <Input
          {...baseProps}
          as="textarea"
          rows={field.rows ?? 4}
          value={value ?? field.value}
          onChange={(e) =>
            handleChange((e.target as HTMLTextAreaElement).value)
          }
          onFocus={(e) =>
            handleFocus((e.target as HTMLTextAreaElement).value)
          }
          onBlur={onBlur}
          variant={field.disabled ? "disabled" : variant}
          dataTestId={formDataTestId ? `${formDataTestId}-${field.name}` : undefined}
        />
      );

    default: {
      const inputType =
        field.type === "input"
          ? "text"
          : field.type === "email"
          ? "email"
          : field.type;
      const inputValue = value ?? field.value ?? "";

      return (
        <Input
          {...baseProps}
          className={`${baseProps.className ?? ""} ${fieldRendererStyles.noSpinner}`}
          value={inputValue}
          onChange={(e) => handleChange((e.target as HTMLInputElement).value)}
          onFocus={(e) => handleFocus((e.target as HTMLInputElement).value)}
          onBlur={onBlur}
          type={inputType}
          variant={field.disabled ? "disabled" : variant}
          inputMode={field.type === "number" ? "decimal" : undefined} // opcional
          dataTestId={formDataTestId ? `${formDataTestId}-${field.name}` : undefined}
        />
      );
    }
  }
};
