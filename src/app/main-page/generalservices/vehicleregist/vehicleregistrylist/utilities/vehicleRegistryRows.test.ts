import { describe, expect, it } from 'vitest'

import {
  hasPendingVehicleReassignment,
  resolveAssignmentDriverName,
} from './vehicleRegistryRows'

describe('vehicleRegistryRows utils', () => {
  it('falls back to assignment.name when no vehicle_reassignment', () => {
    const assignment: any = { name: 'Original' }
    expect(resolveAssignmentDriverName(assignment)).toBe('Original')
    expect(hasPendingVehicleReassignment(assignment)).toBe(false)
  })

  it('uses latest date_created record to resolve driver name', () => {
    const assignment: any = {
      name: 'Original',
      vehicle_reassignment: [
        {
          status: 'Aceptado',
          date_created: '2026-03-18T10:00:00.000',
          new_employee_name: 'Driver A',
          previous_employee_name: null,
        },
        {
          status: 'Pendiente',
          date_created: '2026-03-19T11:12:35.843',
          new_employee_name: 'Driver B',
          previous_employee_name: 'Driver A',
        },
      ],
    }

    expect(resolveAssignmentDriverName(assignment)).toBe('Driver A')
    expect(hasPendingVehicleReassignment(assignment)).toBe(true)
  })

  it('uses new_employee_name when latest is Aceptado', () => {
    const assignment: any = {
      name: 'Original',
      vehicle_reassignment: [
        {
          status: 'Rechazado',
          date_created: '2026-03-18T10:00:00.000',
          new_employee_name: 'New',
          previous_employee_name: 'Prev',
        },
        {
          status: 'Aceptado',
          date_created: '2026-03-19T12:00:00.000',
          new_employee_name: 'New',
          previous_employee_name: 'Prev',
        },
      ],
    }

    expect(resolveAssignmentDriverName(assignment)).toBe('New')
  })

  it('uses previous_employee_name when latest is Rechazado', () => {
    const assignment: any = {
      name: 'Original',
      vehicle_reassignment: [
        {
          status: 'Aceptado',
          date_created: '2026-03-18T10:00:00.000',
          new_employee_name: 'New',
          previous_employee_name: null,
        },
        {
          status: 'Rechazado',
          date_created: '2026-03-19T12:00:00.000',
          new_employee_name: 'New 2',
          previous_employee_name: 'Prev',
        },
      ],
    }

    expect(resolveAssignmentDriverName(assignment)).toBe('Prev')
  })
})

