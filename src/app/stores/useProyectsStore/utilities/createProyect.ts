// src/app/stores/useProyectsStore/utilities/createProyect.ts
'use client'
import type { AxiosResponse } from 'axios'

import type { Set, Get } from '../types'

import { fetchProyects } from './fetchProyects'

import { ReportsProyects } from '@/app/configurations/Axios/urls'
import { ProyectPostMap } from '@/app/mappings/proyects/proyects.mapper'
import type { Proyect, ProyectPost } from '@/app/mappings/proyects/proyects.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Crea un nuevo proyecto en el backend.
 */
export const createProyect = async (
  set: Set,
  get: Get,
  payload: ProyectPost
): Promise<Proyect | null> => {
  set({ creating: true, error: undefined, successPost: false })

  try {
    const post = pPost(requireGateway('post'), [200, 201])
    const res: AxiosResponse = await post(ReportsProyects, ProyectPostMap(payload))
    const raw = res.data?.data
    const created = raw ? (raw as Proyect) : null

    await fetchProyects(set, get, true)

    set({ creating: false, successPost: true })
    return created
  } catch (e) {
    set({ creating: false, successPost: false, error: normalizeApiError(e).message })
    return null
  }
}

