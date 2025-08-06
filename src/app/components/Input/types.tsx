/** Tamaños permitidos para el input. */
export type InputSize = 'md' | 'lg'
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
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Etiqueta descriptiva del campo */
  label?: string
  /** Texto de ayuda opcional bajo el input */
  helperText?: string
  /** Tamaño del input (md o lg) */
  inputSize?: InputSize
  /** Variante de estilo */
  variant?: InputVariant
  /**Icono para mostar dentro del input */
  icon?:any
  /** Acción tras presionar el icono */
  onIconClick ?:()=>void
}
