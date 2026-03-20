import type { InternalDeviceType } from '@/app/mappings/internaldevices/internaldevices.types'

/**
 * Row shape for the device types table.
 */
export type DeviceTypeRow = {
  id: string
  display_id: string
  device_type_id: string
  name: string
  description: string
  extract: string
  is_active: boolean
}

/**
 * Supported values for the status filter dropdown.
 */
export type StatusFilterValue = 'all' | 'active' | 'inactive'

/**
 * Option model for the status filter UI.
 */
export type StatusFilterOption = {
  label: string
  value: StatusFilterValue
}

/**
 * Row builder helper for device type data.
 */
export type DeviceTypeRowBuilder = (
  deviceType: InternalDeviceType,
  index: number,
) => DeviceTypeRow
