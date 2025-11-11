'use client'

import type { User } from '@/app/context/AuthContext/types'
import { Users } from '@/app/configurations/Axios/urls'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

const normalizeSignature = (raw: unknown): string | null => {
  if (typeof raw === 'string') {
    return raw
  }

  if (raw == null) {
    return ''
  }

  return null
}

const tryFetchSignature = async (id: string | undefined | null): Promise<string | null> => {
  if (!id) {
    return null
  }

  try {
    const getFn = requireGateway('get')
    const get = pGet(getFn)
    const response = await get(`${Users}/ById/${id}`)
    const payload = response.data?.data ?? response.data ?? null

    if (payload && typeof payload === 'object' && 'signature' in payload) {
      const value = (payload as Record<string, unknown>).signature
      const normalized = normalizeSignature(value)
      if (normalized !== null) {
        return normalized
      }
    }

    return normalizeSignature(payload)
  } catch {
    return null
  }
}

export type SignatureIdentity = Pick<User, 'idEmployee' | 'idUser'>

export const fetchUserSignature = async (
  identity: SignatureIdentity
): Promise<string | null> => {
  const primary = await tryFetchSignature(identity.idEmployee)
  if (primary !== null) {
    return primary
  }

  return await tryFetchSignature(identity.idUser)
}
