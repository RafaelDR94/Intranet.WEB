import { describe,it,expect } from 'vitest'
import { getValidationSchema } from './getValidationSchema'
import { FieldModel } from '../types'

describe('getValidationSchema',()=>{
  it('builds yup schema with required rule', async()=>{
    const fields:FieldModel[]=[{name:'email',label:'Email',value:'',type:'text',validations:[{type:'required'}]}]
    const schema=getValidationSchema(fields)
    await expect(schema.isValid({email:''})).resolves.toBe(false)
    await expect(schema.isValid({email:'ok'})).resolves.toBe(true)
  })

  it('validates required file fields', async()=>{
    const fields:FieldModel[]=[{name:'doc',label:'Doc',value:null,type:'file',validations:[{type:'required'}]}]
    const schema=getValidationSchema(fields)
    await expect(schema.isValid({doc:null})).resolves.toBe(false)
    const file=new File(['hi'],'hi.txt')
    await expect(schema.isValid({doc:file})).resolves.toBe(true)
  })
})
