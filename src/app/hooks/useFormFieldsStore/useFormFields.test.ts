

import { describe, it, expect } from 'vitest'
import { useFormFieldsStore } from './useFormFieldsStore'

describe('useFormFieldsStore', () => {
  it('debería inicializar con fields vacíos', () => {
    const { fields } = useFormFieldsStore.getState()
    expect(fields).toEqual([])
  })

  it('setFields debería reemplazar el arreglo completo', () => {
    useFormFieldsStore.getState().setFields([
      { name: 'email', label: 'Email', value: '', variant: 'default', type:'email'},
    ])
    expect(useFormFieldsStore.getState().fields).toHaveLength(1)
  })

  it('updateField debería mezclar cambios por name', () => {
    useFormFieldsStore.getState().setFields([
      { name: 'email', label: 'Email', value: '', variant: 'default', type:'email' },
    ])
    useFormFieldsStore.getState().updateField('email', { value: 'user@acme.com', variant: 'success' })
    const email = useFormFieldsStore.getState().fields.find(f => f.name === 'email')
    expect(email?.value).toBe('user@acme.com')
    expect(email?.variant).toBe('success')
  })

  it('resetFields debería limpiar el store', () => {
    useFormFieldsStore.getState().setFields([
      { name: 'a', label: 'A', value: 1, variant: 'default' , type:'input'},
    ])
    useFormFieldsStore.getState().resetFields()
    expect(useFormFieldsStore.getState().fields).toEqual([])
  })
})
