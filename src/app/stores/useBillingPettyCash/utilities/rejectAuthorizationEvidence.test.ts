// src/app/stores/useBillingPettyCash/utilities/rejectAuthorizationEvidence.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

const hoisted = vi.hoisted(() => {
  const mockPutFn = vi.fn()
  const mockPPut = vi.fn(() => mockPutFn)
  const BASE_URL =
    'https://api.example.com/Billings/PettyCashVoucher/RejectAuthorizationEvidence'
  const mockNormalize = vi.fn((error: any) => ({ message: error?.message ?? String(error) }))
  return { mockPutFn, mockPPut, BASE_URL, mockNormalize }
})

vi.mock('@/app/utilities/Http/requireGateway', () => ({
  requireGateway: vi.fn(() => vi.fn()),
}))

vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({
  pPut: hoisted.mockPPut,
}))

vi.mock('@/app/utilities/Http/normalizeApiError', () => ({
  normalizeApiError: hoisted.mockNormalize,
}))

vi.mock('@/app/configurations/Axios/urls', () => ({
  BillingPettyCashVoucherRejectAuthorizationEvidence: hoisted.BASE_URL,
}))
vi.mock('../../../configurations/Axios/urls', () => ({
  BillingPettyCashVoucherRejectAuthorizationEvidence: hoisted.BASE_URL,
}))

import { rejectAuthorizationEvidence } from './rejectAuthorizationEvidence'

const makeSet = () => {
  const state: Record<string, unknown> = {}
  const set = vi.fn((patch: Record<string, unknown>) => Object.assign(state, patch))
  return { set, state }
}

describe('rejectAuthorizationEvidence', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    hoisted.mockPutFn.mockResolvedValue(undefined)
  })

  it('rechaza la evidencia con éxito', async () => {
    const { set, state } = makeSet()

    const ok = await rejectAuthorizationEvidence(set as any, {
      id: 'voucher-1',
      comment: 'Comentario válido',
    })

    expect(set).toHaveBeenCalledWith({
      rejecting: true,
      error: undefined,
      successRejectAuthorizationEvidence: false,
    })
    expect(ok).toBe(true)
    expect(state.rejecting).toBe(false)
    expect(state.successRejectAuthorizationEvidence).toBe(true)
  })

  it('normaliza id y comentario antes de invocar la API', async () => {
    const { set } = makeSet()

    await rejectAuthorizationEvidence(set as any, {
      id: '   VCH-2   ',
      comment: '   Comentario   ',
    })

    const [urlCalled] = hoisted.mockPutFn.mock.calls[0]
    const url = new URL(urlCalled)

    expect(url.origin + url.pathname).toBe(hoisted.BASE_URL)
    expect(url.searchParams.get('id')).toBe('VCH-2')
    expect(url.searchParams.get('comment')).toBe('Comentario')
  })

  it('devuelve false y setea error si falta comentario', async () => {
    const { set, state } = makeSet()

    const ok = await rejectAuthorizationEvidence(set as any, {
      id: 'voucher-3',
      comment: '   ',
    })

    expect(ok).toBe(false)
    expect(state.successRejectAuthorizationEvidence).toBe(false)
    expect(state.error).toBe('Agrega un comentario para rechazar la evidencia de autorización.')
    expect(hoisted.mockPutFn).not.toHaveBeenCalled()
  })

  it('propaga el error normalizado cuando la API falla', async () => {
    const { set, state } = makeSet()
    const boom = new Error('Falla API')

    hoisted.mockPutFn.mockRejectedValueOnce(boom)
    hoisted.mockNormalize.mockReturnValueOnce({ message: 'Mensaje normalizado' })

    const ok = await rejectAuthorizationEvidence(set as any, {
      id: 'voucher-4',
      comment: 'Comentario',
    })

    expect(ok).toBe(false)
    expect(state.rejecting).toBe(false)
    expect(state.successRejectAuthorizationEvidence).toBe(false)
    expect(state.error).toBe('Mensaje normalizado')
  })
})
