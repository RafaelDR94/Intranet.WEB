import { describe,it,expect } from 'vitest'
import { getInitialValues } from './getInitialValues'
import { FieldModel } from '../types'

describe('getInitialValues',()=>{
  it('creates initial values for each field',()=>{
    const fields:FieldModel[]=[{name:'name',type:'text'},{name:'age',type:'number'}]
    const result=getInitialValues(fields)
    expect(result).toEqual({name:'',age:null})
  })
})
