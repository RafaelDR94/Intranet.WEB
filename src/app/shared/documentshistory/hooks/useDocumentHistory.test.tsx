import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDocumentHistory } from './useDocumentHistory'

const fetchDocumentsHistorySpy = vi.hoisted(() => vi.fn())
const fetchDocumentHistoryDetailSpy = vi.hoisted(() => vi.fn())
const resetSpy = vi.hoisted(() => vi.fn())
const documentsHistoryStoreTestUtils = vi.hoisted(() => ({
  resetMockState: () => undefined,
}))

vi.mock('@/app/stores/useDocumentsHistoryStore/useDocumentsHistoryStore', async () => {
  const ReactModule = await import('react')

  type MockState = {
    list: any[]
    detailById: Record<string, any>
    totalRows: number
    currentPage: number
    pageSize: number
    query: any
    loadingList: boolean
    loadingDetail: boolean
    integrationPendingList: boolean
    integrationPendingDetail: boolean
    error?: string
    fetchDocumentsHistory: (query: any, force?: boolean) => Promise<any>
    fetchDocumentHistoryDetail: (
      id: string,
      scope: string,
      force?: boolean,
    ) => Promise<any>
    reset: () => void
  }

  const listeners = new Set<() => void>()
  const notify = () => listeners.forEach((listener) => listener())

  let storeState: MockState
  const actions = {
    fetchDocumentsHistory: async (query: any, force = false) => {
      fetchDocumentsHistorySpy(query, force)
      storeState = {
        ...storeState,
        query,
        currentPage: query.page,
        pageSize: query.pageSize,
        loadingList: false,
      }
      notify()
      return {
        items: [],
        totalRows: 0,
        page: query.page,
        pageSize: query.pageSize,
      }
    },
    fetchDocumentHistoryDetail: async (id: string, scope: string, force = false) => {
      fetchDocumentHistoryDetailSpy(id, scope, force)
      const detail = {
        id,
        employeeName: 'Maria Gonzalez',
        companyName: 'DRS',
        projectName: 'Atlas',
        requisitionCode: 'REQ-001',
        uuid: 'UUID-001',
        status: 'Validado',
        certificationDate: '2026-06-01T10:00:00Z',
        rfcEmisor: 'AAA010101AAA',
        rfcReceptor: 'BBB010101BBB',
        subtotal: 100,
        iva: 16,
        total: 116,
        comments: '',
        userComments: '',
        concepts: [],
      }

      storeState = {
        ...storeState,
        detailById: {
          ...storeState.detailById,
          [id]: detail,
        },
        loadingDetail: false,
      }
      notify()
      return detail
    },
    reset: () => {
      resetSpy()
      storeState = buildState()
      notify()
    },
  }

  const buildState = (): MockState => ({
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
    fetchDocumentsHistory: actions.fetchDocumentsHistory,
    fetchDocumentHistoryDetail: actions.fetchDocumentHistoryDetail,
    reset: actions.reset,
  })

  const resetMockState = () => {
    storeState = buildState()
    notify()
  }

  documentsHistoryStoreTestUtils.resetMockState = resetMockState

  resetMockState()

  const useDocumentsHistoryStore = (selector: any) => {
    const [, forceUpdate] = ReactModule.useReducer((value) => value + 1, 0)

    ReactModule.useEffect(() => {
      const listener = () => forceUpdate()
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    }, [])

    return selector(storeState)
  }

  return {
    useDocumentsHistoryStore,
  }
})

const flushEffects = async () => {
  await act(async () => {})
}

const createTodayRange = () => {
  const now = new Date()
  const startDate = new Date(now)
  const endDate = new Date(now)

  startDate.setHours(0, 0, 0, 0)
  endDate.setHours(23, 59, 59, 999)

  return { startDate, endDate }
}

describe('useDocumentHistory', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 3, 12, 0, 0))
    fetchDocumentsHistorySpy.mockClear()
    fetchDocumentHistoryDetailSpy.mockClear()
    resetSpy.mockClear()
    documentsHistoryStoreTestUtils.resetMockState()
  })

  afterEach(() => {
    vi.useRealTimers()
    documentsHistoryStoreTestUtils.resetMockState()
  })

  it('debounces search changes and resets the page to the first result page', async () => {
    const { result } = renderHook(() => useDocumentHistory('accounting'))

    await flushEffects()
    expect(fetchDocumentsHistorySpy).toHaveBeenCalledTimes(1)

    fetchDocumentsHistorySpy.mockClear()

    act(() => {
      result.current.handlePageChange(3)
    })

    await flushEffects()
    expect(fetchDocumentsHistorySpy).toHaveBeenCalledTimes(1)
    expect(fetchDocumentsHistorySpy.mock.lastCall?.[0]).toEqual(
      expect.objectContaining({ page: 3, scope: 'accounting' }),
    )

    fetchDocumentsHistorySpy.mockClear()
    const { startDate, endDate } = createTodayRange()

    act(() => {
      result.current.handleSearchChange('Atlas', startDate, endDate)
    })

    expect(fetchDocumentsHistorySpy).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(399)
    })
    expect(fetchDocumentsHistorySpy).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1)
    })

    await flushEffects()
    expect(fetchDocumentsHistorySpy).toHaveBeenCalledTimes(1)
    expect(fetchDocumentsHistorySpy.mock.lastCall?.[0]).toEqual(
      expect.objectContaining({
        page: 1,
        searchText: 'Atlas',
        scope: 'accounting',
      }),
    )
  })

  it('resets the page when filters or dates change and fetches detail on demand', async () => {
    const { result } = renderHook(() => useDocumentHistory('operations'))

    await flushEffects()
    expect(fetchDocumentsHistorySpy).toHaveBeenCalledTimes(1)

    fetchDocumentsHistorySpy.mockClear()

    act(() => {
      result.current.handlePageChange(4)
    })

    await flushEffects()
    expect(fetchDocumentsHistorySpy).toHaveBeenCalledTimes(1)

    fetchDocumentsHistorySpy.mockClear()

    act(() => {
      result.current.handleFilterChange('1')
    })

    await flushEffects()
    expect(fetchDocumentsHistorySpy).toHaveBeenCalledTimes(1)
    expect(fetchDocumentsHistorySpy.mock.lastCall?.[0]).toEqual(
      expect.objectContaining({
        page: 1,
        filter: '1',
        scope: 'operations',
      }),
    )

    fetchDocumentsHistorySpy.mockClear()

    const startDate = new Date(2026, 5, 1)
    const endDate = new Date(2026, 5, 15)

    act(() => {
      result.current.handleSearchChange('', startDate, endDate)
    })

    await flushEffects()
    expect(fetchDocumentsHistorySpy).toHaveBeenCalledTimes(1)
    expect(fetchDocumentsHistorySpy.mock.lastCall?.[0]).toEqual(
      expect.objectContaining({
        page: 1,
        startDate,
        endDate,
        scope: 'operations',
      }),
    )

    await act(async () => {
      await result.current.openDetails('doc-1')
    })

    expect(fetchDocumentHistoryDetailSpy).toHaveBeenCalledWith(
      'doc-1',
      'operations',
      false,
    )
  })
})
