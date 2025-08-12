// src/hooks/useFormFieldsStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useFormFieldsStore } from './useFormFieldsStore'

const FORM_ID = 'test-form'

describe('useFormFieldsStore', () => {
  beforeEach(() => {
    // Aísla los tests limpiando todo el estado antes de cada caso
    useFormFieldsStore.getState().resetAll()
  })

  it('debería iniciar sin campos para el formId dado', () => {
    const state = useFormFieldsStore.getState()
    expect(state.fieldsByFormId[FORM_ID]).toBeUndefined()
  })

  it('setFields debería establecer el arreglo completo para un formId', () => {
    useFormFieldsStore.getState().setFields(FORM_ID, [
      { name: 'email', label: 'Email', value: '', variant: 'default', type: 'email' },
    ])

    const fields = useFormFieldsStore.getState().fieldsByFormId[FORM_ID]
    expect(fields).toBeDefined()
    expect(fields?.length).toBe(1)
    expect(fields?.[0].name).toBe('email')
  })

  it('updateField debería mezclar cambios por nombre en el formId indicado', () => {
    const api = useFormFieldsStore.getState()
    api.setFields(FORM_ID, [
      { name: 'email', label: 'Email', value: '', variant: 'default', type: 'email' },
    ])

    api.updateField(FORM_ID, 'email', { value: 'user@acme.com', variant: 'success' })

    const email = useFormFieldsStore.getState().fieldsByFormId[FORM_ID]?.find(f => f.name === 'email')
    expect(email?.value).toBe('user@acme.com')
    expect(email?.variant).toBe('success')
  })

  it('resetFields debería borrar SOLO el formId indicado', () => {
    const api = useFormFieldsStore.getState()
    api.setFields(FORM_ID, [{ name: 'a', label: 'A', value: 1, variant: 'default', type: 'input' }])
    api.setFields('otro-form', [{ name: 'b', label: 'B', value: 2, variant: 'default', type: 'input' }])

    api.resetFields(FORM_ID)

    const state = useFormFieldsStore.getState()
    expect(state.fieldsByFormId[FORM_ID]).toBeUndefined()
    expect(state.fieldsByFormId['otro-form']).toBeDefined()
  })

  it('resetAll debería limpiar todos los formularios', () => {
    const api = useFormFieldsStore.getState()
    api.setFields(FORM_ID, [{ name: 'a', label: 'A', value: 1, variant: 'default', type: 'input' }])
    api.setFields('otro-form', [{ name: 'b', label: 'B', value: 2, variant: 'default', type: 'input' }])

    api.resetAll()

    const state = useFormFieldsStore.getState()
    expect(state.fieldsByFormId).toEqual({})
  })
})
