import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import useSelect from './useSelect'

describe('useSelect',()=>{
  it('toggles option on click',()=>{
    const onChange = vi.fn()
    const { result } = renderHook(()=>useSelect({multiple:false,onChange,selected:[]}))
    act(()=>{
      result.current.toggleOption('a')
    })
    expect(onChange).toHaveBeenCalledWith(['a'])
    expect(result.current.open).toBe(false)
  })
})
