/** Label visual variants */
export type LabelType = 'valido' | 'invalido' | 'prohibido'

/** Props for Label component */
export interface LabelProps {
  /** Variant style */
  type: LabelType
  /** Text to display */
  text: string
}
