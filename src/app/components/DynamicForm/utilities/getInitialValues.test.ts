import { describe,it,expect } from 'vitest'
import { getInitialValues } from './getInitialValues'
import { FieldModel } from '../types'

describe('getInitialValues',()=>{
  it('creates initial values for each field',()=>{
    const fields:FieldModel[]=[
      {name:'name',label:'Name',value:'',type:'text'},
      {name:'age',label:'Age',value:null,type:'number'},
      {name:'file',label:'File',value:null,type:'file'}
    ]
    const result=getInitialValues(fields)
    expect(result).toEqual({name:'',age:null,file:null})
  })
})
