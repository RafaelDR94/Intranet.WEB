import { renderHook } from '@testing-library/react'
import { describe,it,expect } from 'vitest'

import { FieldModel } from '../types'

import { useDynamicForm } from './useDynamicForm'

describe('useDynamicForm',()=>{
  it('returns initialValues and schema',()=>{
    const fields:FieldModel[]=[
      {name:'name',label:'Name',value:'',type:'text',validations:[{type:'required'}]},
      {name:'doc',label:'Doc',value:null,type:'file'},
      {name:'qty',label:'Qty',value:2,type:'numberControl'}
    ]
    const {result}=renderHook(()=>useDynamicForm(fields))
    expect(result.current.initialValues).toEqual({name:'',doc:null,qty:2})
    expect(result.current.validationSchema).toBeTruthy()
  })
})
