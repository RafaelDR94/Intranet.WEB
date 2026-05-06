// components/DynamicForm/types.ts
import type { FC, SVGProps } from 'react';

import type { ControlLevelProps } from '../ControlLevel/types';
import type { CheckBoxListOption } from '../CheckBoxList/types';
import type { LabelPosition } from '../CheckBox/types';
import type { InitialFile } from '../FileUploader/types';
import type { SelectedImage } from '../ImageUploaderExpanded/types';

/** Tipos de campo soportados por el formulario. */
export type InputType =

  | 'input'
  | 'controlLevel'
  | 'checkboxList'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'password'
  | 'number'
  | 'numberControl'
  | 'select'
  | 'multiSelect'
  | 'checkbox'
  | 'toggle'
  | 'file'
  | 'imageUploaderExpanded'
  | 'textarea';

export type ControlLevelFieldProps = Partial<
  Omit<ControlLevelProps, 'level' | 'setLevel' | 'onChange'>
>;

export type CheckBoxListFieldProps = {
  /** Ajusta la posición de la etiqueta de cada checkbox */
  labelPosition?: LabelPosition;
  /** Clase adicional para el título */
  titleClassName?: string;
  /** Clase adicional para el contenedor de opciones */
  listClassName?: string;
  /** Muestra un checkbox para seleccionar todas las opciones */
  showSelectAll?: boolean;
  /** Define el número de columnas en las que se distribuyen las opciones */
  columns?: number;
};

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
  autoComplete?: string;
  value: string | string[] | number | boolean | File | InitialFile | SelectedImage[] | File[] | null;
  helperText?: string;
  inputSize?: 'sm' | 'md' | 'lg';
  variant?: Variant;
  options?: ({ label: string; value: string } | CheckBoxListOption)[];
  validations?: ValidationRule[];
  warningRules?: WarningRule[];
  showIf?: (values: Record<string, any>, fields: FieldModel[]) => boolean;

  /** Props para file uploader */
  accept?: string;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  helperClassName?: string;
  triggerClassName?: string;
  icon?: FC<SVGProps<SVGSVGElement>>;
  initialFile?: InitialFile;
  initialFiles?: SelectedImage[];
  onlyText?: boolean;

  /** Props opcionales para ImageUploaderExpanded */
  /** Texto del botón seleccionar imagen */
  buttonLabel?: string;
  /** Etiquetas personalizadas para la cámara */
  cameraLabels?: {
    capture?: string;
    switchCamera?: string;
    close?: string;
  };
  /** Aria-label del botón de cámara */
  cameraButtonAriaLabel?: string;
  /** Cámara por defecto ('user' | 'environment') */
  defaultFacingMode?: 'user' | 'environment';
  /** Modo vista previa con opción de cambiar */
  preview?: boolean;
  /** En preview superpone el botón de cambio sobre la imagen y oculta borde punteado */
  previewCoverMode?: boolean;
  /** Permite la selección de múltiples imágenes. */
  multiple?: boolean;

  onChange?: (value: any, values: Record<string, any>) => any | void;
  onFocus?: (value: any, values: Record<string, any>) => any | void;
  /**Numero de filas en multilinea*/
  rows?: number
  /** Propiedades para campos numéricos */
  min?: number;
  max?: number;
  step?: number;

  /** Configuración específica para campos tipo ControlLevel */
  controlLevelProps?: ControlLevelFieldProps;

  /** Configuración para campos tipo CheckBoxList */
  checkboxListProps?: CheckBoxListFieldProps;
}

/** Layouts por breakpoint (las proporciones por fila) */
export type ResponsiveLayoutMatrix = {
  sm?: number[][];
  md?: number[][];
  lg?: number[][];
};

/** Breakpoints en px (máximos inclusivos para sm y md; >md es lg) */
export type Breakpoints = {
  sm: number; // Máximo para sm (inclusive)
  md: number; // Máximo para md (inclusive); >md será lg
};

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

  /** Callback ejecutado cuando cambia la validez del formulario. */
  onValuesChange?: (values: Record<string, any>) => void;
  /** Texto del botón secundario. */
  secondaryButtonLabel?: string;
  /** Contenido adicional que se renderiza dentro del formulario. */
  children?: React.ReactNode;
  /** Si es `true`, muestra un indicador de carga en el botón principal. */
  loading?: boolean;
  /** Cambia únicamente cuando se desea reinicializar los valores del formulario. */
  valuesVersion?: number;
  /** Cuando es true (default) solo recalcula initialValues si cambia valuesVersion; si es false, lo hará cada vez que cambien los campos. */
  valuesVersionActive?: boolean;

  /**
   * Matriz de proporciones para distribuir los campos por fila.
   * Tiene prioridad sobre `responsiveLayoutMatrix`.
   */
  layoutMatrix?: number[][];

  /**
   * Layouts por breakpoint. Se usará el del breakpoint actual;
   * si no existe, fallback hacia otros disponibles.
   */
  responsiveLayoutMatrix?: ResponsiveLayoutMatrix;

  /** Breakpoints en px. Default: { sm: 640, md: 1024 } */
  breakpoints?: Breakpoints;

  /**
   * Referencia opcional para disparar el submit desde fuera del componente.
   * Al invocarse ejecutará la misma lógica que el botón interno.
   */
  externalSubmitRef?: React.RefObject<(() => void | Promise<any>) | null>;

  /** Muestra un spinner de carga en lugar del formulario. */
  loadingFormInfo?: boolean;
  /** Deshabilita todos los campos del formulario */
  disabled?: boolean
  /** Identificador base para data-testid del formulario */
  dataTestId?: string
  marginButton?: string
  formClassName?: string
  rowClassName?: string
}
