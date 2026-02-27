/** Label visual variants */
export type LabelType =
  | "valido"
  | "invalido"
  | "prohibido"
  | "actualizado"
  | "pendiente"
  | "rechazado"
  | "restringido"
  | "purple"
  | "validado-op"
  | "en-proceso"
  | "vale-azul"
  | "vale-rosa"
  | "sin-factura"
  | "factura-rechazada";

/** Props for Label component */
export interface LabelProps {
  /** Variant style */
  type: LabelType;
  /** Text to display */
  text: any;
  /** Custom classes */
  className?: string;
}
