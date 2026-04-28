import type { LabelType } from '@/app/components/Label/types'

import type {
  InternalDeviceAssignmentRow,
  StatusFilterOption,
  StatusFilterValue,
} from '../types'

const STATUS_FILTER_VALUES = [
  'all',
  'active',
  'inactive',
] as const

/**
 * Default filter value for the table status selector.
 */
export const DEFAULT_STATUS_FILTER: StatusFilterValue = 'active'

/**
 * Status filter options shown in the table toolbar.
 */
export const STATUS_FILTER_OPTIONS: StatusFilterOption[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Activo', value: 'active' },
  { label: 'Inactivo', value: 'inactive' },
]

/**
 * Searchable keys for the internal devices asignation table.
 */
export const INTERNAL_DEVICE_ASSIGNATION_SEARCHABLE_KEYS: (keyof InternalDeviceAssignmentRow)[] = [
  'display_id',
  'name',
  'model',
  'serial_number',
  'assigned_to',
]

/**
 * Coerces a status string into a label type for the UI.
 */
export const statusToLabelType = (status?: string | null): LabelType => {
  const normalized = (status ?? '').toUpperCase()
  if (normalized.includes('OPTIMO') || normalized.includes('EXCELENTE')) return 'valido'
  if (normalized.includes('BUENO')) return 'validado'
  if (normalized.includes('REGULAR')) return 'pendiente'
  if (normalized.includes('MALO') || normalized.includes('DEFECTUOSO')) return 'invalido'
  return 'pendiente'
}

/**
 * Evaluates if an assignment status matches the selected filter.
 */
export const matchesStatusFilter = (
  assigned: boolean | null | undefined,
  filter: StatusFilterValue,
): boolean => {
  if (filter === 'all') return true
  switch (filter) {
    case 'active':
      return Boolean(assigned)
    case 'inactive':
      return !assigned
    default:
      return true
  }
}

/**
 * Runtime guard for status filter values.
 */
export const isStatusFilterValue = (value: string): value is StatusFilterValue =>
  (STATUS_FILTER_VALUES as readonly string[]).includes(value)
