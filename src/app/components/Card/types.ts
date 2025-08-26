/** Props for Card component */
export interface CardProps {
  /** Layout orientation */
  orientation?: 'vertical' | 'horizontal'
  /** Image source URL */
  imageSrc: string
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
  /** Show cancel button */
  showCancelButton?: boolean
}
