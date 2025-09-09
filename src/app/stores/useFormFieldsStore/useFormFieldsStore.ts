// src/hooks/useFormFieldsStore.ts
'use client'

import { create } from 'zustand'

import type { FormFieldsState } from './types'

/**
 * useFormFieldsStore
 *
 * Store global multi‑instancia por `formId` para campos de formularios dinámicos.
 * En lugar de un solo arreglo `fields`, maneja un diccionario `fieldsByFormId`
 * para que múltiples formularios coexistan sin pisarse.
 *
 * Estructura:
 * - fieldsByFormId: { [formId: string]: FieldModel[] }
 *
 * Acciones:
 * - setFields(formId, newFields): reemplaza TODOS los campos del formulario indicado.
 * - updateField(formId, name, changes): mezcla propiedades en un campo por nombre.
 * - resetFields(formId): elimina la entrada del formulario (limpieza por instancia).
 * - resetAll(): borra TODOS los formularios almacenados.
 */
export const useFormFieldsStore = create<FormFieldsState>((set) => ({
  /**
   * Diccionario con los campos por formulario.
   * La clave es un `formId` único por instancia de formulario.
   */
  fieldsByFormId: {},

  /**
   * Reemplaza completamente el arreglo de campos de un formulario.
   * @param formId ID único del formulario
   * @param newFields Lista completa de campos a establecer
   */
  setFields: (formId, newFields) =>
    set((s) => ({
      fieldsByFormId: {
        ...s.fieldsByFormId,
        [formId]: newFields,
      },
    })),

  /**
   * Actualiza (merge) un campo identificado por `name` dentro del formulario.
   * Si el campo no existe, se ignora silenciosamente.
   * @param formId ID único del formulario
   * @param name Nombre del campo a actualizar
   * @param changes Propiedades a mezclar en el campo encontrado
   */
  updateField: (formId, name, changes) =>
    set((s) => ({
      fieldsByFormId: {
        ...s.fieldsByFormId,
        [formId]: (s.fieldsByFormId[formId] ?? []).map((f) =>
          f.name === name ? { ...f, ...changes } : f
        ),
      },
    })),

  /**
   * Elimina el estado de un formulario específico del store.
   * Útil para limpiar al desmontar una página/formulario.
   * @param formId ID único del formulario
   */
  resetFields: (formId) =>
    set((s) => {
      const { [formId]: _omit, ...rest } = s.fieldsByFormId
      return { fieldsByFormId: rest }
    }),

  /**
   * Limpia TODOS los formularios guardados en memoria.
   * Útil para acciones globales (logout, navegación mayor, etc.).
   */
  resetAll: () => set({ fieldsByFormId: {} }),
}))
