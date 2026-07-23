import { describe, expect, it } from 'vitest'

import type { InternalDevice } from '@/app/mappings/internaldevices/internaldevices.types'

import {
  matchesAssignmentFilter,
  matchesReviewFilter,
  sortInternalDevicesByCreationDate,
} from './internalDevicesListTable'

const createDevice = (
  device_id: string,
  created_at?: string,
): InternalDevice => ({
  device_id,
  created_at,
  name: '',
  model: '',
  serial_number: '',
  ip_address: '',
  mac_address: '',
  mac_wifi_address: '',
  operating_system: '',
  charge_sn: '',
  description: '',
  low_motive: '',
  assigned: false,
  device_type: null,
  device_brand: null,
  device_status: null,
  device_proyect: null,
  is_active: true,
  reviewed: false,
  lowdate: null,
  lowuser: null,
  assurance: '',
  enterprise: null,
})

describe('sortInternalDevicesByCreationDate', () => {
  it('places the newest registered devices first without mutating the source', () => {
    const devices = [
      createDevice('old', '2026-01-10T10:00:00Z'),
      createDevice('without-date'),
      createDevice('new', '2026-07-21T10:00:00Z'),
    ]

    const sortedDevices = sortInternalDevicesByCreationDate(devices)

    expect(sortedDevices.map((device) => device.device_id)).toEqual([
      'new',
      'old',
      'without-date',
    ])
    expect(devices.map((device) => device.device_id)).toEqual([
      'old',
      'without-date',
      'new',
    ])
  })
})

describe('device filter predicates', () => {
  it('supports assignment and review filters independently', () => {
    expect(matchesAssignmentFilter(true, 'assigned')).toBe(true)
    expect(matchesAssignmentFilter(false, 'assigned')).toBe(false)
    expect(matchesAssignmentFilter(false, 'unassigned')).toBe(true)
    expect(matchesReviewFilter(true, 'reviewed')).toBe(true)
    expect(matchesReviewFilter(false, 'reviewed')).toBe(false)
    expect(matchesReviewFilter(false, 'unreviewed')).toBe(true)
  })

  it('does not restrict results when all is selected', () => {
    expect(matchesAssignmentFilter(true, 'all')).toBe(true)
    expect(matchesAssignmentFilter(false, 'all')).toBe(true)
    expect(matchesReviewFilter(true, 'all')).toBe(true)
    expect(matchesReviewFilter(false, 'all')).toBe(true)
  })
})
