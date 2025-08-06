// src/hooks/useFormFieldsStore.ts
import { create } from 'zustand'
import { FieldModel } from '@/app/components/DynamicForm/types'

interface FormFieldsState {
  fields: FieldModel[]
  setFields: (newFields: FieldModel[]) => void
  updateField: (name: string, changes: Partial<FieldModel>) => void
  resetFields: () => void
}

export const useFormFieldsStore = create<FormFieldsState>((set, get) => ({
  fields: [],
  setFields: (newFields) => set({ fields: newFields }),
  updateField: (name, changes) =>
    set((state) => ({
      fields: state.fields.map((f) =>
        f.name === name ? { ...f, ...changes } : f
      ),
    })),
  resetFields: () => set({ fields: [] }),
}))
