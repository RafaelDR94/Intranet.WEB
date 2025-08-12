// src/store/useProyectsStore.ts
'use client'

import { createWithEqualityFn } from 'zustand/traditional'
import { devtools } from 'zustand/middleware'
import type { ProyectsState } from './types'
import { fetchProyects } from './utilities/fetchProyects'

export const useProyectsStore = createWithEqualityFn<ProyectsState>()(
  devtools((set, get) => ({
    proyects: [],
    loading: false,
    error: undefined,

    fetchProyects: (force = false) => fetchProyects(set, get, force),

    forceFetchProyects: async () => {
      await fetchProyects(set, get, true)
    },

    reset: () => set({ proyects: [], error: undefined }),
  }))
)
