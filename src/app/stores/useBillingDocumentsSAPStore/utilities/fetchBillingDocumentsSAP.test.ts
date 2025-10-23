import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AxiosResponse } from 'axios'

import { fetchBillingDocumentsSAP } from './fetchBillingDocumentsSAP'
import { BillingsSAPPendingDocuments } from '@/app/configurations/Axios/urls'
import * as requireGatewayModule from '@/app/utilities/Http/requireGateway'
import * as promisifyModule from '@/app/utilities/Http/promisifyIntranet'
import * as mapperModule from '@/app/mappings/billingdocuments/billingdocuments.mapper'
import * as errorNormalizer from '@/app/utilities/Http/normalizeApiError'

// Setup mocks
const mockSet = vi.fn()
const mockGet = vi.fn()

vi.mock('@/app/utilities/Http/requireGateway')
vi.mock('@/app/utilities/Http/promisifyIntranet')
vi.mock('@/app/utilities/Http/normalizeApiError')
vi.mock('@/app/mappings/billingdocuments/billingdocuments.mapper')

describe('fetchBillingDocumentsSAP', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not fetch if cached data exists and force is false', async () => {
    mockGet.mockReturnValue({ billingDocuments: [{ id: 1 }] })

    await fetchBillingDocumentsSAP(mockSet, mockGet, false)

    expect(mockSet).not.toHaveBeenCalledWith(expect.objectContaining({ loading: true }))
  })

  it('should fetch and set billing documents on success', async () => {
    const mockData = [{ docId: '123' }]
    const mockResponse: AxiosResponse = {
      data: { data: mockData },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    }

    const mockMappedDocs = [{ id: 'mapped-123' }]

    mockGet.mockReturnValue({ billingDocuments: [] })

    vi.spyOn(requireGatewayModule, 'requireGateway').mockReturnValue(() => Promise.resolve({}))
    vi.spyOn(promisifyModule, 'pGet').mockImplementation(() => vi.fn().mockResolvedValue(mockResponse))
    vi.spyOn(mapperModule, 'BillingDocumentFullMap').mockImplementation((doc: any) => ({ id: `mapped-${doc.docId}` }))

    await fetchBillingDocumentsSAP(mockSet, mockGet, false)

    expect(mockSet).toHaveBeenCalledWith({ loading: true, error: undefined, successGet: false })
    expect(mockSet).toHaveBeenCalledWith({
      billingDocuments: mockMappedDocs,
      loading: false,
      successGet: true,
    })
  })

  it('should handle errors and set normalized error message', async () => {
    const mockError = new Error('Network error')
    const normalizedError = { message: 'Something went wrong' }

    mockGet.mockReturnValue({ billingDocuments: [] })

    vi.spyOn(requireGatewayModule, 'requireGateway').mockReturnValue(() => Promise.resolve({}))
    vi.spyOn(promisifyModule, 'pGet').mockImplementation(() => vi.fn().mockRejectedValue(mockError))
    vi.spyOn(errorNormalizer, 'normalizeApiError').mockReturnValue(normalizedError)

    await fetchBillingDocumentsSAP(mockSet, mockGet, false)

    expect(mockSet).toHaveBeenCalledWith({ loading: true, error: undefined, successGet: false })
    expect(mockSet).toHaveBeenCalledWith({ error: normalizedError.message, loading: false, successGet: false })
  })
})
