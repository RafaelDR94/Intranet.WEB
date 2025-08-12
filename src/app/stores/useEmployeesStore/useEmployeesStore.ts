// src/app/stores/employees/useEmployeesStore.ts
'use client'

import { createWithEqualityFn } from 'zustand/traditional'
import { devtools } from 'zustand/middleware'
import type { EmployeesState } from './types'
import { fetchEmployees } from './utilities/fetchEmployees'

export const useEmployeesStore = createWithEqualityFn<EmployeesState>()(
  devtools((set, get) => ({
    employees: [],
    loading: false,
    error: undefined,

    fetchEmployees: (force = false) => fetchEmployees(set, get, force),
    forceFetchEmployees: async () => { await fetchEmployees(set, get, true) },

    reset: () => set({ employees: [], error: undefined }),
  }))
)
