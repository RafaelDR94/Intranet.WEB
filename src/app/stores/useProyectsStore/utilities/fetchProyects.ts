// src/app/stores/proyects/utilities/fetchProyects.ts
import type { Set, Get } from '../types'

import { ReportsProyects } from '@/app/configurations/Axios/urls'
import { ProyectsMap } from '@/app/mappings/proyects/proyects.mapper'
import type { Proyect } from '@/app/mappings/proyects/proyects.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Recupera los proyectos activos del backend y los guarda en el estado.
 *
 * @param set Función `set` de Zustand
 * @param get Función `get` de Zustand
 * @param force Si es `true`, fuerza la recarga aunque existan datos
 */
export const fetchProyects = async (set: Set, get: Get, force = false) => {
  if (get().proyects.length > 0 && !force) return

  set({ loading: true, error: undefined })
  try {
    const getFn = requireGateway('get') // obtiene la función GET
    const res = await pGet(getFn)(`${ReportsProyects}?IsActive=true`)
    const mapped: Proyect[] = ProyectsMap(res.data?.data ?? [])
    set({ proyects: mapped, loading: false })
  } catch (err) {
    const e = normalizeApiError(err)
    set({ error: e.message, loading: false })
  }
}
