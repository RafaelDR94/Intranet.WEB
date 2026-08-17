import type { InternalDevice } from '@/app/mappings/internaldevices/internaldevices.types'

/**
 * Row shape for the internal devices list table.
 */
export type InternalDeviceRow = InternalDevice & {
  id: string
  display_id: string
  /** Texto interno con todos los valores permitidos para la búsqueda. */
  search_content: string
  status_label?: string
  assignment_label?: string
  review_label?: string
}

/**
 * Supported values for the status filter dropdown.
 */
export type StatusFilterValue =
  | 'all'
  | 'excelente'
  | 'bueno'
  | 'regular'
  | 'malo'

export type AssignmentFilterValue = 'all' | 'assigned' | 'unassigned'

export type ReviewFilterValue = 'all' | 'reviewed' | 'unreviewed'

/**
 * Option model for the status filter UI.
 */
export type StatusFilterOption = {
  label: string
  value: StatusFilterValue
}

export type DeviceFilterOption = {
  label: string
  value: string
}
