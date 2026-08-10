import { describe, expect, it } from 'vitest'

import type { InternalDevice } from '@/app/mappings/internaldevices/internaldevices.types'

import {
  buildInternalDeviceSearchContent,
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

describe('buildInternalDeviceSearchContent', () => {
  it('includes hidden fields and descriptive values from related objects', () => {
    const device: InternalDevice = {
      ...createDevice('database-device-id'),
      mac_wifi_address: 'AA:BB:CC:DD:EE:FF',
      operating_system: 'Windows 11',
      description: 'Equipo para diseño',
      assigned: true,
      device_type: {
        device_type_id: 'database-type-id',
        name: 'Laptop',
        description: 'Equipo portátil',
        is_active: true,
      },
      enterprise: {
        enterprise_id: 'database-enterprise-id',
        name: 'Empresa de prueba',
        companytype: 'Privada',
        departments: [
          {
            department_id: 'database-department-id',
            name: 'Tecnología',
            enterprise_id: 'database-enterprise-id',
            enterprice_name: 'Empresa de prueba',
          },
        ],
        is_external: false,
      },
    }

    const content = buildInternalDeviceSearchContent(device)

    expect(content).toContain('AA:BB:CC:DD:EE:FF')
    expect(content).toContain('Windows 11')
    expect(content).toContain('Equipo para diseño')
    expect(content).toContain('Laptop')
    expect(content).toContain('Tecnología')
    expect(content).toContain('true')
    expect(content).toContain('false')
  })

  it('excludes database identifiers at every nesting level', () => {
    const device: InternalDevice = {
      ...createDevice('database-device-id'),
      device_brand: {
        device_brand_id: 'database-brand-id',
        name: 'Marca visible',
        description: '',
        is_active: true,
      },
      enterprise: {
        enterprise_id: 'database-enterprise-id',
        name: 'Empresa visible',
        departments: [
          {
            department_id: 'database-department-id',
            enterprise_id: 'database-enterprise-id',
            name: 'Departamento visible',
            enterprice_name: 'Empresa visible',
          },
        ],
        is_external: false,
      },
    }

    const content = buildInternalDeviceSearchContent(device)

    expect(content).not.toContain('database-device-id')
    expect(content).not.toContain('database-brand-id')
    expect(content).not.toContain('database-enterprise-id')
    expect(content).not.toContain('database-department-id')
  })
})
