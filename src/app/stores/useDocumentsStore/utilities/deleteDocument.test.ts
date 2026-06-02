import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { DocumentsState, Set, Get } from '../types'

import { Documents as DocumentsUrl } from '@/app/configurations/Axios/urls'

import { deleteDocument } from './deleteDocument'

const requireGatewayMock = vi.fn()
const deleteRequestMock = vi.fn()

vi.mock('@/app/utilities/Http/requireGateway', () => ({
  requireGateway: () => requireGatewayMock,
}))

vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({
  pDelete: () => deleteRequestMock,
}))

vi.mock('@/app/utilities/Http/normalizeApiError', () => ({
  normalizeApiError: (error: any) => ({ message: error?.message ?? 'error' }),
}))

const createState = () => {
  const state: Partial<DocumentsState> = {
    documents: [
      {
        document_id: 'bb31479c-9997-4cfd-8f26-318372a20c4d',
      } as any,
    ],
    managementDocuments: [
      {
        document_id: 'bb31479c-9997-4cfd-8f26-318372a20c4d',
      } as any,
    ],
    operationalDocuments: [
      {
        document_id: 'bb31479c-9997-4cfd-8f26-318372a20c4d',
      } as any,
    ],
    deletingDocument: false,
    successDeleteDocument: false,
    error: undefined,
  }

  const set: Set = (partial) => {
    const patch =
      typeof partial === 'function' ? partial(state as DocumentsState) : partial
    Object.assign(state, patch)
  }

  const get: Get = () => state as DocumentsState

  return { state, set, get }
}

describe('deleteDocument', () => {
  beforeEach(() => {
    requireGatewayMock.mockReset()
    deleteRequestMock.mockReset()
  })

  it('removes the document and calls endpoint with query id', async () => {
    deleteRequestMock.mockResolvedValue({} as any)

    const { state, set, get } = createState()

    const success = await deleteDocument(
      set,
      get,
      'bb31479c-9997-4cfd-8f26-318372a20c4d',
    )

    expect(success).toBe(true)
    expect(deleteRequestMock).toHaveBeenCalledWith(
      `${DocumentsUrl}?id=bb31479c-9997-4cfd-8f26-318372a20c4d`,
    )
    expect(state.documents).toHaveLength(0)
    expect(state.managementDocuments).toHaveLength(0)
    expect(state.operationalDocuments).toHaveLength(0)
    expect(state.deletingDocument).toBe(false)
    expect(state.successDeleteDocument).toBe(true)
  })

  it('handles errors by storing message and returning false', async () => {
    deleteRequestMock.mockRejectedValue(new Error('fail'))

    const { state, set, get } = createState()

    const success = await deleteDocument(
      set,
      get,
      'bb31479c-9997-4cfd-8f26-318372a20c4d',
    )

    expect(success).toBe(false)
    expect(deleteRequestMock).toHaveBeenCalledWith(
      `${DocumentsUrl}?id=bb31479c-9997-4cfd-8f26-318372a20c4d`,
    )
    expect(state.deletingDocument).toBe(false)
    expect(state.successDeleteDocument).toBe(false)
    expect(state.error).toBe('fail')
  })
})

