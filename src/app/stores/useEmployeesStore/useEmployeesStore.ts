// src/app/stores/employees/useEmployeesStore.ts
'use client'

import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

import type { EmployeesState } from './types'
import { fetchEmployees } from './utilities/fetchEmployees'

/**
 * Global Zustand store for employee catalog.
 *
 * Mantiene una lista de empleados obtenidos del API y expone utilidades
 * para refetch y limpieza de estado.
 */
export const useEmployeesStore = createWithEqualityFn<EmployeesState>()(
  devtools((set, get) => ({
    /** Lista de empleados mapeados */
    employees: [],
    /** Indica petición en curso */
    loading: false,
    /** Mensaje de error si la petición falla */
    error: undefined,

    /**
     * Obtiene empleados del backend.
     * @param force si `true` ignora el cache local
     */
    fetchEmployees: (force = false) => fetchEmployees(set, get, force),
    /** Forza un refetch sin considerar cache */
    forceFetchEmployees: async () => { await fetchEmployees(set, get, true) },

    /** Restablece el estado a su valor inicial */
    reset: () => set({ employees: [], error: undefined }),
  }))
)
