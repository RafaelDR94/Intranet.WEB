// components/DynamicForm/types.ts
import type { FC, SVGProps } from 'react';
import type { InitialFile } from '../FileUploader/types';

/** Tipos de campo soportados por el formulario. */
export type InputType =
  | 'input'
  | 'email'
  | 'password'
  | 'number'
  | 'select'
  | 'multiSelect'
  | 'checkbox'
  | 'toggle'
  | 'file';

/** Estados visuales para campos y helper texts. */
export type Variant = 'default' | 'success' | 'warning' | 'error' | 'info';

/** Reglas de validación admitidas. */
export type ValidationRule =
  | { type: 'required' }
  | { type: 'email' }
  | { type: 'min' | 'max' | 'minLength' | 'maxLength'; value: number }
  | { type: 'noSpecialCharacters' }
  | { type: 'noSpecialCharactersOrNumbers' }
  | { type: 'alphaNumericSpaces' }
  | { type: 'noInitialSpaces' }
  | { type: 'noNumbers' };

/** Reglas de advertencia no bloqueantes. */
export interface WarningRule {
  type:
  | 'minLengthWarning'
  | 'maxLengthWarning'
  | 'weakPassword'
  | 'deprecatedEmailDomain'
  | 'ageIsLowButValid'
  | 'ageIsHighButValid'
  | 'unverifiedLanguage';
  value?: number;
}

/** Modelo de definición de un campo del formulario. */
export interface FieldModel {
  type: InputType;
  name: string;
  label: string;
  placeholder?: string;
  value: string | string[] | number | boolean | File | InitialFile | null;
  helperText?: string;
  inputSize?: 'md' | 'lg';
  variant?: Variant;
  options?: { label: string; value: string }[];
  validations?: ValidationRule[];
  warningRules?: WarningRule[];
  showIf?: (values: Record<string, any>) => boolean;

  /** Tipos de archivo aceptados (para campos de tipo file). */
  accept?: string;
  /** Deshabilita el uploader de archivos. */
  disabled?: boolean;
  /** Clases CSS adicionales para el uploader. */
  className?: string;
  /** Ícono personalizado para el uploader. */
  icon?: FC<SVGProps<SVGSVGElement>>;
  /** Archivo inicial a mostrar en el uploader. */
  initialFile?: InitialFile;
}

/** Props del componente `DynamicForm`. */
export interface DynamicFormProps {
  fields: FieldModel[];
  onSubmit: (values: { [key: string]: any }) => void;
  title?: string;
  submitLabel?: string;
  showSubmitIf?: (values: Record<string, any>) => boolean;
  showSecondaryButtonIf?: (values: Record<string, any>) => boolean;
  onSecondaryButtonClick?: (values: Record<string, any>) => void;
  secondaryButtonLabel?: string;
  children?: React.ReactNode;
  loading?: boolean;
  layoutMatrix?: number[][];
}

