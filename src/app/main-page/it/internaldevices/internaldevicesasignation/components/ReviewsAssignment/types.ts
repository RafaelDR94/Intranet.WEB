/**
 * Props for ReviewsAssignment component.
 */
export type ReviewsAssignmentProps = {
  deviceId?: string | null
  deviceName?: string | null
  deviceStatus?: string | null
  onCreateReview?: () => void
}

/**
 * Row model for ReviewsAssignment table rendering.
 */
export type ReviewRow = {
  id: string
  dateLabel: string
  description: string
  responsible: string
}
