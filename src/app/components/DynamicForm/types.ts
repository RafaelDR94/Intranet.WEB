// components/DynamicForm/types.ts

export type InputType =
  | 'input'
  | 'email'
  | 'password'
  | 'number'
  | 'select'
  | 'multiSelect'
  | 'checkbox'
  | 'toggle';

export type Variant = 'default' | 'success' | 'warning' | 'error' | 'info';

export type ValidationRule =
  | { type: 'required' }
  | { type: 'email' }
  | { type: 'min' | 'max' | 'minLength' | 'maxLength'; value: number }
  | { type: 'noSpecialCharacters' }
  | { type: 'noSpecialCharactersOrNumbers' }
  | { type: 'alphaNumericSpaces' }
  | { type: 'noInitialSpaces' }
  | { type: 'noNumbers' };

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

export interface FieldModel {
  type: InputType;
  name: string;
  label: string;
  placeholder?: string;
  value: string | string[] | number | boolean;
  helperText?: string;
  inputSize?: 'md' | 'lg';
  variant?: Variant;
  options?: { label: string; value: string }[];
  validations?: ValidationRule[];
  warningRules?: WarningRule[];
  showIf?: (values: Record<string, any>) => boolean;
}

export interface DynamicFormProps {
  fields: FieldModel[];
  onSubmit: (values: { [key: string]: any }) => void;
  title?: string;
  submitLabel?: string;
  showSubmitIf?: (values: Record<string, any>) => boolean;
  showSecondaryButtonIf?: (values: Record<string, any>) => boolean;
  onSecondaryButtonClick?: (values: Record<string, any>) => void;
  secondaryButtonLabel?: string;
}
