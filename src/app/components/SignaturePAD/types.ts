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

  /**
   * When enabled the pad expands to cover most of the viewport and adapts
   * spacing to be used inside a modal-like overlay.
   */
  fullScreen?: boolean;
}
