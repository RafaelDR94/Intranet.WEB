import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { BillingPettyCashState, Set } from '../types'

import { rejectPettyCashVoucher } from './rejectPettyCashVoucher'

const { putSpy, pPutRecorder, requireGatewayRecorder } = vi.hoisted(() => ({
  putSpy: vi.fn<[string, unknown?], Promise<unknown>>(),
  pPutRecorder: vi.fn(),
  requireGatewayRecorder: vi.fn(),
}))

vi.mock('@/app/utilities/Http/requireGateway', () => ({
  requireGateway: (method: string) => {
    requireGatewayRecorder(method)
    return vi.fn()
  },
}))

vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({
  pPut: (gatewayFn: unknown, ok: unknown) => {
    pPutRecorder(gatewayFn, ok)
    return putSpy
  },
}))

describe('rejectPettyCashVoucher', () => {
  beforeEach(() => {
    putSpy.mockReset()
    putSpy.mockResolvedValue({})
    pPutRecorder.mockReset()
    requireGatewayRecorder.mockReset()
  })

  it('rechaza vale enviando comentario en la URL', async () => {
    const state: Partial<BillingPettyCashState> = {
      rejecting: false,
      successRejectVoucher: false,
    }
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === 'function'
          ? partial(state as BillingPettyCashState)
          : partial,
      )

    const res = await rejectPettyCashVoucher(set, '1', ' Falta info ')

    expect(res).toBe(true)
    expect(state.rejecting).toBe(false)
    expect(state.successRejectVoucher).toBe(true)
    expect(requireGatewayRecorder).toHaveBeenCalledWith('put')
    expect(pPutRecorder).toHaveBeenCalled()
    expect(putSpy).toHaveBeenCalledWith(
      '/Billings/PettyCashVoucher/Reject/1?comment=Falta%20info',
      undefined,
    )
  })
})

