'use client'

import type { Get, Set } from '../types'

import { ReportsProyects } from '@/app/configurations/Axios/urls'
import { ProyectMap } from '@/app/mappings/proyects/proyects.mapper'
import type { Proyect } from '@/app/mappings/proyects/proyects.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const fetchProyectById = async (
  set: Set,
  _get: Get,
  id: string,
): Promise<Proyect | null> => {
  if (!id.trim()) {
    set({ currentProyect: null })
    return null
  }

  set({ loading: true, error: undefined })

  try {
    const getFn = requireGateway('get')
    const res = await pGet(getFn)(`${ReportsProyects}/${encodeURIComponent(id)}`)
    const raw = res.data?.data ?? res.data
    const proyect = raw ? ProyectMap(raw) : null

    set({ currentProyect: proyect, loading: false })
    return proyect
  } catch (err) {
    const e = normalizeApiError(err)
    set({ currentProyect: null, error: e.message, loading: false })
    return null
  }
}
