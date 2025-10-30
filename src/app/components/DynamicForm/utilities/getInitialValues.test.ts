import { describe,it,expect } from 'vitest'

import { FieldModel } from '../types'

import { getInitialValues } from './getInitialValues'

describe('getInitialValues',()=>{
  it('creates initial values for each field',()=>{
    const fields:FieldModel[]=[
      {name:'name',label:'Name',value:'',type:'text'},
      {name:'age',label:'Age',value:null,type:'number'},
      {name:'file',label:'File',value:null,type:'file'},
      {name:'docs',label:'Docs',value:['card'],type:'checkboxList',options:[{label:'Card',value:'card'}]},
      {name:'qty',label:'Qty',value:null,type:'numberControl'},
      {name:'level',label:'Nivel',value:null,type:'controlLevel',controlLevelProps:{initialValue:0.5,min:0,max:1}}
    ]
    const result=getInitialValues(fields)
    expect(result).toEqual({name:'',age:null,file:null,docs:['card'],qty:null,level:0.5})
  })
})
