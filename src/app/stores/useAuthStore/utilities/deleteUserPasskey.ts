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
    const currentPasskeys = get().userPasskeys
    const currentUser = get().user
    const currentMfa = get().userMfaById
    const passkeyMethodEnabled = Boolean(
      currentMfa?.methods.find((method) => method.method === 'Passkey')?.isEnabled,
    )

    if (currentPasskeys.length === 1 && passkeyMethodEnabled && currentUser?.idUser) {
      await get().changeMfaMethodStatus({
        idUser: currentUser.idUser,
        method: 'Passkey',
        isEnabled: false,
        idPasskey: id,
      })
    }

    const del = pDelete(requireGateway('del'), [200, 204])
    await del(`${AuthPasskeys}/${encodeURIComponent(id)}`)

    const remainingPasskeys = currentPasskeys.filter((passkey) => passkey.id !== id)
    set({
      deletingUserPasskey: false,
      successDeleteUserPasskey: true,
      userPasskeys: remainingPasskeys,
      userMfaById:
        remainingPasskeys.length === 0 && currentMfa
          ? {
              ...currentMfa,
              methods: currentMfa.methods.map((method) =>
                method.method === 'Passkey'
                  ? { ...method, isEnabled: false }
                  : method,
              ),
            }
          : get().userMfaById,
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
