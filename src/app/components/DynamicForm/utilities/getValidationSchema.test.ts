import { describe,it,expect } from 'vitest'

import { FieldModel } from '../types'

import { getValidationSchema } from './getValidationSchema'

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

  it('valida reglas en NumberControl', async () => {
    const fields: FieldModel[] = [{
      name: 'qty',
      label: 'Qty',
      value: null,
      type: 'numberControl',
      validations: [{ type: 'required' }, { type: 'min', value: 1 }]
    }]
    const schema = getValidationSchema(fields)
    await expect(schema.isValid({ qty: null })).resolves.toBe(false)
    await expect(schema.isValid({ qty: 0 })).resolves.toBe(false)
    await expect(schema.isValid({ qty: 2 })).resolves.toBe(true)
  })

  it('valida reglas en ControlLevel', async () => {
    const fields: FieldModel[] = [{
      name: 'nivel',
      label: 'Nivel',
      value: 0.5,
      type: 'controlLevel',
      controlLevelProps: { min: 0, max: 1 },
      validations: [
        { type: 'required' },
        { type: 'min', value: 0 },
        { type: 'max', value: 1 }
      ]
    }]
    const schema = getValidationSchema(fields)
    await expect(schema.isValid({ nivel: null })).resolves.toBe(false)
    await expect(schema.isValid({ nivel: -0.2 })).resolves.toBe(false)
    await expect(schema.isValid({ nivel: 0.8 })).resolves.toBe(true)
  })

  it('valida reglas en CheckBoxList requerido', async () => {
    const fields: FieldModel[] = [{
      name: 'docs',
      label: 'Documentos',
      type: 'checkboxList',
      options: [
        { label: 'Tarjeta', value: 'card' },
        { label: 'Póliza', value: 'policy' },
      ],
      validations: [{ type: 'required' }],
    }]
    const schema = getValidationSchema(fields)
    await expect(schema.isValid({ docs: [] })).resolves.toBe(false)
    await expect(schema.isValid({ docs: ['card'] })).resolves.toBe(true)
  })
})
