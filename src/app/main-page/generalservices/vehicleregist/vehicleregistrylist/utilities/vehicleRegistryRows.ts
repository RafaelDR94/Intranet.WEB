'use client'

import type { TransportAssignament } from '@/app/mappings/transport/transport.types'

import type { VehicleRegistryRow } from '../types'

const normalizeText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

const DATE_FORMATTER = new Intl.DateTimeFormat('es-MX', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const TIME_FORMATTER = new Intl.DateTimeFormat('es-MX', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

export const isInTransitStatus = (status?: string): boolean => {
  if (!status) return false
  const normalized = normalizeText(status)
  return normalized === 'en transito' || normalized === 'in transit'
}

const parseDate = (iso: string | undefined | null): Date | null => {
  if (!iso) return null
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? null : date
}

const formatDateLabel = (iso: string | undefined | null): string => {
  const date = parseDate(iso)
  return date ? DATE_FORMATTER.format(date) : '--'
}

const formatTimeLabel = (iso: string | undefined | null): string => {
  const date = parseDate(iso)
  return date ? TIME_FORMATTER.format(date) : '--'
}

const buildVehicleName = (assignment: TransportAssignament): string => {
  const parts = [
    assignment.transport?.brand,
    assignment.transport?.model,
    assignment.transport?.UnitType,
  ]

  return parts.filter((part) => !!part && part.trim().length > 0).join(' ')
}

export const hasPendingVehicleReassignment = (
  assignment?: TransportAssignament
): boolean => {
  const list = assignment?.vehicle_reassignment
  if (!Array.isArray(list) || list.length === 0) return false
  return list.some((item) => normalizeText(item.status ?? '') === 'pendiente')
}

const getLatestVehicleReassignment = (
  assignment: TransportAssignament
) => {
  const list = assignment.vehicle_reassignment
  if (!Array.isArray(list) || list.length === 0) return null

  return list.reduce<(typeof list)[number] | null>((latest, current) => {
    if (!latest) return current
    const latestTs = Date.parse(latest.date_created ?? '')
    const currentTs = Date.parse(current.date_created ?? '')
    if (Number.isNaN(latestTs) && Number.isNaN(currentTs)) return current
    if (Number.isNaN(latestTs)) return current
    if (Number.isNaN(currentTs)) return latest
    return currentTs > latestTs ? current : latest
  }, null)
}

export const resolveAssignmentDriverName = (
  assignment: TransportAssignament
): string => {
  const list = assignment.vehicle_reassignment
  if (!Array.isArray(list) || list.length === 0) {
    return assignment.name ?? ''
  }

  const latest = getLatestVehicleReassignment(assignment)
  const status = normalizeText(latest?.status ?? '')

  const byStatus =
    status === 'aceptado'
      ? latest?.new_employee_name
      : status === 'pendiente' || status === 'rechazado'
        ? latest?.previous_employee_name
        : null

  return byStatus?.trim() || assignment.name?.trim() || ''
}

export const toVehicleRegistryRow = (
  assignment: TransportAssignament
): VehicleRegistryRow => {
  const departureDate = parseDate(assignment.departure_date)
  const rowId =
    assignment.vehicleassignments_id ||
    assignment.transport?.transport_id ||
    `${assignment.employee_id}-${assignment.departure_date || ''}` ||
    `${assignment.employee_id}-${Date.now()}`

  return {
    id: rowId,
    departureDate: formatDateLabel(assignment.departure_date),
    departureTime: formatTimeLabel(assignment.departure_date),
    arrivalDate: formatDateLabel(assignment.arrival_date),
    arrivalTime: formatTimeLabel(assignment.arrival_date),
    vehicle: buildVehicleName(assignment),
    plates: assignment.transport?.plates ?? '',
    driver: resolveAssignmentDriverName(assignment),
    status: assignment.status?.status ?? '',
    destination: assignment.destination ?? '',
    departureSort: departureDate ? departureDate.getTime() : 0,
    statusVariant: isInTransitStatus(assignment.status?.status)
      ? 'inTransit'
      : 'other',
    assignment,
  }
}

export const sortByDepartureDesc = (
  a: VehicleRegistryRow,
  b: VehicleRegistryRow
): number => {
  return b.departureSort - a.departureSort
}

