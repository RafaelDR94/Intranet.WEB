import { renderHook } from '@testing-library/react'
import { describe,it,expect } from 'vitest'
import { useDynamicForm } from './useDynamicForm'
import { FieldModel } from '../types'

describe('useDynamicForm',()=>{
  it('returns initialValues and schema',()=>{
    const fields:FieldModel[]=[{name:'name',type:'text',validations:[{type:'required'}]}]
    const {result}=renderHook(()=>useDynamicForm(fields))
    expect(result.current.initialValues).toEqual({name:''})
    expect(result.current.validationSchema).toBeTruthy()
  })
})
