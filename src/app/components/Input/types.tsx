export type InputSize = 'md' | 'lg'
export type InputVariant =
  | 'default'
  | 'filled'
  | 'disabled'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Etiqueta descriptiva del campo */
  label: string
  /** Texto de ayuda opcional bajo el input */
  helperText?: string
  /** Tamaño del input (md o lg) */
  inputSize?: InputSize
  /** Variante de estilo */
  variant?: InputVariant
}
