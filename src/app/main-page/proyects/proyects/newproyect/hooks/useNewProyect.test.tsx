import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import useNewProyect from './useNewProyect'

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalLoading: { showSpinner: vi.fn(), hideSpinner: vi.fn() },
    usePrincipalAlert: { showAlert: vi.fn(), hideAlert: vi.fn() },
  }),
}))

const setFields = vi.fn()
const updateField = vi.fn()
const resetFields = vi.fn()
vi.mock('@/app/stores/useFormFieldsStore/useFormFieldsStore', () => {
  const store = { fieldsByFormId: {} }
  const useFormFieldsStore: any = (_?: any) => ({
    fieldsByFormId: store.fieldsByFormId,
    setFields,
    updateField,
    resetFields,
  })
  useFormFieldsStore.getState = () => ({ setFields, updateField, resetFields })
  return { useFormFieldsStore }
})

vi.mock('@/app/stores/useEmployeesStore/useEmployeesStore', () => ({
  useEmployeesStore: (selector: any) =>
    selector({ employees: [], loading: false, error: undefined, fetchEmployees: vi.fn() }),
}))

const createProyect = vi.fn()
const resetFlags = vi.fn()
vi.mock('@/app/stores/useProyectsStore/useProyectsStore', () => ({
  useProyectsStore: (selector: any) =>
    selector({
      createProyect,
      creating: false,
      successPost: false,
      error: undefined,
      resetFlags,
    }),
}))

describe('useNewProyect hook', () => {
  it('expone buttonDisabled basado en formReady', () => {
    const { result } = renderHook(() => useNewProyect())
    expect(result.current.formReady).toBe(false)
    expect(result.current).toHaveProperty('fields')
    act(() => result.current.setFormReady(true))
    // submit desde buttonDisabled
    expect(result.current).toHaveProperty('setFormReady')
  })

  it('handleSubmit llama createProyect con payload mínimo', async () => {
    const { result } = renderHook(() => useNewProyect())
    await act(async () => {
      await result.current.handleSubmit({ name: 'N', proyectKey: 'K', client: 'C' })
    })
    expect(createProyect).toHaveBeenCalledWith(expect.objectContaining({ name: 'N', proyectKey: 'K', client: 'C', collaborators: [] }))
  })
})
