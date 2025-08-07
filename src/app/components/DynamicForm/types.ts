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
  /** Tipo de input que se renderizará. */
  type: InputType;
  /** Identificador único del campo. */
  name: string;
  /** Etiqueta que se muestra junto al campo. */
  label: string;
  /** Placeholder opcional para campos de texto. */
  placeholder?: string;
  /** Valor inicial del campo. */
  value: string | string[] | number | boolean | File | InitialFile | null;
  /** Texto de ayuda que se muestra debajo del campo. */
  helperText?: string;
  /** Tamaño del input. */
  inputSize?: 'md' | 'lg';
  /** Variante visual del campo. */
  variant?: Variant;
  /** Opciones para campos de selección. */
  options?: { label: string; value: string }[];
  /** Reglas de validación del campo. */
  validations?: ValidationRule[];
  /** Reglas de advertencia no bloqueantes. */
  warningRules?: WarningRule[];
  /** Condición para mostrar el campo dependiendo de otros valores. */
  showIf?: (values: Record<string, any>, fields: FieldModel[]) => boolean;

  /** Tipos de archivo aceptados (para campos de tipo file). */
  accept?: string;
  /** Deshabilita el uploader de archivos. */
  disabled?: boolean;
  /** Clases CSS adicionales para personalizar el campo. */
  className?: string;
  /** Ícono personalizado para el uploader. */
  icon?: FC<SVGProps<SVGSVGElement>>;
  /** Archivo inicial a mostrar en el uploader. */
  initialFile?: InitialFile;
  /** Indica si debe renderizar solo el texto para campos `file`. */
  onlyText?: boolean;
  /** Callback que se ejecuta cuando cambia el valor del campo. */
  onChange?: (value: any, values: Record<string, any>) => void;
}

/** Props del componente `DynamicForm`. */
export interface DynamicFormProps {
  /** Campos que definen la estructura del formulario. */
  fields: FieldModel[];
  /** Acción ejecutada al enviar el formulario con los valores limpios. */
  onSubmit: (values: Record<string, any>) => void;
  /** Título opcional que se muestra encima del formulario. */
  title?: string;
  /** Texto del botón de envío. */
  submitLabel?: string;
  /** Función que determina si se muestra el botón de envío. */
  showSubmitIf?: (values: Record<string, any>) => boolean;
  /** Función que determina si se muestra el botón secundario. */
  showSecondaryButtonIf?: (values: Record<string, any>) => boolean;
  /** Acción al hacer clic en el botón secundario. */
  onSecondaryButtonClick?: (values: Record<string, any>) => void;
  /** Callback ejecutado cuando cambia la validez del formulario. */
  onValidChange?: (isvalid: boolean) => void;
  /** Texto del botón secundario. */
  secondaryButtonLabel?: string;
  /** Contenido adicional que se renderiza dentro del formulario. */
  children?: React.ReactNode;
  /** Si es `true`, muestra un indicador de carga en el botón principal. */
  loading?: boolean;
  /** Matriz de proporciones para distribuir los campos por fila. */
  layoutMatrix?: number[][];
  /**
   * Referencia opcional para disparar el submit desde fuera del componente.
   * Al invocarse ejecutará la misma lógica que el botón interno.
   */
  externalSubmitRef?: React.RefObject<(() => void | Promise<any>) | null>;
  /** Muestra un spinner de carga en lugar del formulario. */
  loadingFormInfo?: boolean;
}

