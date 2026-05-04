'use client'

import { AuthPasskeys } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pDelete } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import type { Get, Set } from '../types'

export const deleteUserPasskey = async (
  set: Set,
  get: Get,
  id: string,
): Promise<boolean> => {
  set({
    deletingUserPasskey: true,
    successDeleteUserPasskey: false,
    error: undefined,
  })

  try {
    const del = pDelete(requireGateway('del'), [200, 204])
    await del(`${AuthPasskeys}/${encodeURIComponent(id)}`)

    const currentPasskeys = get().userPasskeys
    set({
      deletingUserPasskey: false,
      successDeleteUserPasskey: true,
      userPasskeys: currentPasskeys.filter((passkey) => passkey.id !== id),
    })

    return true
  } catch (e) {
    set({
      error: normalizeApiError(e).message,
      deletingUserPasskey: false,
      successDeleteUserPasskey: false,
    })

    return false
  }
}
