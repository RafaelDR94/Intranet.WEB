import { describe, it, expect } from 'vitest'
import { useBillingDocumentsStore } from './useBillingDocumentsStore'

describe('useBillingDocumentsStore', () => {
  it('resetea los flags', () => {
    const store = useBillingDocumentsStore
    store.setState({ loading: true, successLogin: true })
    store.getState().resetFlags()
    const state = store.getState()
    expect(state.loading).toBe(false)
    expect(state.successLogin).toBe(false)
  })
})
