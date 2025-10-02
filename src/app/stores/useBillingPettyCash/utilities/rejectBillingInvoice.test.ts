import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { BillingPettyCashState, Get, Set } from '../types'

import { rejectBillingInvoice } from './rejectBillingInvoice'

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

describe('rejectBillingInvoice', () => {
  beforeEach(() => {
    putSpy.mockReset()
    putSpy.mockResolvedValue({ status: 200 })
    pPutRecorder.mockReset()
    requireGatewayRecorder.mockReset()
  })

  it('envía el payload mapeado a la URL correspondiente', async () => {
    const state: Partial<BillingPettyCashState> = {
      rejecting: false,
      successRejectInvoice: false,
    }

    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === 'function'
          ? partial(state as BillingPettyCashState)
          : partial,
      )
    const get: Get = () => state as BillingPettyCashState

    const ok = await rejectBillingInvoice(set, get, { id: 99 as unknown as string, comments: ' Motivo ' })

    expect(ok).toBe(true)
    expect(state.rejecting).toBe(false)
    expect(state.successRejectInvoice).toBe(true)
    expect(requireGatewayRecorder).toHaveBeenCalledWith('put')
    expect(pPutRecorder).toHaveBeenCalled()
    expect(putSpy).toHaveBeenCalledWith('/Billings/Invoice/Reject', {
      id: '99',
      comments: ' Motivo ',
    })
  })

  it('propaga el error y actualiza el estado en fallo', async () => {
    putSpy.mockRejectedValueOnce(new Error('fail'))
    const state: Partial<BillingPettyCashState> = {
      rejecting: false,
      successRejectInvoice: false,
    }
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === 'function'
          ? partial(state as BillingPettyCashState)
          : partial,
      )
    const get: Get = () => state as BillingPettyCashState

    const ok = await rejectBillingInvoice(set, get, { id: '1', comments: 'falla' })

    expect(ok).toBe(false)
    expect(state.rejecting).toBe(false)
    expect(state.successRejectInvoice).toBe(false)
    expect(state.error).toBeDefined()
  })
})
