import { describe,it,expect } from 'vitest'
import { cleanHiddenFields } from './cleanHiddenFields'
import { FieldModel } from '../types'

describe('cleanHiddenFields',()=>{
  it('clears values of hidden fields',()=>{
    const fields:FieldModel[]=[
      {name:'visible',type:'text'},
      {name:'secret',type:'text',showIf:()=>false}
    ]
    const values={visible:'ok',secret:'secret'}
    const result=cleanHiddenFields(fields,values)
    expect(result.secret).toBe('')
  })
})
