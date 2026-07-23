import { describe, expect, it } from 'vitest'

import { InternalDeviceMap } from './internaldevices.mapper'

describe('InternalDeviceMap', () => {
  it('maps date_created to the normalized creation date field', () => {
    const device = InternalDeviceMap({
      id: 'device-1',
      date_created: '2026-07-10T08:30:00Z',
    })

    expect(device.created_at).toBe('2026-07-10T08:30:00Z')
  })
})
