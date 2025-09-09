// src/store/useProyectsStore.ts
'use client'

import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

import type { ProyectsState } from './types'
import { fetchProyects } from './utilities/fetchProyects'

/**
 * Store global para manejar el catálogo de proyectos.
 */
export const useProyectsStore = createWithEqualityFn<ProyectsState>()(
  devtools((set, get) => ({
    /** Lista de proyectos disponibles */
    proyects: [],
    /** Estado de carga */
    loading: false,
    /** Mensaje de error del último request */
    error: undefined,

    /** Obtiene proyectos del backend */
    fetchProyects: (force = false) => fetchProyects(set, get, force),

    /** Refetch forzado */
    forceFetchProyects: async () => {
      await fetchProyects(set, get, true)
    },

    /** Limpia el estado */
    reset: () => set({ proyects: [], error: undefined }),
  }))
)
