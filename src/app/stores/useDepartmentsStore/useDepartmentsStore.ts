'use client'

import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

import type { DepartmentsState } from './types'
import { fetchDepartments } from './utilities'

const initialState: Pick<
  DepartmentsState,
  'departments' | 'loading' | 'successGet' | 'error'
> = {
  departments: [],
  loading: false,
  successGet: false,
  error: undefined,
}

export const useDepartmentsStore = createWithEqualityFn<DepartmentsState>()(
  devtools((set, get) => ({
    ...initialState,

    fetchDepartments: (force = false) => fetchDepartments(set, get, force),

    reset: () => set({ ...initialState }),

    resetFlags: () => set({ loading: false, successGet: false, error: undefined }),
  })),
)
