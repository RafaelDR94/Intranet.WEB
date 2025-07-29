import { describe,it,expect } from 'vitest'
import { getValidationSchema } from './getValidationSchema'
import { FieldModel } from '../types'

describe('getValidationSchema',()=>{
  it('builds yup schema with required rule', async()=>{
    const fields:FieldModel[]=[{name:'email',type:'text',validations:[{type:'required'}]}]
    const schema=getValidationSchema(fields)
    await expect(schema.isValid({email:''})).resolves.toBe(false)
    await expect(schema.isValid({email:'ok'})).resolves.toBe(true)
  })
})
