import { renderHook } from '@testing-library/react'
import { describe,it,expect } from 'vitest'

import { FieldModel } from '../types'

import { useDynamicForm } from './useDynamicForm'

describe('useDynamicForm',()=>{
  it('returns initialValues and schema',()=>{
    const fields:FieldModel[]=[
      {name:'name',label:'Name',value:'',type:'text',validations:[{type:'required'}]},
      {name:'doc',label:'Doc',value:null,type:'file'},
      {name:'docs',label:'Docs',value:['card'],type:'checkboxList',options:[{label:'Card',value:'card'}]},
      {name:'qty',label:'Qty',value:2,type:'numberControl'},
      {name:'level',label:'Nivel',value:1,type:'controlLevel',controlLevelProps:{min:0,max:5}}
    ]
    const {result}=renderHook(()=>useDynamicForm(fields))
    expect(result.current.initialValues).toEqual({name:'',doc:null,docs:['card'],qty:2,level:1})
    expect(result.current.validationSchema).toBeTruthy()
  })
})
