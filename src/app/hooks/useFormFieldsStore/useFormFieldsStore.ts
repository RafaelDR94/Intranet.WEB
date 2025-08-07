// src/hooks/useFormFieldsStore.ts
import { create } from 'zustand'
import { FormFieldsState } from './types'

/**
 * useFormFieldsStore
 *
 * Store global para gestionar el arreglo de campos del DynamicForm (o formularios similares).
 * Centraliza el estado para permitir que múltiples componentes (FieldRenderer, catálogos, etc.)
 * lean y actualicen la definición/estado visual de campos de forma consistente.
 *
 * @returns {FormFieldsState & {
 *   setFields: (newFields: FormFieldsState['fields']) => void;
 *   updateField: (name: string, changes: Partial<FormFieldsState['fields'][number]>) => void;
 *   resetFields: () => void;
 * }} API del store con acciones estándar (set, update, reset).
 *
 * @example
 * const { fields, setFields, updateField, resetFields } = useFormFieldsStore();
 * useEffect(() => {
 *   setFields([{ name: 'email', label: 'Email', value: '', variant: 'default' }]);
 * }, []);
 * // Actualizar un campo por nombre:
 * updateField('email', { value: 'user@acme.com', variant: 'success' });
 */

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
