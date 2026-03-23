import type {
  InternalDevice,
  InternalDeviceAssignment,
} from '@/app/mappings/internaldevices/internaldevices.types'

/**
 * Props for AssignmentDetail component.
 */
export type AssignmentDetailProps = {
  open: boolean
  onClose: () => void
  loading: boolean
  assignment: InternalDeviceAssignment | null
  assignmentDevice: InternalDevice | null
  assignmentEmployeeName: string
  onEditInformation?: () => void
  onCreateReview?: () => void
}
