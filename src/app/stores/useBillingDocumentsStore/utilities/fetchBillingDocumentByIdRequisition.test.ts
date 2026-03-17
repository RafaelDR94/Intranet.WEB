import { describe, it, expect, vi } from 'vitest'

import type { BillingDocumentsState, Set, Get } from '../types'

import { fetchBillingDocumentByIdRequisition } from './fetchBillingDocumentByIdRequisition'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
const getMock = vi.fn()
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pGet: () => getMock }))
vi.mock('@/app/mappings/billingdocuments/billingdocuments.mapper', () => ({ BillingDocumentsMap: (d: unknown[]) => d }))

describe('fetchBillingDocumentByIdRequisition util', () => {
  it('llena billingDocuments y apaga loading', async () => {
    const state: Partial<BillingDocumentsState> = { billingDocuments: [], loading: false, successGet: false, successGetById: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingDocumentsState) : partial)
    const get: Get = () => state as BillingDocumentsState

    getMock.mockResolvedValueOnce({ data: { data: [{ billingdocument_id: '1' }] } })
    const res = await fetchBillingDocumentByIdRequisition('1', set, get)

    expect(res?.billingdocument_id).toBe('1')
    expect(state.billingDocuments).toHaveLength(1)
    expect(state.loading).toBe(false)
    expect(state.successGet).toBe(true)
    expect(state.successGetById).toBe(true)
  })

  it('soporta shape nuevo y guarda montos', async () => {
    const state: Partial<BillingDocumentsState> = {
      billingDocuments: [],
      loading: false,
      successGet: false,
      successGetById: false,
      montoComprobado: 0,
      montoAFavorEmpresa: 0,
      montoAFavorColaborador: 0,
      hasPerDiemTotals: false,
    }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingDocumentsState) : partial)
    const get: Get = () => state as BillingDocumentsState

    getMock.mockResolvedValueOnce({
      data: {
        data: {
          data: {
            billingDocuments: [{ billingdocument_id: '1' }],
            montoComprobado: 561,
            montoAFavorEmpresa: 0,
            montoAFavorColaborador: 551,
          },
        },
      },
    })

    const res = await fetchBillingDocumentByIdRequisition('1', set, get, true)

    expect(res?.billingdocument_id).toBe('1')
    expect(state.billingDocuments).toHaveLength(1)
    expect(state.montoComprobado).toBe(561)
    expect(state.montoAFavorEmpresa).toBe(0)
    expect(state.montoAFavorColaborador).toBe(551)
    expect(state.hasPerDiemTotals).toBe(true)
  })
})
