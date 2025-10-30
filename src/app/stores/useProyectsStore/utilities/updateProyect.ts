// src/app/stores/useProyectsStore/utilities/updateProyect.ts
'use client'
import type { AxiosResponse } from 'axios'

import type { Set, Get } from '../types'

import { fetchProyects } from './fetchProyects'

import { ReportsProyects } from '@/app/configurations/Axios/urls'
import type { Proyect, ProyectPut } from '@/app/mappings/proyects/proyects.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Actualiza un proyecto en el backend.
 */
export const updateProyect = async (
  set: Set,
  get: Get,
  payload: ProyectPut
): Promise<Proyect | null> => {
  set({ updating: true, error: undefined, successPut: false })

  try {
    const put = pPut(requireGateway('put'), [200, 204])
    const res: AxiosResponse = await put(ReportsProyects, payload)
    const raw = res.data?.data
    const updated = raw ? (raw as Proyect) : null

    await fetchProyects(set, get, true)

    set({ updating: false, successPut: true })
    return updated
  } catch (e) {
    set({ updating: false, successPut: false, error: normalizeApiError(e).message })
    return null
  }
}

