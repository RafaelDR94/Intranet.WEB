import type { InternalDevice } from '@/app/mappings/internaldevices/internaldevices.types'

/**
 * Row shape for the internal devices asignation table.
 */
export type InternalDeviceAssignmentRow = {
  id: string
  display_id: string
  assignment_id: string
  device_id?: string | null
  device_status?: InternalDevice['device_status'] | null
  device_type?: InternalDevice['device_type'] | null
  device_brand?: InternalDevice['device_brand'] | null
  model?: string
  serial_number?: string
  name?: string
  assigned_to?: string | null
  responsive_url?: string | null
  is_active?: boolean
}

/**
 * Supported values for the status filter dropdown.
 */
export type StatusFilterValue =
  | 'all'
  | 'en_revision'
  | 'excelente'
  | 'bueno'
  | 'regular'
  | 'malo'

/**
 * Option model for the status filter UI.
 */
export type StatusFilterOption = {
  label: string
  value: StatusFilterValue
}
