import React from 'react';
import { FieldRendererProps } from './types';
import { Input } from '../../Input/Input';
import { Select } from '../../Select/Select';
import { ToggleButton } from '../../ToogleButton.tsx/ToogleButton';
import { Checkbox } from '../../CheckBox/CheckBox';
import { FileUploader } from '../../FileUploader/FileUploader';
import { NumberControl } from '../../NumberControl/NumberControl';
import { helperClasses } from '../../Input/styles';
import type { InputVariant } from '../../Input/types.tsx';
import { fieldRendererStyles } from './styles';
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
}) => {
  const baseProps = {
    label: field.label,
    name: field.name,
    placeholder: field.placeholder,
    helperText,
    variant,
    inputSize: field.inputSize || 'md',
    className: field.className,
  };

  const handleChange = (newValue: any) => {
    onChange(newValue);
    field.onChange?.(newValue, allValues);
  };

  if (field.onlyText) {
    let rendervalue = value || field.value;
    if (field.type === 'select') {
      rendervalue = field.options?.find(opt => opt.value === field?.value)?.label;
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
    case 'select':
      return (
        <Select
          {...baseProps}
          selected={[value ?? field.value]}
          onChange={(vals) => handleChange(vals[0])}
          options={field.options || []}
          disabled={field.disabled}
        />
      );

    case 'multiSelect':
      return (
        <Select
          {...baseProps}
          multiple
          selected={value ?? field.value}
          onChange={(vals) => handleChange(vals)}
          options={field.options || []}
          disabled={field.disabled}
        />
      );

    case 'checkbox':
      return (
        <Checkbox
          checked={value ?? field.value}
          onChange={handleChange}
          label={field.label}
          disabled={field.disabled}
          className={field.className}

        />
      );

    case 'toggle':
      return (
        <ToggleButton
          checked={value ?? field.value}
          onChange={handleChange}
          label={field.label}
          className={field.className}
          disabled={
            field.disabled
          }
        />
      );

    case 'file':
      return (
        <div className={fieldRendererStyles.fileWrapper}>
          <FileUploader
            accept={field.accept || ''}
            label={field.label}
            placeholder={field.placeholder}
            onFile={handleChange}
            disabled={field.disabled}
            className={field.className}
            icon={field.icon}
            initialFile={field.initialFile}

          />
          {helperText && (
            <span className={helperClasses(variant as InputVariant)}>
              {helperText}
            </span>
          )}
        </div>
      );
    case 'numberControl':
      return (
        <NumberControl
          label={field.label}
          value={value === null ? undefined : (value as number)}
          onChange={handleChange}
          min={field.min}
          max={field.max}
          step={field.step}
          size={(field.inputSize as any) || 'md'}
          variant={field.disabled ? 'disabled' : (variant as any)}
          disabled={field.disabled}
          helperText={helperText}
          className={field.className}
        />
      );
    case 'textarea':
      return (
        <Input
          {...baseProps}
          as="textarea"
          rows={field.rows ?? 4}
          value={value ?? field.value}
          onChange={(e) => handleChange((e.target as HTMLTextAreaElement).value)}
          onBlur={onBlur}
          variant={field.disabled ? 'disabled' : variant}
        />
      );

    default:
      return (
        <Input
          {...baseProps}
          value={value ?? field.value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={onBlur}
          type={field.type === 'email' ? 'email' : field.type}
          variant={field.disabled ? 'disabled' : variant}
        />
      );
  }
};
