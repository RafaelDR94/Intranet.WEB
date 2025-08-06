// DynamicForm/components/FieldRenderer.tsx
import React from 'react';
import { FieldModel } from '../types';
import { Input } from '../../Input/Input';
import { Select } from '../../Select/Select';
import { ToggleButton } from '../../ToogleButton.tsx/ToogleButton';
import { Checkbox } from '../../CheckBox/CheckBox';
import { FileUploader } from '../../FileUploader/FileUploader';
import { helperClasses } from '../../Input/styles.tsx';
import type { InputVariant } from '../../Input/types.tsx';

interface FieldRendererProps {
  field: FieldModel;
  value: any;
  onChange: (value: any) => void;
  onBlur?: (e: React.FocusEvent<any>) => void;
  variant: 'default' | 'success' | 'warning' | 'error' | 'info';
  helperText?: string;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
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
  };

  switch (field.type) {
    case 'select':
      return (
        <Select
          {...baseProps}
          selected={[value]}
          onChange={(vals) => onChange(vals[0])}
          options={field.options || []}
        />
      );

    case 'multiSelect':
      return (
        <Select
          {...baseProps}
          multiple
          selected={value}
          onChange={(vals) => onChange(vals)}
          options={field.options || []}
        />
      );

    case 'checkbox':
      return (
        <Checkbox
          checked={value}
          onChange={onChange}
          label={field.label}
          disabled={field.validations?.some((v) => v.type === 'required') && false}
        />
      );

    case 'toggle':
      return (
        <ToggleButton
          checked={value}
          onChange={onChange}
          label={field.label}
        />
      );

    case 'file':
      return (
        <div className="flex flex-col gap-1">
          <FileUploader
            accept={field.accept || ''}
            buttonLabel={field.label}
            onFile={onChange}
            disabled={field.disabled}
            className={field.className}
            icon={field.icon}
            initialFile={field.initialFile}
          />
          {helperText && (
            <span className={helperClasses(variant as InputVariant)}>{helperText}</span>
          )}
        </div>
      );

    default:
      return (
        <Input
          {...baseProps}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          type={field.type === 'email' ? 'email' : field.type}
        />
      );
  }
};
