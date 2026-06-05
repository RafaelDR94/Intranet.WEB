import { describe, expect, it, vi } from 'vitest'

import type { Get, Set, DocumentsHistoryState } from '../types'

const createState = (): Partial<DocumentsHistoryState> => ({
  list: [],
  detailById: {},
  totalRows: 0,
  currentPage: 1,
  pageSize: 12,
  query: null,
  loadingList: false,
  loadingDetail: false,
  integrationPendingList: false,
  integrationPendingDetail: false,
  error: undefined,
})

const createSet = (state: Partial<DocumentsHistoryState>): Set => (partial) =>
  Object.assign(
    state,
    typeof partial === 'function'
      ? partial(state as DocumentsHistoryState)
      : partial,
  )

const createGet = (state: Partial<DocumentsHistoryState>): Get => () =>
  state as DocumentsHistoryState

describe('fetchDocumentHistoryDetail util', () => {
  it('marks integration as pending when the detail endpoint is not configured', async () => {
    vi.resetModules()
    vi.doMock('@/app/configurations/Axios/urls', () => ({
      BillingDocumentsHistoryById: undefined,
    }))
    vi.doMock('@/app/utilities/Http/requireGateway', () => ({
      requireGateway: () => vi.fn(),
    }))
    vi.doMock('@/app/utilities/Http/promisifyIntranet', () => ({
      pGet: () => vi.fn(),
    }))

    const { fetchDocumentHistoryDetail } = await import('./fetchDocumentHistoryDetail')

    const state = createState()
    const set = createSet(state)
    const get = createGet(state)

    const result = await fetchDocumentHistoryDetail(
      'doc-1',
      'accounting',
      set,
      get,
    )

    expect(result).toBeNull()
    expect(state.integrationPendingDetail).toBe(true)
    expect(state.loadingDetail).toBe(false)
  })

  it('fetches detail using BillingDocumentById semantics without adding scope to the url', async () => {
    vi.resetModules()

    const getReqMock = vi.fn().mockResolvedValue({
      data: {
        data: {
          billingdocument_id: 'doc-1',
          uuid: 'UUID-1',
          status: 'Validado',
          xml: 'https://example.com/file.xml',
          pdf: 'https://example.com/file.pdf',
          image: 'https://example.com/file.jpg',
          rfc_emisor: 'AAA010101AAA',
          rfc_receptor: 'BBB010101BBB',
          subtotal: 100,
          iva: 16,
          total: 116,
          conceptos: [],
        },
      },
    })

    vi.doMock('@/app/configurations/Axios/urls', () => ({
      BillingDocumentsHistoryById: '/Billings/BillingDocument/ById',
    }))
    vi.doMock('@/app/utilities/Http/requireGateway', () => ({
      requireGateway: () => vi.fn(),
    }))
    vi.doMock('@/app/utilities/Http/promisifyIntranet', () => ({
      pGet: () => getReqMock,
    }))

    const { fetchDocumentHistoryDetail } = await import('./fetchDocumentHistoryDetail')

    const state = createState()
    const set = createSet(state)
    const get = createGet(state)

    const result = await fetchDocumentHistoryDetail(
      'doc-1',
      'operations',
      set,
      get,
    )

    expect(getReqMock).toHaveBeenCalledWith('/Billings/BillingDocument/ById/doc-1')
    expect(getReqMock.mock.calls[0]?.[0]).not.toContain('scope=')
    expect(result?.id).toBe('doc-1')
    expect(state.detailById?.['doc-1']?.uuid).toBe('UUID-1')
    expect(state.integrationPendingDetail).toBe(false)
    expect(state.loadingDetail).toBe(false)
    expect(state.error).toBeUndefined()
  })
})
