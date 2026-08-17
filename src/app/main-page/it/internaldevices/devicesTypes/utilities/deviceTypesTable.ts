import type { LabelType } from '@/app/components/Label/types'

import type { DeviceTypeRow, StatusFilterOption, StatusFilterValue } from '../types'

const STATUS_FILTER_VALUES = ['all', 'active', 'inactive'] as const

/**
 * Default filter value for the table status selector.
 */
export const DEFAULT_STATUS_FILTER: StatusFilterValue = 'all'

/**
 * Status filter options shown in the table toolbar.
 */
export const STATUS_FILTER_OPTIONS: StatusFilterOption[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Activo', value: 'active' },
  { label: 'Inactivo', value: 'inactive' },
]

/**
 * Searchable keys for the device types table.
 */
export const DEVICE_TYPES_SEARCHABLE_KEYS: (keyof DeviceTypeRow)[] = [
  'display_id',
  'name',
  'description',
  'extract',
  'status_label',
  'search_content',
]

/**
 * Coerces a boolean status into a label type for the UI.
 */
export const statusToLabelType = (isActive: boolean): LabelType =>
  isActive ? 'valido' : 'restringido'

/**
 * Evaluates if a device type matches the selected filter.
 */
export const matchesStatusFilter = (
  isActive: boolean,
  filter: StatusFilterValue,
): boolean => {
  if (filter === 'all') return true
  if (filter === 'active') return isActive
  return !isActive
}

/**
 * Runtime guard for status filter values.
 */
export const isStatusFilterValue = (value: string): value is StatusFilterValue =>
  (STATUS_FILTER_VALUES as readonly string[]).includes(value)
