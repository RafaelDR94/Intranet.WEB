import { describe, it, expect } from 'vitest'
import { useAuthStore } from './useAuthStore'

describe('useAuthStore', () => {
  it('resetea los flags', () => {
    const store = useAuthStore
    store.setState({ loading: true, successLogin: true })
    store.getState().resetFlags()
    const state = store.getState()
    expect(state.loading).toBe(false)
    expect(state.successLogin).toBe(false)
  })
})
