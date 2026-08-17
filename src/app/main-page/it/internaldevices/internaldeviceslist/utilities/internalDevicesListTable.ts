import type { LabelType } from '@/app/components/Label/types'
import { parseDateFlexible } from '@/app/components/DataTable/utilities/datesTable'
import type { InternalDevice } from '@/app/mappings/internaldevices/internaldevices.types'

import type {
  AssignmentFilterValue,
  DeviceFilterOption,
  InternalDeviceRow,
  ReviewFilterValue,
  StatusFilterOption,
  StatusFilterValue,
} from '../types'

const STATUS_FILTER_VALUES = [
  'all',
  'excelente',
  'bueno',
  'regular',
  'malo',
] as const

const ASSIGNMENT_FILTER_VALUES = ['all', 'assigned', 'unassigned'] as const
const REVIEW_FILTER_VALUES = ['all', 'reviewed', 'unreviewed'] as const

/**
 * Default filter value for the table status selector.
 */
export const DEFAULT_STATUS_FILTER: StatusFilterValue = 'all'

/**
 * Status filter options shown in the table toolbar.
 */
export const STATUS_FILTER_OPTIONS: StatusFilterOption[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Excelente', value: 'excelente' },
  { label: 'Bueno', value: 'bueno' },
  { label: 'Regular', value: 'regular' },
  { label: 'Malo', value: 'malo' },
]

/**
 * Searchable keys for the internal devices list table.
 */
export const INTERNAL_DEVICE_SEARCHABLE_KEYS: (keyof InternalDeviceRow)[] = [
  'search_content',
  'display_id',
  'device_status',
  'device_type',
  'device_brand',
  'model',
  'serial_number',
  'name',
  'status_label',
  'assignment_label',
  'review_label',
  'created_at',
]

const isDatabaseIdKey = (key: string): boolean =>
  key
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .split(/[_\-\s]+/)
    .includes('id')

/**
 * Flattens the device data into a private, searchable string. Database IDs are
 * intentionally omitted at every nesting level, while arrays and related
 * objects contribute their descriptive values.
 */
export const buildInternalDeviceSearchContent = (
  device: InternalDevice,
): string => {
  const values: string[] = []
  const visited = new WeakSet<object>()

  const collect = (value: unknown): void => {
    if (value == null) return

    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      values.push(String(value))
      return
    }

    if (typeof value !== 'object' || visited.has(value)) return
    visited.add(value)

    if (Array.isArray(value)) {
      value.forEach(collect)
      return
    }

    Object.entries(value).forEach(([key, nestedValue]) => {
      if (!isDatabaseIdKey(key)) collect(nestedValue)
    })
  }

  collect(device)
  values.push(device.assigned ? 'ASIGNADO' : 'SIN ASIGNAR')
  values.push(device.reviewed ? 'REVISADO' : 'SIN REVISION')
  values.push(device.device_status?.name ?? '')
  values.push(device.created_at ?? '')
  return values.join(' ')
}

export const ASSIGNMENT_FILTER_OPTIONS: DeviceFilterOption[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Asignados', value: 'assigned' },
  { label: 'Sin asignar', value: 'unassigned' },
]

export const REVIEW_FILTER_OPTIONS: DeviceFilterOption[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Revisados', value: 'reviewed' },
  { label: 'Sin revisión', value: 'unreviewed' },
]

/**
 * Returns the registration date as a timestamp, placing records without a
 * valid date after dated records.
 */
export const getInternalDeviceCreationTimestamp = (
  device: InternalDevice,
): number => parseDateFlexible(device.created_at)?.getTime() ?? Number.NEGATIVE_INFINITY

/**
 * Sorts devices by their registration date, newest first, without mutating
 * the collection held in the store.
 */
export const sortInternalDevicesByCreationDate = (
  devices: InternalDevice[],
): InternalDevice[] =>
  [...devices].sort(
    (first, second) =>
      getInternalDeviceCreationTimestamp(second) -
      getInternalDeviceCreationTimestamp(first),
  )

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

export const isAssignmentFilterValue = (
  value: string,
): value is AssignmentFilterValue =>
  (ASSIGNMENT_FILTER_VALUES as readonly string[]).includes(value)

export const isReviewFilterValue = (value: string): value is ReviewFilterValue =>
  (REVIEW_FILTER_VALUES as readonly string[]).includes(value)

export const matchesAssignmentFilter = (
  assigned: boolean,
  filter: AssignmentFilterValue,
): boolean =>
  filter === 'all' || (filter === 'assigned' ? assigned : !assigned)

export const matchesReviewFilter = (
  reviewed: boolean,
  filter: ReviewFilterValue,
): boolean =>
  filter === 'all' || (filter === 'reviewed' ? reviewed : !reviewed)
