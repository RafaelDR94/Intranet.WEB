import { describe,it,expect } from 'vitest'
import { cleanHiddenFields } from './cleanHiddenFields'
import { FieldModel } from '../types'

describe('cleanHiddenFields',()=>{
  it('clears values of hidden fields',()=>{
    const fields:FieldModel[]=[
      {name:'visible',label:'Visible',value:'',type:'text'},
      {name:'secret',label:'Secret',value:'',type:'text',showIf:()=>false},
      {name:'doc',label:'Doc',value:null,type:'file',showIf:()=>false},
      {name:'qty',label:'Qty',value:5,type:'numberControl',showIf:()=>false}
    ]
    const values={visible:'ok',secret:'secret',doc:new File(['a'],'a.txt'),qty:5}
    const result=cleanHiddenFields(fields,values)
    expect(result.secret).toBe('')
    expect(result.doc).toBeNull()
    expect(result.qty).toBeNull()
  })
})
