import { renderHook, act } from '@testing-library/react'
import useAlert from './useAlert'
import { describe, it, expect } from 'vitest'

const sampleAlert = { title: 't', description: 'd' }

describe('useAlert', () => {
  it('shows and hides alerts', () => {
    const { result } = renderHook(() => useAlert())

    act(() => {
      result.current.showAlert(sampleAlert as any)
    })
    expect(result.current.alert).toEqual(sampleAlert)

    act(() => {
      result.current.hideAlert()
    })
    expect(result.current.alert).toBeNull()
  })
})
