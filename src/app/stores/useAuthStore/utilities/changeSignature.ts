'use client'
import type { Set, SignaturePayload } from '../types'

import { UsersSignature } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const changeSignature = async (
  set: Set,
  payload: SignaturePayload
): Promise<void> => {
  set({signature:payload?.signature, changingSignature: true, error: undefined, succesChangeSignature: false })
  try {
    const put = pPut(requireGateway('put'))
    await put(UsersSignature, payload);


    set({ succesChangeSignature: true ,error:undefined,changingSignature: false})
  } catch (e) {
    set({ error: normalizeApiError(e).message, changingSignature: false, succesChangeSignature: false })
  }
}
