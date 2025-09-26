import { render } from '@testing-library/react'
import React, { useRef } from "react"
import { describe, it, expect } from 'vitest'

import { useIndeterminate } from './useCheckbox'

function TestComponent({indeterminate}:{indeterminate:boolean}){
  const ref = useRef<HTMLInputElement>(null)
  useIndeterminate(ref, indeterminate)
  return <input ref={ref} data-testid="chk" />
}

describe('useIndeterminate',()=>{
  it('marks input as indeterminate when true',()=>{
    const {getByTestId, rerender}=render(<TestComponent indeterminate={true}/>)
    const input = getByTestId('chk') as HTMLInputElement
    expect(input.indeterminate).toBe(true)
    rerender(<TestComponent indeterminate={false}/>)
    expect(input.indeterminate).toBe(false)
  })
})
