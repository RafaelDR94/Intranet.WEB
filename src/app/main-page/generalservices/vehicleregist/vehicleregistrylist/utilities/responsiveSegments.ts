import type {
  TransportAssignament,
  VehicleReassignmentView,
  VehicleTraking,
} from '@/app/mappings/transport/transport.types'

export type ResponsivePeriod = {
  startIso: string
  endIso: string | null
}

export type ResponsiveSegment = {
  reassignmentId: string | null
  employeeId: string
  employeeName: string | null
  signatureUrl: string | null
  period: ResponsivePeriod
  isFirst: boolean
}

const normalizeText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

const parseDate = (iso?: string | null): number => {
  if (!iso) return Number.NaN
  return Date.parse(iso)
}

const byDateCreatedAsc = (
  a: VehicleReassignmentView,
  b: VehicleReassignmentView
): number => {
  const at = parseDate(a.date_created)
  const bt = parseDate(b.date_created)
  if (Number.isNaN(at) && Number.isNaN(bt)) return 0
  if (Number.isNaN(at)) return 1
  if (Number.isNaN(bt)) return -1
  return at - bt
}

const isAccepted = (item: VehicleReassignmentView): boolean =>
  normalizeText(item.status ?? '') === 'aceptado'|| normalizeText(item.status ?? '') ==='aprobado'

const findTracking = (
  list: VehicleTraking[] | undefined,
  entryExit: boolean
): VehicleTraking | undefined => {
  if (!Array.isArray(list) || list.length === 0) return undefined
  return list.find((t) => t.vehicleEntryExit === entryExit) ?? undefined
}

const getDepartureIso = (assignment: TransportAssignament): string => {
  const fromField = assignment.departure_date?.trim()
  if (fromField) return fromField

  const tracking =
    findTracking(assignment.vehicletrackinglist, false) ??
    assignment.vehicletrackinglist?.[0]
  return tracking?.date?.trim() || ''
}

const getArrivalIso = (assignment: TransportAssignament): string | null => {
  const fromField = assignment.arrival_date?.trim()
  if (fromField) return fromField

  const tracking =
    findTracking(assignment.vehicletrackinglist, true) ??
    assignment.vehicletrackinglist?.[1]
  return tracking?.date?.trim() || null
}

export const buildResponsiveSegments = (
  assignment: TransportAssignament
): ResponsiveSegment[] => {
  const accepted = Array.isArray(assignment.vehicle_reassignment)
    ? assignment.vehicle_reassignment.filter(isAccepted).slice().sort(byDateCreatedAsc)
    : []

  const departureIso = getDepartureIso(assignment)
  const arrivalIso = getArrivalIso(assignment)

  if (accepted.length === 0) {
    return [
      {
        reassignmentId: null,
        employeeId: assignment.employee_id,
        employeeName: assignment.name ?? null,
        signatureUrl: null,
        period: { startIso: departureIso, endIso: arrivalIso },
        isFirst: true,
      },
    ]
  }

  return accepted.map((item, index) => {
    const startIso = item.date_created
    const endIso =
      index + 1 < accepted.length ? accepted[index + 1].date_created : arrivalIso

    return {
      reassignmentId: item.id,
      employeeId: item.id_new_employee,
      employeeName: item.new_employee_name ?? null,
      signatureUrl: item.signature ?? null,
      period: { startIso, endIso },
      isFirst: index === 0,
    }
  })
}
