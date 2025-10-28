import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import { Documents as DocumentsUrl } from '@/app/configurations/Axios/urls'
import type { DocumentTypeSummary } from '@/app/mappings/documents/documents.types'

const fetchMock = vi.fn()
const fetchDepartmentsMock = vi.fn()
const withLoadingMock = vi.fn(async (task: () => Promise<unknown>, _opts?: { message?: string }) => {
  await task()
})
const showAlertMock = vi.fn()
const hideAlertMock = vi.fn()
const postMock = vi.fn(async () => ({}))
const fileToDataUrlMock = vi.fn(async () => 'data:application/pdf;base64,dummy')

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalLoading: {
      withLoading: withLoadingMock,
      showSpinner: vi.fn(),
      hideSpinner: vi.fn(),
    },
    usePrincipalAlert: {
      showAlert: showAlertMock,
      hideAlert: hideAlertMock,
    },
  }),
}))

vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({
  pPost: vi.fn(() => postMock),
}))

vi.mock('@/app/utilities/Http/requireGateway', () => ({
  requireGateway: vi.fn(() => vi.fn()),
}))

vi.mock('@/app/utilities/FilesHelper/FilesHelper', () => ({
  fileToDataUrl: (...args: unknown[]) => fileToDataUrlMock(...args),
}))

vi.mock('@/app/utilities/Http/normalizeApiError', () => ({
  normalizeApiError: (error: any) => ({ message: error?.message ?? 'error' }),
}))

const documentTypes: DocumentTypeSummary[] = [
  {
    document_type_id: '1dcf1875-35b6-4d9c-b6a2-6df144f1580c',
    name: 'FORMATO',
    description: 'FORMATO',
    is_active: false,
  },
  {
    document_type_id: '2dcf1875-35b6-4d9c-b6a2-6df144f1580c',
    name: 'MANUAL',
    description: 'MANUAL',
    is_active: true,
  },
]

vi.mock('@/app/stores/useDocumentTypesStore/useDocumentTypesStore', () => ({
  useDocumentTypesStore: (selector: any) =>
    selector({
      documentTypes,
      activeDocumentTypes: documentTypes.filter((doc) => doc.is_active),
      loading: false,
      successGet: true,
      error: undefined,
      fetchDocumentTypes: fetchMock,
      reset: vi.fn(),
      resetFlags: vi.fn(),
    }),
}))

const departments = [
  {
    department_id: 'dept-2',
    name: 'Operaciones',
    enterprise_id: 'ent-1',
    enterprice_name: 'Empresa 1',
  },
  {
    department_id: 'dept-1',
    name: 'Administración',
    enterprise_id: 'ent-1',
    enterprice_name: 'Empresa 1',
  },
]

vi.mock('@/app/stores/useDepartmentsStore/useDepartmentsStore', () => ({
  useDepartmentsStore: (selector: any) =>
    selector({
      departments,
      loading: false,
      successGet: true,
      error: undefined,
      fetchDepartments: fetchDepartmentsMock,
      reset: vi.fn(),
      resetFlags: vi.fn(),
    }),
}))

import useDocumentRegistry from './useDocumentRegistry'

describe('useDocumentRegistry hook', () => {
  beforeEach(() => {
    fetchMock.mockClear()
    fetchDepartmentsMock.mockClear()
    withLoadingMock.mockClear()
    showAlertMock.mockClear()
    hideAlertMock.mockClear()
    postMock.mockClear()
    fileToDataUrlMock.mockClear()
  })

  it('loads document types and exposes only active options', async () => {
    const { result } = renderHook(() => useDocumentRegistry())

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled()
      expect(fetchDepartmentsMock).toHaveBeenCalled()
    })

    const documentTypeField = result.current.fields.find(
      (field) => field.name === 'documentType',
    )

    expect(documentTypeField?.options).toHaveLength(1)
    expect(documentTypeField?.options?.[0]).toEqual({
      label: 'MANUAL',
      value: '2dcf1875-35b6-4d9c-b6a2-6df144f1580c',
    })

    const destinationAreaField = result.current.fields.find(
      (field) => field.name === 'destinationArea',
    )

    expect(destinationAreaField?.options).toEqual([
      { label: 'Administración', value: 'dept-1' },
      { label: 'Operaciones', value: 'dept-2' },
    ])
  })

  it('submits form values to Documents endpoint', async () => {
    const { result } = renderHook(() => useDocumentRegistry())

    const file = new File(['hello'], 'Manual.pdf', { type: 'application/pdf' })

    const values = {
      documentFile: file,
      documentKey: 'DOC-001',
      specifications: 'internal',
      destinationArea: 'dept-1',
      documentType: 'type-1',
      description: 'Document description',
    }

    await result.current.handleSubmit(values)

    expect(withLoadingMock).toHaveBeenCalledTimes(1)
    const [, loadingOpts] = withLoadingMock.mock.calls[0] ?? []
    expect(loadingOpts?.message).toBe('Registrando documento…')

    expect(fileToDataUrlMock).toHaveBeenCalledWith(file)

    expect(postMock).toHaveBeenCalledWith(DocumentsUrl, {
      name: 'Manual',
      code: 'DOC-001',
      description: 'Document description',
      document_type_id: 'type-1',
      department_id: 'dept-1',
      management: true,
      route: 'data:application/pdf;base64,dummy',
      extension: 'pdf',
    })

    expect(showAlertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
        title: 'Documento registrado',
      }),
    )
  })

  it('shows error alert when submission fails', async () => {
    postMock.mockRejectedValueOnce(new Error('fail'))

    const { result } = renderHook(() => useDocumentRegistry())

    const file = new File(['hello'], 'Manual.pdf', { type: 'application/pdf' })

    const values = {
      documentFile: file,
      documentKey: 'DOC-001',
      specifications: 'external',
      destinationArea: 'dept-1',
      documentType: 'type-1',
      description: 'Document description',
    }

    await result.current.handleSubmit(values)

    expect(withLoadingMock).toHaveBeenCalledTimes(1)
    expect(showAlertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        title: 'No se pudo registrar el documento',
      }),
    )

    const [, payload] = postMock.mock.calls[0] ?? []
    expect(payload?.management).toBe(false)
  })
})
