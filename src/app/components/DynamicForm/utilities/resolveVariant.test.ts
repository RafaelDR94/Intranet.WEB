import { describe,it,expect } from 'vitest'
import { resolveVariant } from './resolveVariant'
import { FieldModel } from '../types'

describe('resolveVariant',()=>{
  it('returns error variant when field has error',()=>{
    const field:FieldModel={name:'age',type:'number'} as any
    const result=resolveVariant(field,{age:true},{age:'error'},0)
    expect(result.variant).toBe('error')
  })
})
