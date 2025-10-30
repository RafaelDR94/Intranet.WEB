export interface SignaturePadProps {
  /** Callback cuando se guarda la firma en Base64 */
  onSignatureSave: (signature: string) => void;
  /** Callback cuando se cancela */
  onCancel: () => void;
  /** Ancho opcional del canvas */
  width?: number | string;
  /** Alto opcional del canvas */
  height?: number | string;

  name?: string

  workposition?: string
}