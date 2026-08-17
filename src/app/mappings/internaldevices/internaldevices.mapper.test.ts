import { describe, expect, it } from 'vitest'

import {
  InternalDeviceAssignmentMap,
  InternalDeviceMap,
} from './internaldevices.mapper'

describe('InternalDeviceMap', () => {
  it('maps date_created to the normalized creation date field', () => {
    const device = InternalDeviceMap({
      id: 'device-1',
      date_created: '2026-07-10T08:30:00Z',
    })

    expect(device.created_at).toBe('2026-07-10T08:30:00Z')
  })
})

describe('InternalDeviceAssignmentMap', () => {
  it('maps datecreated to assignment date fields for table calendar filters', () => {
    const assignment = InternalDeviceAssignmentMap({
      id: 'assignment-1',
      device_id: 'device-1',
      employee_id: 'employee-1',
      datecreated: '2026-08-17T00:00:00Z',
    })

    expect(assignment.date).toBe('2026-08-17T00:00:00Z')
    expect(assignment.created_at).toBe('2026-08-17T00:00:00Z')
  })

  it('maps date_created to assignment date fields for table calendar filters', () => {
    const assignment = InternalDeviceAssignmentMap({
      id: 'assignment-2',
      device_id: 'device-2',
      employee_id: 'employee-2',
      date_created: '2026-08-17T09:30:00Z',
    })

    expect(assignment.date).toBe('2026-08-17T09:30:00Z')
    expect(assignment.created_at).toBe('2026-08-17T09:30:00Z')
  })
})
