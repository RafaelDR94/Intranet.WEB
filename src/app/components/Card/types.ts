import type { ActionMenuCellProps } from '../ActionMenuCell/types'
import type { Variant } from '../Button/types'

/** Props for Card component */
export type CardProps<TRow extends Record<string, unknown> = Record<string, unknown>> = {
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
  /** Secondary button visual variant (default: 'outline') */
  secondaryVariant?: Variant
  showSecundaryButton?: boolean
  /** Optional props to display contextual action menu */
  actionMenuProps?: ActionMenuCellProps<TRow>
  /** Enables opening the image in fullscreen preview on click (default: true) */
  enableImagePreview?: boolean
  /** Enables a one-time remote image recovery via fetch/blob when first paint fails */
  enableRemoteImageRecovery?: boolean
}


