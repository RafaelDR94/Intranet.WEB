// src/app/stores/useBillingPettyCash/utilities/rejectPettyCashVoucher.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---------- Hoisted shared objects (¡clave para evitar el error!) ----------
const hoisted = vi.hoisted(() => {
  const mockPutFn = vi.fn()
  const mockPPut = vi.fn(() => mockPutFn)
  const BASE_URL = 'https://api.example.com/petty-cash/voucher/reject'
  const mockNormalize = vi.fn((e: any) => ({ message: e?.message ?? String(e) }))
  return { mockPutFn, mockPPut, BASE_URL, mockNormalize }
})

// ---------- Mocks (no usan variables “normales”, sólo hoisted) ----------
vi.mock('@/app/utilities/Http/requireGateway', () => ({
  requireGateway: vi.fn(() => vi.fn()),
}))

vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({
  pPut: hoisted.mockPPut,
}))

// Mock de ambas rutas posibles del módulo de URLs (alias y relativa)
vi.mock('@/app/configurations/Axios/urls', () => ({
  BillingPettyCashVoucherReject: hoisted.BASE_URL,
}))
vi.mock('../../../configurations/Axios/urls', () => ({
  BillingPettyCashVoucherReject: hoisted.BASE_URL,
}))

vi.mock('@/app/utilities/Http/normalizeApiError', () => ({
  normalizeApiError: hoisted.mockNormalize,
}))

// ---- Import de la función bajo prueba (después de declarar los mocks) ----
import { rejectPettyCashVoucher } from './rejectPettyCashVoucher'

// Utilidad para simular el "set" del store
const makeSet = () => {
  const state: Record<string, unknown> = {}
  const set = vi.fn((patch: Record<string, unknown>) => Object.assign(state, patch))
  return { set, state }
}

describe('rejectPettyCashVoucher', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    hoisted.mockPutFn.mockResolvedValue(undefined)
  })

  it('marca estado inicial y termina en éxito', async () => {
    const { set, state } = makeSet()

    const ok = await rejectPettyCashVoucher(set as any, 'ABC123')

    expect(set).toHaveBeenCalledWith({ rejecting: true, error: undefined, successRejectVoucher: false })
    expect(ok).toBe(true)
    expect(state.rejecting).toBe(false)
    expect(state.successRejectVoucher).toBe(true)
    expect(state.error).toBeUndefined()
  })

  it('sin comentario, no agrega comment a la query', async () => {
    const { set } = makeSet()

    await rejectPettyCashVoucher(set as any, 'ID-1') // comments = ''

    expect(hoisted.mockPutFn).toHaveBeenCalledTimes(1)
    const [calledUrl, body] = hoisted.mockPutFn.mock.calls[0]
    expect(body).toBeUndefined()

    const url = new URL(calledUrl)
    expect(url.origin + url.pathname).toBe(hoisted.BASE_URL)
    expect(url.searchParams.get('id')).toBe('ID-1')
    expect(url.searchParams.has('comment')).toBe(false)
  })

  it('incluye comment cuando hay texto tras trim', async () => {
    const { set } = makeSet()

    await rejectPettyCashVoucher(set as any, 'ID-2', '   necesita aclaración   ')

    const [calledUrl] = hoisted.mockPutFn.mock.calls[0]
    const url = new URL(calledUrl)
    expect(url.origin + url.pathname).toBe(hoisted.BASE_URL)
    expect(url.searchParams.get('id')).toBe('ID-2')
    expect(url.searchParams.get('comment')).toBe('necesita aclaración')
  })

  it('codifica correctamente caracteres especiales en comment', async () => {
    const { set } = makeSet()
    const comment = 'monto > límite & revisar #123'

    await rejectPettyCashVoucher(set as any, 'ID-3', comment)

    const [calledUrl] = hoisted.mockPutFn.mock.calls[0]
    expect(calledUrl).toContain(`${hoisted.BASE_URL}?id=ID-3&comment=`)
    expect(calledUrl).toContain(encodeURIComponent(comment))
  })

  it('en error, setea error normalizado y retorna false', async () => {
    const { set, state } = makeSet()
    const boom = new Error('falló la API')
    hoisted.mockPutFn.mockRejectedValueOnce(boom)
    hoisted.mockNormalize.mockReturnValueOnce({ message: 'Boom normalizado' })

    const ok = await rejectPettyCashVoucher(set as any, 'ID-ERR', 'algo')

    expect(ok).toBe(false)
    expect(state.rejecting).toBe(false)
    expect(state.successRejectVoucher).toBe(false)
    expect(state.error).toBe('Boom normalizado')
  })
})
