'use client'

import type { AxiosResponse } from 'axios'

import { Departments as DepartmentsUrl } from '@/app/configurations/Axios/urls'
import { mapDepartments } from '@/app/mappings/department/department.mapper'
import type { DepartmentType } from '@/app/mappings/department/department.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import type { Get, Set } from '../types'

const toArray = (payload: unknown): unknown[] => {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  return [payload]
}

export const fetchDepartments = async (
  set: Set,
  get: Get,
  force = false,
): Promise<void> => {
  const state = get()
  if (!force && state.departments.length > 0) return

  set({ loading: true, error: undefined, successGet: false })

  try {
    const getFn = requireGateway('get')
    const getRequest = pGet(getFn)
    const response: AxiosResponse = await getRequest(DepartmentsUrl)
    const payload = response?.data?.data ?? response?.data ?? []

    const mapped: DepartmentType[] = mapDepartments(toArray(payload))

    set({
      departments: mapped,
      loading: false,
      successGet: true,
    })
  } catch (error) {
    const normalized = normalizeApiError(error)
    set({ error: normalized.message, loading: false, successGet: false })
  }
}
