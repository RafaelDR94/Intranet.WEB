'use client'
import type { Set } from '../types'

export const handleOfflineMode = (
  set: Set,
  offline: boolean
): void => {
  set({ offlineMode: offline })
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_ONLY_MODE',
      payload: offline === true,
    })
  }
}
