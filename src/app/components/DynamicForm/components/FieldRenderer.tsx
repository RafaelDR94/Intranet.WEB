import React from 'react';
import { FieldModel } from '../types';
import { Input } from '../../Input/Input';
import { Select } from '../../Select/Select';
import { ToggleButton } from '../../ToogleButton.tsx/ToogleButton';
import { Checkbox } from '../../CheckBox/CheckBox';
import { FileUploader } from '../../FileUploader/FileUploader';
import { helperClasses } from '../../Input/styles';
import type { InputVariant } from '../../Input/types.tsx';

interface FieldRendererProps {
  field: FieldModel;
  value: any;
  allValues: Record<string, any>;
  onChange: (value: any) => void;
  onBlur?: (e: React.FocusEvent<any>) => void;
  variant: 'default' | 'success' | 'warning' | 'error' | 'info';
  helperText?: string;
}

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
      <div className="flex gap-1">
        {field.label && (
          <label className="text-b1 font-regular text-gray-70">
            {field.label} :
          </label>
        )}
        <span className="text-b2 font-medium text-gray-70">{rendervalue}</span>
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
        <div className="flex flex-col gap-1">
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

    default:
      return (
        <Input
          {...baseProps}
          value={value ?? field.value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={onBlur}
          type={field.type === 'email' ? 'email' : field.type}
          variant={field.disabled ? 'disabled' : 'default'}
        />
      );
  }
};
