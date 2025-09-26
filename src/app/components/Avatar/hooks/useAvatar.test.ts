import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import useAvatar from './useAvatar'

describe('useAvatar', () => {
  it('returns provided initials when available', () => {
    const { result } = renderHook(() => useAvatar('AB', 'John Doe'))
    expect(result.current).toBe('AB')
  })

  it('generates initials from alt when initials missing', () => {
    const { result } = renderHook(() => useAvatar(undefined, 'John Doe'))
    expect(result.current).toBe('JD')
  })
})