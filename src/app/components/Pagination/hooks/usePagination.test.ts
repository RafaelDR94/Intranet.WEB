import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import usePagination from './usePagination'

describe('usePagination', () => {
  it('provides classes for pages and arrows', () => {
    const { result } = renderHook(() => usePagination(2))
    expect(typeof result.current.getPageClass(1)).toBe('string')
    expect(typeof result.current.getArrowClass(false)).toBe('string')
  })
})