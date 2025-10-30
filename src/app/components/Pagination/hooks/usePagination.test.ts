import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import usePagination from './usePagination'

describe('usePagination', () => {
  it('returns pagination items and jump functions', () => {
    const { result } = renderHook(() => usePagination(2, 10)) // página 2 de 10

    // ✅ Verifica que items sea un arreglo
    expect(Array.isArray(result.current.items)).toBe(true)

    // ✅ Verifica flags prev/next
    expect(result.current.canPrev).toBe(true)
    expect(result.current.canNext).toBe(true)

    // ✅ Verifica que las funciones jump devuelvan números válidos
    expect(typeof result.current.jumpLeft()).toBe('number')
    expect(typeof result.current.jumpRight()).toBe('number')

    // ✅ Los valores deben respetar los límites
    expect(result.current.jumpLeft()).toBeGreaterThanOrEqual(1)
    expect(result.current.jumpRight()).toBeLessThanOrEqual(10)
  })
})
