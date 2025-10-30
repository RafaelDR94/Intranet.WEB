import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AxiosResponse } from 'axios'

import { sendToSapBillingDocument } from './sendToSapBillingDocument'

import * as gatewayModule from '@/app/utilities/Http/requireGateway'
import * as promisifyModule from '@/app/utilities/Http/promisifyIntranet'
import * as errorNormalizer from '@/app/utilities/Http/normalizeApiError'
import * as fetchBilling from './fetchBillingDocuments'
import * as fetchSat from './fetchSatBillingDocument'

import { BillingDocumentsSendToSAP } from '@/app/configurations/Axios/urls'
import type { BillingDocuments } from '@/app/mappings/billingdocuments/billingdocuments.types'

// Mocks
const mockSet = vi.fn()
const mockGet = vi.fn()
const sampleIds = ['doc123', 'doc456']
const fakeDocs: BillingDocuments = [{ id: 'doc123' }] as any

vi.mock('@/app/utilities/Http/requireGateway')
vi.mock('@/app/utilities/Http/promisifyIntranet')
vi.mock('@/app/utilities/Http/normalizeApiError')
vi.mock('./fetchBillingDocuments')
vi.mock('./fetchSatBillingDocument')

describe('sendToSapBillingDocument', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should successfully send billing documents and update state', async () => {
    const mockResponse: AxiosResponse = {
      data: { data: fakeDocs },
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {},
    }

    const mockPut = vi.fn().mockResolvedValue(mockResponse)

    vi.spyOn(gatewayModule, 'requireGateway').mockReturnValue(() => Promise.resolve({}))
    vi.spyOn(promisifyModule, 'pPut').mockReturnValue(mockPut)

    const fetchBillingSpy = vi.spyOn(fetchBilling, 'fetchBillingDocuments').mockImplementation(() => {})
    const fetchSatSpy = vi.spyOn(fetchSat, 'fetchSatBillingDocument').mockImplementation(() => {})

    const result = await sendToSapBillingDocument(mockSet, mockGet, sampleIds)

    expect(mockSet).toHaveBeenCalledWith({ sending: true, error: undefined, succesSend: false })

    expect(mockPut).toHaveBeenCalledWith(BillingDocumentsSendToSAP, sampleIds)
    await new Promise(resolve => setTimeout(resolve, 200))
    expect(fetchBillingSpy).toHaveBeenCalledWith(mockSet, mockGet, true)
    expect(fetchSatSpy).toHaveBeenCalledWith(mockSet, mockGet, true)

    expect(mockSet).toHaveBeenCalledWith({ sending: false, succesSend: true, error: undefined })

    expect(result).toEqual(fakeDocs)
  })

  it('should handle error and return null if request fails', async () => {
    const fakeError = new Error('Something went wrong')
    const normalizedError = { message: 'Normalized error' }

    vi.spyOn(gatewayModule, 'requireGateway').mockReturnValue(() => Promise.resolve({}))
    vi.spyOn(promisifyModule, 'pPut').mockReturnValue(() => Promise.reject(fakeError))
    vi.spyOn(errorNormalizer, 'normalizeApiError').mockReturnValue(normalizedError)

    const result = await sendToSapBillingDocument(mockSet, mockGet, sampleIds)

    expect(mockSet).toHaveBeenCalledWith({ sending: true, error: undefined, succesSend: false })
    expect(mockSet).toHaveBeenCalledWith({
      sending: false,
      succesSend: false,
      error: normalizedError.message,
    })

    expect(result).toBeNull()
  })
})
