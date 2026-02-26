import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import useAuthorizationDetail from './useAuthorizationDetail'

let currentParams = new URLSearchParams()

vi.mock('next/navigation', () => ({
  useSearchParams: () => currentParams,
}))

describe('useAuthorizationDetail', () => {
  it('detecta requisiciones desde el querystring', () => {
    currentParams = new URLSearchParams('kind=Requisicion')
    const { result } = renderHook(() => useAuthorizationDetail())
    expect(result.current.isRequisition).toBe(true)
    expect(result.current.isVale).toBe(false)
  })

  it('detecta vales desde el querystring', () => {
    currentParams = new URLSearchParams('kind=Vale')
    const { result } = renderHook(() => useAuthorizationDetail())
    expect(result.current.isVale).toBe(true)
  })
})
