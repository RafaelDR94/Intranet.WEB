// src/store/useProyectsStore.ts
'use client'

import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

import type { ProyectsState } from './types'
import { createProyect, updateProyect, deleteProyect } from './utilities'
import { fetchProyects } from './utilities/fetchProyects'

/**
 * Store global para manejar el catálogo de proyectos.
 */
export const useProyectsStore = createWithEqualityFn<ProyectsState>()(
  devtools((set, get) => ({
    /** Lista de proyectos disponibles */
    proyects: [],
    /** Proyecto seleccionado */
    currentProyect: null,

    /** Flags de proceso */
    loading: false,
    creating: false,
    updating: false,
    removing: false,

    /** Flags de éxito */
    successGet: false,
    successPost: false,
    successPut: false,
    successDelete: false,

    /** Mensaje de error del último request */
    error: undefined,

    /** Obtiene proyectos del backend */
    fetchProyects: async (force = false) => {
      await fetchProyects(set, get, force)
      set({ successGet: true })
    },
    /** Refetch forzado */
    forceFetchProyects: async () => { await fetchProyects(set, get, true) },

    /** Crea un proyecto */
    createProyect: (payload) => createProyect(set, get, payload),
    /** Actualiza un proyecto */
    updateProyect: (payload) => updateProyect(set, get, payload),
    /** Elimina un proyecto */
    deleteProyect: (id) => deleteProyect(set, get, id),

    /** Selección de proyecto actual */
    setCurrentProyect: (p) => set({ currentProyect: p ?? null }),
    clearCurrentProyect: () => set({ currentProyect: null }),

    /** Limpia el estado */
    reset: () => set({
      proyects: [],
      currentProyect: null,
      error: undefined,
      loading: false,
      creating: false,
      updating: false,
      removing: false,
      successGet: false,
      successPost: false,
      successPut: false,
      successDelete: false,
    }),
    /** Limpia solo los flags */
    resetFlags: () => set({
      loading: false,
      creating: false,
      updating: false,
      removing: false,
      successGet: false,
      successPost: false,
      successPut: false,
      successDelete: false,
      error: undefined,
    }),
  }))
)
