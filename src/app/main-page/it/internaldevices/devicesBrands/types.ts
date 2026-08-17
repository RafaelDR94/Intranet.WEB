import type { InternalDeviceBrand } from '@/app/mappings/internaldevices/internaldevices.types'

/**
 * Row shape for the device brands table.
 */
export type DeviceBrandRow = {
  id: string
  display_id: string
  device_brand_id: string
  name: string
  description: string
  extract: string
  is_active: boolean
  status_label: string
  search_content: string
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
 * Row builder helper for device brand data.
 */
export type DeviceBrandRowBuilder = (
  brand: InternalDeviceBrand,
  index: number,
) => DeviceBrandRow
