'use client'

import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

import type { DepartmentsState } from './types'
import { fetchDepartments, createDepartment, updateDepartment } from './utilities'

const initialState: Pick<
  DepartmentsState,
  'departments' | 'loading' | 'successGet' | 'creating' | 'successPost' | 'error'
  | 'updating' | 'successPut'
> = {
  departments: [],
  loading: false,
  successGet: false,
  creating: false,
  successPost: false,
  updating: false,
  successPut: false,
  error: undefined,
}

export const useDepartmentsStore = createWithEqualityFn<DepartmentsState>()(
  devtools((set, get) => ({
    ...initialState,

    fetchDepartments: (force = false) => fetchDepartments(set, get, force),
    createDepartment: (payload) => createDepartment(set, get, payload),
    updateDepartment: (payload) => updateDepartment(set, get, payload),

    reset: () => set({ ...initialState }),

    resetFlags: () =>
      set({
        loading: false,
        successGet: false,
        creating: false,
        successPost: false,
        updating: false,
        successPut: false,
        error: undefined,
      }),
  })),
)
