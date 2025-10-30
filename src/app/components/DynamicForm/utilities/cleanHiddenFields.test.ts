import { describe,it,expect } from 'vitest'

import { FieldModel } from '../types'

import { cleanHiddenFields } from './cleanHiddenFields'

describe('cleanHiddenFields',()=>{
  it('clears values of hidden fields',()=>{
    const fields:FieldModel[]=[
      {name:'visible',label:'Visible',value:'',type:'text'},
      {name:'secret',label:'Secret',value:'',type:'text',showIf:()=>false},
      {name:'doc',label:'Doc',value:null,type:'file',showIf:()=>false},
      {name:'docs',label:'Docs',value:['card'],type:'checkboxList',showIf:()=>false,options:[{label:'Card',value:'card'}]},
      {name:'qty',label:'Qty',value:5,type:'numberControl',showIf:()=>false},
      {name:'lvl',label:'Nivel',value:0.5,type:'controlLevel',showIf:()=>false,controlLevelProps:{min:0,max:1}}
    ]
    const values={visible:'ok',secret:'secret',doc:new File(['a'],'a.txt'),docs:['card'],qty:5,lvl:0.5}
    const result=cleanHiddenFields(fields,values)
    expect(result.secret).toBe('')
    expect(result.doc).toBeNull()
    expect(result.docs).toEqual([])
    expect(result.qty).toBeNull()
    expect(result.lvl).toBeNull()
  })
})
