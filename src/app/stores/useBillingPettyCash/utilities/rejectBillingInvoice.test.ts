// src/app/stores/useBillingPettyCash/utilities/rejectBillingInvoice.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---------- Objetos hoisted (clave para evitar "Cannot access ... before initialization") ----------
const hoisted = vi.hoisted(() => {
  const mockPutFn = vi.fn()
  const mockPPut = vi.fn(() => mockPutFn)
  const BASE_URL = 'https://api.example.com/billing/invoice/reject'
  const mockNormalize = vi.fn((e: any) => ({ message: e?.message ?? String(e) }))
  const mockMap = vi.fn()
  return { mockPutFn, mockPPut, BASE_URL, mockNormalize, mockMap }
})

// ---------- Mocks (solo referencian a "hoisted") ----------
vi.mock('@/app/utilities/Http/requireGateway', () => ({
  requireGateway: vi.fn(() => vi.fn()),
}))

vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({
  pPut: hoisted.mockPPut,
}))

vi.mock('@/app/configurations/Axios/urls', () => ({
  BillingInvoiceReject: hoisted.BASE_URL,
}))

// Mapper y types
vi.mock('@/app/mappings/billingPettyCash/billingPettyCash.mapper', () => ({
  PutBillingsInvoiceRejectMap: hoisted.mockMap,
}))
vi.mock('@/app/mappings/billingPettyCash/BillingPettyCash.types', () => ({}))

vi.mock('@/app/utilities/Http/normalizeApiError', () => ({
  normalizeApiError: hoisted.mockNormalize,
}))

// ---- Import de la función bajo prueba (después de declarar los mocks) ----
import { rejectBillingInvoice } from './rejectBillingInvoice'

// Utilidad "set/get" de store
const makeSetGet = () => {
  const state: Record<string, unknown> = {}
  const set = vi.fn((patch: Record<string, unknown>) => Object.assign(state, patch))
  const get = vi.fn(() => state)
  return { set, get, state }
}

describe('rejectBillingInvoice', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    hoisted.mockPutFn.mockResolvedValue(undefined)
  })

  it('marca estado inicial y éxito al finalizar', async () => {
    const { set, get, state } = makeSetGet()
    hoisted.mockMap.mockReturnValue({ id: '123', comments: 'ok' })

    const ok = await rejectBillingInvoice(set as any, get as any, {} as any)

    expect(set).toHaveBeenCalledWith({ rejecting: true, error: undefined, successRejectInvoice: false })
    expect(ok).toBe(true)
    expect(state.rejecting).toBe(false)
    expect(state.successRejectInvoice).toBe(true)
    expect(state.error).toBeUndefined()
  })

  it('incluye comment en la URL cuando hay texto tras trim', async () => {
    const { set, get } = makeSetGet()
    hoisted.mockMap.mockReturnValue({ id: '999', comments: '   necesita aclaración  ' })

    await rejectBillingInvoice(set as any, get as any, {} as any)

    expect(hoisted.mockPPut).toHaveBeenCalledTimes(1)
    expect(hoisted.mockPutFn).toHaveBeenCalledTimes(1)

    const [calledUrl, body] = hoisted.mockPutFn.mock.calls[0]
    expect(body).toEqual({})

    const url = new URL(calledUrl)
    expect(url.origin + url.pathname).toBe(hoisted.BASE_URL)
    expect(url.searchParams.get('id')).toBe('999')
    expect(url.searchParams.get('comment')).toBe('necesita aclaración')
  })

  it('si comment queda vacío tras trim, NO lo agrega a la URL', async () => {
    const { set, get } = makeSetGet()
    hoisted.mockMap.mockReturnValue({ id: '42', comments: '   ' })

    await rejectBillingInvoice(set as any, get as any, {} as any)

    const [calledUrl] = hoisted.mockPutFn.mock.calls[0]
    const url = new URL(calledUrl)
    expect(url.origin + url.pathname).toBe(hoisted.BASE_URL)
    expect(url.searchParams.get('id')).toBe('42')
    expect(url.searchParams.has('comment')).toBe(false)
  })

  it('maneja error: setea error normalizado y retorna false', async () => {
    const { set, get, state } = makeSetGet()
    const boom = new Error('falló la API')
    hoisted.mockMap.mockReturnValue({ id: '77', comments: 'algo' })
    hoisted.mockPutFn.mockRejectedValueOnce(boom)
    hoisted.mockNormalize.mockReturnValueOnce({ message: 'Boom normalizado' })

    const ok = await rejectBillingInvoice(set as any, get as any, {} as any)

    expect(ok).toBe(false)
    expect(state.rejecting).toBe(false)
    expect(state.successRejectInvoice).toBe(false)
    expect(state.error).toBe('Boom normalizado')
  })
})
