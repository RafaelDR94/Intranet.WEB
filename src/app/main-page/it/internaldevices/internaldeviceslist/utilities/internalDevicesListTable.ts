import type { LabelType } from '@/app/components/Label/types'

import type {
  InternalDeviceRow,
  StatusFilterOption,
  StatusFilterValue,
} from '../types'

const STATUS_FILTER_VALUES = [
  'all',
  'en_revision',
  'excelente',
  'bueno',
  'regular',
  'malo',
] as const

/**
 * Default filter value for the table status selector.
 */
export const DEFAULT_STATUS_FILTER: StatusFilterValue = 'all'

/**
 * Status filter options shown in the table toolbar.
 */
export const STATUS_FILTER_OPTIONS: StatusFilterOption[] = [
  { label: 'Todos', value: 'all' },
  { label: 'En revision', value: 'en_revision' },
  { label: 'Excelente', value: 'excelente' },
  { label: 'Bueno', value: 'bueno' },
  { label: 'Regular', value: 'regular' },
  { label: 'Malo', value: 'malo' },
]

/**
 * Searchable keys for the internal devices list table.
 */
export const INTERNAL_DEVICE_SEARCHABLE_KEYS: (keyof InternalDeviceRow)[] = [
  'display_id',
  'name',
  'model',
  'serial_number',
  'ip_address',
  'mac_address',
]

/**
 * Coerces a status string into a label type for the UI.
 */
export const statusToLabelType = (status?: string): LabelType => {
  const normalized = (status ?? '').toUpperCase()
  if (normalized.includes('OPTIMO') || normalized.includes('EXCELENTE')) return 'valido'
  if (normalized.includes('BUENO')) return 'validado'
  if (normalized.includes('REGULAR')) return 'pendiente'
  if (normalized.includes('MALO') || normalized.includes('DEFECTUOSO')) return 'invalido'
  return 'pendiente'
}

const normalizeStatus = (status?: string) =>
  (status ?? '')
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

/**
 * Evaluates if a device status matches the selected filter.
 */
export const matchesStatusFilter = (
  status: string | undefined,
  filter: StatusFilterValue,
): boolean => {
  if (filter === 'all') return true
  const normalized = normalizeStatus(status)
  switch (filter) {
    case 'en_revision':
      return normalized.includes('REVISION')
    case 'excelente':
      return normalized.includes('EXCELENTE') || normalized.includes('OPTIMO')
    case 'bueno':
      return normalized.includes('BUENO')
    case 'regular':
      return normalized.includes('REGULAR')
    case 'malo':
      return normalized.includes('MALO') || normalized.includes('DEFECTUOSO')
    default:
      return true
  }
}

/**
 * Runtime guard for status filter values.
 */
export const isStatusFilterValue = (value: string): value is StatusFilterValue =>
  (STATUS_FILTER_VALUES as readonly string[]).includes(value)
