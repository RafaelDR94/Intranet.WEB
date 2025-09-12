/** Props for Card component */
export interface CardProps {
  /** Layout orientation */
  orientation?: 'vertical' | 'horizontal'
  /** Image source URL */
  imageSrc: string
  /** Optional fallback image URL if main image is empty or fails */
  fallbackSrc?: string
  /** Small label text */
  label: string
  /** Main title */
  title: string
  /** Description text */
  description: string
  /** Accept button handler */
  onAccept: () => void
  /** Cancel button handler */
  onCancel?: () => void
  /** Show primary action button (default: true) */
  showPrimaryButton?: boolean
  /** Show secondary (cancel) button */
  showSecondaryButton?: boolean
  /** Primary button label (default: 'Aceptar') */
  primaryLabel?: string
  /** Secondary button label (default: 'Cancelar') */
  secondaryLabel?: string
}
