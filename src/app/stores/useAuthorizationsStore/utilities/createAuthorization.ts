import type { AxiosResponse } from 'axios'

import type { PostAuthorization } from '@/app/mappings/authorizations/authorizations.types'
import { mapAuthorization, mapPostAuthorization } from '@/app/mappings/authorizations/authorizations.mapper'

import type { GetAuthorizationsState, SetAuthorizationsState } from '../types'

import { Authorizations } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

const normalizeText = (value: string) =>
  value
    .toLocaleLowerCase('es-MX')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const ensureKindId = (payload: PostAuthorization, types: Array<{ id: string; name: string }>) => {
  const rawKind = String(payload.kind ?? '')
  const isUuid = /^[0-9a-fA-F-]{36}$/.test(rawKind)
  if (isUuid) return rawKind

  const normalized = normalizeText(rawKind.trim())
  const match = types.find((type) => normalizeText(type.name) === normalized)
  return match?.id
}

/**
 * Crea una autorización en el backend y actualiza el store.
 * @param set Zustand setter
 * @param get Zustand getter
 * @param payload Información base de la autorización
 */
export const createAuthorization = async (
  set: SetAuthorizationsState,
  get: GetAuthorizationsState,
  payload: PostAuthorization,
) => {
  set({ creating: true, error: undefined, successCreate: false })

  try {
    if (!get().authorizationTypes.length) {
      await get().getAuthorizationTypes?.(false)
    }

    const resolvedKind = ensureKindId(payload, get().authorizationTypes)
    if (!resolvedKind) {
      throw new Error('No se encontró el tipo de autorización.')
    }

    const post = pPost(requireGateway('post'), [200, 201])
    const body = mapPostAuthorization({ ...payload, kind: resolvedKind })
    const res: AxiosResponse = await post(Authorizations, body)
    const raw = res.data?.data ?? res.data
    const created = raw ? mapAuthorization(raw) : null

    const next = created ? [created, ...get().authorizations] : get().authorizations
    set({ authorizations: next, creating: false, successCreate: true })

    return created
  } catch (error) {
    const err = normalizeApiError(error)
    set({ creating: false, successCreate: false, error: err.message })

    return null
  }
}
