import { describe, it, expect, vi, beforeEach } from 'vitest'

import type { DocumentsState, Set, Get } from '../types'

import { fetchDocuments, fetchDocumentsByUser } from './fetchDocuments'

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

const sampleDocument = {
  document_id: 'bb31479c-9997-4cfd-8f26-318372a20c4d',
  name: 'Bruno',
  code: 'frfrfrfr',
  description: 'freercerrecr',
  document_type: {
    document_type_id: '1dcf1875-35b6-4d9c-b6a2-6df144f1580c',
    name: 'FORMATO',
    description: 'FORMATO',
    is_active: false,
  },
  department: {
    department_id: '79b3ec13-1dc1-4ef6-a595-0b05d47b0d83',
    name: 'VISITAX',
    enterprise_id: '3e1d08c8-c38b-42c1-8d4b-a31a6c099671',
    enterprice_name: null,
  },
  departments: [
    {
      department_id: '79b3ec13-1dc1-4ef6-a595-0b05d47b0d83',
      name: 'VISITAX',
      enterprise_id: '3e1d08c8-c38b-42c1-8d4b-a31a6c099671',
      enterprice_name: null,
    },
  ],
  management: true,
  route: 'https://example.com/document',
  extension: 'pdf',
}

const createState = () => {
  const state: Partial<DocumentsState> = {
    documents: [],
    managementDocuments: [],
    loading: false,
    successGet: false,
  }

  const set: Set = (partial) => {
    const patch = typeof partial === 'function' ? partial(state as DocumentsState) : partial
    Object.assign(state, patch)
  }

  const get: Get = () => state as DocumentsState

  return { state, set, get }
}

describe('fetchDocuments', () => {
  beforeEach(() => {
    requireGatewayMock.mockReset()
    getRequestMock.mockReset()
  })

  it('maps and stores management documents', async () => {
    requireGatewayMock.mockReturnValue(async () => sampleDocument)
    getRequestMock.mockResolvedValue({ data: { data: [sampleDocument] } })

    const { state, set, get } = createState()

    await fetchDocuments(set, get)

    expect(state.loading).toBe(false)
    expect(state.successGet).toBe(true)
    expect(state.documents).toHaveLength(1)
    expect(state.managementDocuments).toHaveLength(1)
    expect(state.documents?.[0]?.name).toBe('Bruno')
  })

  it('sets error when request fails', async () => {
    requireGatewayMock.mockReturnValue(async () => { throw new Error('fail') })
    getRequestMock.mockImplementation(async () => { throw new Error('fail') })

    const { state, set, get } = createState()

    await fetchDocuments(set, get, true)

    expect(state.loading).toBe(false)
    expect(state.successGet).toBe(false)
    expect(state.error).toBe('fail')
  })
})

describe('fetchDocumentsByUser', () => {
  beforeEach(() => {
    requireGatewayMock.mockReset()
    getRequestMock.mockReset()
  })

  it('maps and stores documents returned by user endpoint', async () => {
    getRequestMock.mockResolvedValue({ data: { data: [sampleDocument] } })
    const { state, set, get } = createState()

    await fetchDocumentsByUser(set, get, 'user-123')

    expect(getRequestMock).toHaveBeenCalledWith('/Documents/ByUser/user-123')
    expect(state.loading).toBe(false)
    expect(state.successGet).toBe(true)
    expect(state.documents).toHaveLength(1)
  })

  it('sets a validation error when idUser is empty', async () => {
    const { state, set, get } = createState()

    await fetchDocumentsByUser(set, get, '')

    expect(getRequestMock).not.toHaveBeenCalled()
    expect(state.successGet).toBe(false)
    expect(state.error).toBe('idUser is required')
  })
})
