import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AxiosResponse } from 'axios'

import { updateBillingDocumentJsonSap } from './updateBillingDocumentJsonSap'

import * as gatewayModule from '@/app/utilities/Http/requireGateway'
import * as promisifyModule from '@/app/utilities/Http/promisifyIntranet'
import * as errorNormalizer from '@/app/utilities/Http/normalizeApiError'
import * as fetchByIdModule from './fetchBillingDocumentById'
import * as fetchSatModule from './fetchSatBillingDocument'

import { BillingJsonSap } from '@/app/configurations/Axios/urls'

const mockSet = vi.fn()
const mockGet = vi.fn()
const payload = {
  Id_BillingDocument: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  jsonsap: '{"iva":81.79}',
}

vi.mock('@/app/utilities/Http/requireGateway')
vi.mock('@/app/utilities/Http/promisifyIntranet')
vi.mock('@/app/utilities/Http/normalizeApiError')
vi.mock('./fetchBillingDocumentById')
vi.mock('./fetchSatBillingDocument')

describe('updateBillingDocumentJsonSap', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('updates json_sap and refreshes related data', async () => {
    const mockResponse: AxiosResponse = {
      data: { data: null },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    }

    const mockPut = vi.fn().mockResolvedValue(mockResponse)

    vi.spyOn(gatewayModule, 'requireGateway').mockReturnValue(() => Promise.resolve({} as any))
    vi.spyOn(promisifyModule, 'pPut').mockReturnValue(mockPut)
    const fetchByIdSpy = vi.spyOn(fetchByIdModule, 'fetchBillingDocumentById').mockResolvedValue(null)
    const fetchSatSpy = vi.spyOn(fetchSatModule, 'fetchSatBillingDocument').mockImplementation(() => Promise.resolve())

    const result = await updateBillingDocumentJsonSap(mockSet as any, mockGet as any, payload)

    expect(mockSet).toHaveBeenCalledWith({ updating: true, error: undefined, successPut: false })
    expect(mockPut).toHaveBeenCalledWith(BillingJsonSap, payload)
    expect(fetchByIdSpy).toHaveBeenCalledWith(payload.Id_BillingDocument, mockSet, mockGet, true)
    expect(fetchSatSpy).toHaveBeenCalledWith(mockSet, mockGet, true)
    expect(mockSet).toHaveBeenCalledWith({ updating: false, successPut: true })
    expect(result).toBe(true)
  })

  it('returns false and sets error when request fails', async () => {
    const fakeError = new Error('Request failed')
    const normalizedError = { message: 'Normalized error' }

    vi.spyOn(gatewayModule, 'requireGateway').mockReturnValue(() => Promise.resolve({} as any))
    vi.spyOn(promisifyModule, 'pPut').mockReturnValue(() => Promise.reject(fakeError))
    vi.spyOn(errorNormalizer, 'normalizeApiError').mockReturnValue(normalizedError as any)

    const result = await updateBillingDocumentJsonSap(mockSet as any, mockGet as any, payload)

    expect(mockSet).toHaveBeenCalledWith({ updating: true, error: undefined, successPut: false })
    expect(mockSet).toHaveBeenCalledWith({
      updating: false,
      successPut: false,
      error: normalizedError.message,
    })
    expect(result).toBe(false)
  })
})

