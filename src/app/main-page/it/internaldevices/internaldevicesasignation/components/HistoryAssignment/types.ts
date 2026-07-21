/**
 * Props for HistoryAssignment component.
 */
export type HistoryAssignmentProps = {
  deviceId?: string | null
  onCreateAssignment?: () => void
  showActions?: boolean
}

/**
 * Row model for HistoryAssignment table rendering.
 */
export type HistoryAssignmentRow = {
  assignmentId: string
  dateLabel: string
  assignedTo: string
  deliveryCondition: string
  responsiveUrl?: string | null
}
