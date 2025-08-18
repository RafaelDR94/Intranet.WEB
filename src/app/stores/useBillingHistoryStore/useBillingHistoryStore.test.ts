import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Set } from './types'

vi.mock('./utilities/fetchBillingHistory', () => ({
  fetchBillingHistory: vi.fn(async (set: Set) => {
    set({ history: [{ id: '1' }], loading: false })
  }),
}))

import { useBillingHistoryStore } from './useBillingHistoryStore'

describe('useBillingHistoryStore', () => {
  beforeEach(() => {
    useBillingHistoryStore.setState({ history: [], loading: false, error: undefined })
  })

  it('debería iniciar vacío', () => {
    expect(useBillingHistoryStore.getState().history).toEqual([])
  })

  it('fetchBillingHistory actualiza historial', async () => {
    await useBillingHistoryStore.getState().fetchBillingHistory()
    expect(useBillingHistoryStore.getState().history).toEqual([{ id: '1' }])
  })
})
