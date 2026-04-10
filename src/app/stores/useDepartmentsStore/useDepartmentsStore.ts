'use client'

import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

import type { DepartmentsState } from './types'
import { fetchDepartments, createDepartment } from './utilities'

const initialState: Pick<
  DepartmentsState,
  'departments' | 'loading' | 'successGet' | 'creating' | 'successPost' | 'error'
> = {
  departments: [],
  loading: false,
  successGet: false,
  creating: false,
  successPost: false,
  error: undefined,
}

export const useDepartmentsStore = createWithEqualityFn<DepartmentsState>()(
  devtools((set, get) => ({
    ...initialState,

    fetchDepartments: (force = false) => fetchDepartments(set, get, force),
    createDepartment: (payload) => createDepartment(set, get, payload),

    reset: () => set({ ...initialState }),

    resetFlags: () =>
      set({
        loading: false,
        successGet: false,
        creating: false,
        successPost: false,
        error: undefined,
      }),
  })),
)
