import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCalendar } from './useCalendar'

describe('useCalendar', () => {
  it('clears the selected range and notifies consumers without dates', () => {
    const onCalendarClick = vi.fn()
    const { result } = renderHook(() => useCalendar({ onCalendarClick }))

    act(() => {
      result.current.applyRange(new Date(2026, 6, 10), new Date(2026, 6, 11))
    })
    act(() => {
      result.current.clearRange()
    })

    expect(result.current.startDate).toBeNull()
    expect(result.current.endDate).toBeNull()
    expect(onCalendarClick).toHaveBeenLastCalledWith()
  })
})
