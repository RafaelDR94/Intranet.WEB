import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './useAuthStore'

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().reset()
  })

  it('resetea los flags', () => {
    const store = useAuthStore
    store.setState({ loading: true, successLogin: true })
    store.getState().resetFlags()
    const state = store.getState()
    expect(state.loading).toBe(false)
    expect(state.successLogin).toBe(false)
  })
})
