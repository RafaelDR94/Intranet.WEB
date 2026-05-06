/** Tamaños permitidos para el input. */
export type InputSize = 'md' | 'lg' | 'sm';
/** Variantes visuales del input. */
export type InputVariant =
  | 'default'
  | 'filled'
  | 'disabled'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'


/** Props del componente `Input`. */
export interface InputCommonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Etiqueta descriptiva del campo */
  label?: string
  /** Texto de ayuda opcional bajo el input */
  helperText?: string
  /** Tamaño del input (md | lg | sm) */
  inputSize?: InputSize
  /** Variante de estilo */
  variant?: InputVariant
  /**Icono para mostar dentro del input */
  icon?:any
  /** Acción tras presionar el icono */
  onIconClick ?:()=>void
  /** Identificador de pruebas */
  dataTestId?: string
  /** Clase opcional para el contenedor externo */
  containerClassName?: string
  /** Clase opcional para la etiqueta */
  labelClassName?: string
  /** Clase opcional para el texto auxiliar */
  helperClassName?: string
}
/** Modo <input> (por defecto) */
export type InputAsInputProps = InputCommonProps &
  React.InputHTMLAttributes<HTMLInputElement> & {
    as?: 'input'            // default
    rows?: never            // ⬅️ NO permite rows en <input>
  }

/** Modo <textarea> (multilínea) */
export type InputAsTextareaProps = InputCommonProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    as: 'textarea'
    rows?: number           // ⬅️ rows permitido aquí
    type?: never            // ⬅️ NO tiene sentido "type" en <textarea>
  }

/** Props del componente `Input`. */
export type InputProps = InputAsInputProps | InputAsTextareaProps
