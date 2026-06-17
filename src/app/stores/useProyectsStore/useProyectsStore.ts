// src/store/useProyectsStore.ts
'use client'

import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

import type { ProyectsState } from './types'
import {
  createProyect,
  updateProyect,
  deleteProyect,
  fetchProyectById,
  linkLocationsToProyect,
} from './utilities'
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
    linkingLocations: false,
    removing: false,

    /** Flags de éxito */
    successGet: false,
    successPost: false,
    successPut: false,
    successLinkLocations: false,
    successDelete: false,

    /** Mensaje de error del último request */
    error: undefined,

    /** Obtiene proyectos del backend */
    fetchProyects: async (force = false, idEmployee) => {
      await fetchProyects(set, get, force, idEmployee)
      set({ successGet: true })
    },
    fetchProyectById: async (id) => {
      const proyect = await fetchProyectById(set, get, id)
      set({ successGet: true })
      return proyect
    },
    /** Refetch forzado */
    forceFetchProyects: async () => { await fetchProyects(set, get, true) },

    /** Crea un proyecto */
    createProyect: (payload) => createProyect(set, get, payload),
    /** Actualiza un proyecto */
    updateProyect: (payload) => updateProyect(set, get, payload),
    /** Vincula ubicaciones existentes a un proyecto */
    linkLocationsToProyect: (payload) => linkLocationsToProyect(set, get, payload),
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
      linkingLocations: false,
      removing: false,
      successGet: false,
      successPost: false,
      successPut: false,
      successLinkLocations: false,
      successDelete: false,
    }),
    /** Limpia solo los flags */
    resetFlags: () => set({
      loading: false,
      creating: false,
      updating: false,
      linkingLocations: false,
      removing: false,
      successGet: false,
      successPost: false,
      successPut: false,
      successLinkLocations: false,
      successDelete: false,
      error: undefined,
    }),
  }))
)
