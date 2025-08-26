import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useRequisitionsList } from './useRequisitionsList'

describe('useRequisitionsList', () => {
  it('opens and closes the editor', () => {
    const { result } = renderHook(() => useRequisitionsList())
    expect(result.current.editorOpen).toBe(false)
    act(() => result.current.openEditor({} as any))
    expect(result.current.editorOpen).toBe(true)
    act(() => result.current.closeEditor())
    expect(result.current.editorOpen).toBe(false)
  })
})
