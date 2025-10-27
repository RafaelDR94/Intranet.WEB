import { describe, it, expect, vi, beforeEach } from 'vitest'

import type { DocumentTypesState, Set, Get } from '../types'

import { fetchDocumentTypes } from './fetchDocumentTypes'

const requireGatewayMock = vi.fn()
const getRequestMock = vi.fn()

vi.mock('@/app/utilities/Http/requireGateway', () => ({
  requireGateway: () => requireGatewayMock,
}))

vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({
  pGet: () => getRequestMock,
}))

vi.mock('@/app/utilities/Http/normalizeApiError', () => ({
  normalizeApiError: (error: any) => ({ message: error?.message ?? 'error' }),
}))

const sampleDocumentType = {
  document_type_id: '1dcf1875-35b6-4d9c-b6a2-6df144f1580c',
  name: 'FORMATO',
  description: 'FORMATO',
  is_active: true,
}

const createState = () => {
  const state: Partial<DocumentTypesState> = {
    documentTypes: [],
    activeDocumentTypes: [],
    loading: false,
    successGet: false,
  }

  const set: Set = (partial) => {
    const patch = typeof partial === 'function' ? partial(state as DocumentTypesState) : partial
    Object.assign(state, patch)
  }

  const get: Get = () => state as DocumentTypesState

  return { state, set, get }
}

describe('fetchDocumentTypes', () => {
  beforeEach(() => {
    requireGatewayMock.mockReset()
    getRequestMock.mockReset()
  })

  it('maps and stores active document types', async () => {
    requireGatewayMock.mockReturnValue(async () => sampleDocumentType)
    getRequestMock.mockResolvedValue({ data: { data: [sampleDocumentType] } })

    const { state, set, get } = createState()

    await fetchDocumentTypes(set, get)

    expect(state.loading).toBe(false)
    expect(state.successGet).toBe(true)
    expect(state.documentTypes).toHaveLength(1)
    expect(state.activeDocumentTypes).toHaveLength(1)
    expect(state.activeDocumentTypes?.[0]?.name).toBe('FORMATO')
  })

  it('filters out inactive document types', async () => {
    requireGatewayMock.mockReturnValue(async () => sampleDocumentType)
    getRequestMock.mockResolvedValue({
      data: { data: [{ ...sampleDocumentType, is_active: false }] },
    })

    const { state, set, get } = createState()

    await fetchDocumentTypes(set, get)

    expect(state.documentTypes).toHaveLength(1)
    expect(state.activeDocumentTypes).toHaveLength(0)
    expect(state.successGet).toBe(true)
  })

  it('sets error when request fails', async () => {
    requireGatewayMock.mockReturnValue(async () => {
      throw new Error('fail')
    })
    getRequestMock.mockImplementation(async () => {
      throw new Error('fail')
    })

    const { state, set, get } = createState()

    await fetchDocumentTypes(set, get, true)

    expect(state.loading).toBe(false)
    expect(state.successGet).toBe(false)
    expect(state.error).toBe('fail')
  })
})
