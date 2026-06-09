import { describe, expect, it, vi } from 'vitest'

import type { Get, Set, DocumentsHistoryState } from '../types'
import type { DocumentsHistoryQuery } from '@/app/shared/documentshistory/types'

const baseQuery: DocumentsHistoryQuery = {
  page: 1,
  pageSize: 12,
  searchText: '',
  startDate: new Date(2026, 5, 1, 8, 0, 0),
  endDate: new Date(2026, 5, 15, 18, 0, 0),
  filter: '0',
  scope: 'accounting',
}

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

describe('fetchDocumentsHistory util', () => {
  it('marks integration as pending when the endpoint is not configured', async () => {
    vi.resetModules()
    vi.doMock('@/app/configurations/Axios/urls', () => ({
      BillingDocumentsHistory: undefined,
    }))
    vi.doMock('@/app/utilities/Http/requireGateway', () => ({
      requireGateway: () => vi.fn(),
    }))
    vi.doMock('@/app/utilities/Http/promisifyIntranet', () => ({
      pGet: () => vi.fn(),
    }))

    const { fetchDocumentsHistory } = await import('./fetchDocumentsHistory')

    const state = createState()
    const set = createSet(state)
    const get = createGet(state)

    const result = await fetchDocumentsHistory(set, get, baseQuery)

    expect(result).toEqual({
      items: [],
      totalRows: 0,
      page: 1,
      pageSize: 12,
    })
    expect(state.integrationPendingList).toBe(true)
    expect(state.loadingList).toBe(false)
  })

  it('keeps only the latest list request result when responses arrive out of order', async () => {
    vi.resetModules()

    const getReqMock = vi.fn()

    vi.doMock('@/app/configurations/Axios/urls', () => ({
      BillingDocumentsHistory: '/Billings/BillingDocumentPaginated',
    }))
    vi.doMock('@/app/utilities/Http/requireGateway', () => ({
      requireGateway: () => vi.fn(),
    }))
    vi.doMock('@/app/utilities/Http/promisifyIntranet', () => ({
      pGet: () => getReqMock,
    }))

    const { fetchDocumentsHistory } = await import('./fetchDocumentsHistory')

    let resolveFirst: ((value: any) => void) | undefined
    let resolveSecond: ((value: any) => void) | undefined

    getReqMock
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveFirst = resolve
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveSecond = resolve
          }),
      )

    const state = createState()
    const set = createSet(state)
    const get = createGet(state)

    const firstPromise = fetchDocumentsHistory(set, get, baseQuery)
    const secondPromise = fetchDocumentsHistory(set, get, {
      ...baseQuery,
      page: 2,
    })

    resolveSecond?.({
      data: {
        data: {
          items: [{ billingdocument_id: 'doc-2', uuid: 'UUID-2' }],
          totalRows: 20,
          page: 2,
          pageSize: 12,
        },
      },
    })
    await secondPromise

    resolveFirst?.({
      data: {
        data: {
          items: [{ billingdocument_id: 'doc-1', uuid: 'UUID-1' }],
          totalRows: 20,
          page: 1,
          pageSize: 12,
        },
      },
    })
    await firstPromise

    expect(state.currentPage).toBe(2)
    expect(state.list?.[0]?.id).toBe('doc-2')
    expect(state.error).toBeUndefined()
    expect(getReqMock.mock.calls[0]?.[0]).toContain('StartDate=2026-06-01T00%3A00%3A00')
    expect(getReqMock.mock.calls[0]?.[0]).toContain('EndDate=2026-06-15T23%3A59%3A59')
    expect(getReqMock.mock.calls[0]?.[0]).toContain('PageNumber=1')
    expect(getReqMock.mock.calls[0]?.[0]).toContain('PageSize=12')
    expect(getReqMock.mock.calls[0]?.[0]).toContain('Text=')
    expect(getReqMock.mock.calls[0]?.[0]).toContain('Filter=0')
  })

  it('omits date params when no range is selected', async () => {
    vi.resetModules()

    const getReqMock = vi.fn(async () => ({
      data: {
        data: {
          items: [],
          totalRows: 0,
          page: 1,
          pageSize: 12,
        },
      },
    }))

    vi.doMock('@/app/configurations/Axios/urls', () => ({
      BillingDocumentsHistory: '/Billings/BillingDocumentPaginated',
    }))
    vi.doMock('@/app/utilities/Http/requireGateway', () => ({
      requireGateway: () => vi.fn(),
    }))
    vi.doMock('@/app/utilities/Http/promisifyIntranet', () => ({
      pGet: () => getReqMock,
    }))

    const { fetchDocumentsHistory } = await import('./fetchDocumentsHistory')

    const state = createState()
    const set = createSet(state)
    const get = createGet(state)

    await fetchDocumentsHistory(set, get, {
      ...baseQuery,
      startDate: null,
      endDate: null,
    })

    expect(getReqMock.mock.calls[0]?.[0]).not.toContain('StartDate=')
    expect(getReqMock.mock.calls[0]?.[0]).not.toContain('EndDate=')
  })
})
