import { describe, it, expect, vi } from 'vitest'

import type { AuthState, Set } from '../types'

import { handleOfflineMode } from './handleOfflineMode'

describe('handleOfflineMode util', () => {
  it('notifica al service worker y actualiza estado', () => {
    const state: Partial<AuthState> = { offlineMode: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as AuthState) : partial)
    const postMessage = vi.fn()
    Object.defineProperty(navigator, 'serviceWorker', {
      value: { controller: { postMessage } },
      configurable: true,
    })
    handleOfflineMode(set, true)
    expect(state.offlineMode).toBe(true)
    expect(postMessage).toHaveBeenCalledWith({ type: 'CACHE_ONLY_MODE', payload: true })
  })
})
