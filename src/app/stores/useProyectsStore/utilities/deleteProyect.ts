// src/app/stores/useProyectsStore/utilities/deleteProyect.ts
'use client'
import type { AxiosResponse } from 'axios'

import type { Set, Get } from '../types'

import { ReportsProyectsById } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pDelete } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Elimina un proyecto por ID.
 */
export const deleteProyect = async (
  set: Set,
  _get: Get,
  id: string
): Promise<boolean> => {
  set({ removing: true, error: undefined, successDelete: false })

  try {
    const del = pDelete(requireGateway('del'), [200, 204])
    const _res: AxiosResponse = await del(`${ReportsProyectsById}/${id}`)

    set((s) => ({
      proyects: s.proyects.filter((p) => p.id !== id),
      removing: false,
      successDelete: true,
    }))
    return true
  } catch (e) {
    set({ removing: false, successDelete: false, error: normalizeApiError(e).message })
    return false
  }
}

