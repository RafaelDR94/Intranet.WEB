import { describe, expect, it } from 'vitest'

import type {
  TransportAssignament,
  VehicleTraking,
} from '@/app/mappings/transport/transport.types'

import { buildResponsiveSegments } from './responsiveSegments'

const baseAssignment = (): TransportAssignament => ({
  vehicleassignments_id: 'A1',
  employee_id: 'E1',
  name: 'Driver 1',
  transport: {
    transport_id: 'T1',
    brand: 'Nissan',
    model: 'Versa',
    UnitType: 'Sedan',
    plates: 'ABC-123',
  } as unknown as TransportAssignament['transport'],
  status: { status_id: 'S1', status: 'En transito' } as unknown as TransportAssignament['status'],
  departure_date: '2026-03-18T10:00:00.000',
  arrival_date: '2026-03-18T20:00:00.000',
  destination: 'Oficina',
  signature_leader: null,
  signature_employee: null,
  vehicletrackinglist: [
    { vehicleEntryExit: false, date: '2026-03-18T10:00:00.000' } as unknown as VehicleTraking,
    { vehicleEntryExit: true, date: '2026-03-18T20:00:00.000' } as unknown as VehicleTraking,
  ] satisfies VehicleTraking[],
})

describe('buildResponsiveSegments', () => {
  it('falls back to one segment when no accepted vehicle_reassignment', () => {
    const assignment = baseAssignment()
    assignment.vehicle_reassignment = []

    const segments = buildResponsiveSegments(assignment)
    expect(segments).toHaveLength(1)
    expect(segments[0]?.reassignmentId).toBe(null)
    expect(segments[0]?.employeeId).toBe('E1')
    expect(segments[0]?.signatureUrl).toBe(null)
    expect(segments[0]?.period.startIso).toBe('2026-03-18T10:00:00.000')
    expect(segments[0]?.period.endIso).toBe('2026-03-18T20:00:00.000')
  })

  it('builds segments split by accepted date_created only', () => {
    const assignment = baseAssignment()
    assignment.vehicle_reassignment = [
      {
        id: 'R1',
        id_vehicle_assignment: 'A1',
        id_previous_employee: null,
        previous_employee_name: null,
        id_new_employee: 'E1',
        new_employee_name: 'Driver 1',
        id_status: 'S-A',
        status: 'Aceptado',
        comment: null,
        date_created: '2026-03-18T10:00:00.000',
      },
      {
        id: 'R2',
        id_vehicle_assignment: 'A1',
        id_previous_employee: 'E1',
        previous_employee_name: 'Driver 1',
        id_new_employee: 'E2',
        new_employee_name: 'Driver 2',
        id_status: 'S-P',
        status: 'Pendiente',
        comment: null,
        date_created: '2026-03-18T11:00:00.000',
      },
      {
        id: 'R3',
        id_vehicle_assignment: 'A1',
        id_previous_employee: 'E1',
        previous_employee_name: 'Driver 1',
        id_new_employee: 'E2',
        new_employee_name: 'Driver 2',
        id_status: 'S-A',
        status: 'Aceptado',
        comment: null,
        date_created: '2026-03-18T12:00:00.000',
      },
    ]

    const segments = buildResponsiveSegments(assignment)
    expect(segments).toHaveLength(2)
    expect(segments[0]?.reassignmentId).toBe('R1')
    expect(segments[0]?.employeeId).toBe('E1')
    expect(segments[0]?.signatureUrl).toBe(null)
    expect(segments[0]?.period.startIso).toBe('2026-03-18T10:00:00.000')
    expect(segments[0]?.period.endIso).toBe('2026-03-18T12:00:00.000')
    expect(segments[1]?.reassignmentId).toBe('R3')
    expect(segments[1]?.employeeId).toBe('E2')
    expect(segments[1]?.signatureUrl).toBe(null)
    expect(segments[1]?.period.startIso).toBe('2026-03-18T12:00:00.000')
    expect(segments[1]?.period.endIso).toBe('2026-03-18T20:00:00.000')
  })
})
