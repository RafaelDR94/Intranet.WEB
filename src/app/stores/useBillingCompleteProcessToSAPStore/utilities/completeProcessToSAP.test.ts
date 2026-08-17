import type { AxiosResponse } from 'axios'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import * as gatewayModule from '@/app/utilities/Http/requireGateway'

import type { BillingCompleteProcessToSAPState, Get, Set } from '../types'
import { completeProcessToSAP } from './completeProcessToSAP'

vi.mock('@/app/utilities/Http/requireGateway')

type PostCallback = (response: AxiosResponse) => void

const buildState = () => {
  const state: BillingCompleteProcessToSAPState = {
    sending: false,
    success: false,
    error: undefined,
    response: null,
    completeProcessToSAP: vi.fn(),
    reset: vi.fn(),
    resetFlags: vi.fn(),
  }

  const set: Set = (partial) => {
    const next = typeof partial === 'function' ? partial(state) : partial
    Object.assign(state, next)
  }

  const get: Get = () => state

  return { state, set, get }
}

const mockPostResponse = (response: Partial<AxiosResponse>) => {
  const postMock = vi.fn((_url: string, _payload: unknown, callback: PostCallback) => {
    callback(response as AxiosResponse)
  })

  vi.spyOn(gatewayModule, 'requireGateway').mockReturnValue(postMock)

  return postMock
}

const buildResponse = (status: number, data: unknown): Partial<AxiosResponse> => ({
  status,
  statusText: '',
  data,
})

describe('completeProcessToSAP', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('does not set success or error when 200 has empty documents', async () => {
    const { state, set, get } = buildState()
    mockPostResponse(
      buildResponse(200, {
        data: {
          message: 'Documentos enviados a SAP.',
          successfulDocuments: 1,
          failedDocuments: 0,
          documents: [],
        },
        success: true,
        error_Message: '',
        error_Code: 0,
      }),
    )

    const result = await completeProcessToSAP(set, get, ['doc-1'])

    expect(result?.documents).toEqual([])
    expect(state.sending).toBe(false)
    expect(state.success).toBe(false)
    expect(state.error).toBeUndefined()
  })

  it('sets document error messages when 201 has partial failures', async () => {
    const { state, set, get } = buildState()
    mockPostResponse(
      buildResponse(201, {
        data: {
          message: 'Algunos documentos no se pudieron enviar a SAP.',
          successfulDocuments: 1,
          failedDocuments: 1,
          documents: [
            {
              billingDocumentId: 'doc-1',
              uuid: 'uuid-1',
              errorMessage: 'Error parcial SAP',
            },
          ],
        },
        success: true,
        error_Message: '',
        error_Code: 0,
      }),
    )

    const result = await completeProcessToSAP(set, get, ['doc-1', 'doc-2'])

    expect(result?.failedDocuments).toBe(1)
    expect(state.success).toBe(false)
    expect(state.error).toBe('Error parcial SAP')
  })

  it('sets document error messages when 400 rejects all documents', async () => {
    const { state, set, get } = buildState()
    mockPostResponse(
      buildResponse(400, {
        data: {
          message: 'No se pudo enviar ningun documento a SAP.',
          successfulDocuments: 0,
          failedDocuments: 1,
          documents: [
            {
              billingDocumentId: 'doc-1',
              uuid: 'uuid-1',
              errorMessage: 'Error al enviar borrador a SAP',
            },
          ],
        },
        success: true,
        error_Message: '',
        error_Code: 0,
      }),
    )

    const result = await completeProcessToSAP(set, get, ['doc-1'])

    expect(result).toBeNull()
    expect(state.success).toBe(false)
    expect(state.error).toBe('Error al enviar borrador a SAP')
  })
})
