import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import { Documents as DocumentsUrl } from '@/app/configurations/Axios/urls'
import type { DocumentTypeSummary } from '@/app/mappings/documents/documents.types'

/* ---------------------- MOCKS BÁSICOS ---------------------- */

const fetchMock = vi.fn()
const fetchDepartmentsMock = vi.fn()
const withLoadingMock = vi.fn(async (task: () => Promise<unknown>, _opts?: { message?: string }) => {
  await task()
})
const showAlertMock = vi.fn()
const hideAlertMock = vi.fn()
const postMock = vi.fn(async () => ({}))
const putMock = vi.fn(async () => ({}))
const uploadFileMock = vi.fn(async (_file: File, _key: string) =>
  'https://firebase.test/documents/DOC-001.pdf'
)

const fetchDocumentsMock = vi.fn()

const documentsState = {
  documents: [] as any[],
  fetchDocuments: fetchDocumentsMock,
}

/* ---------------------- CONTEXTOS MOCK ---------------------- */

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
  pPut: vi.fn(() => putMock),
}))

vi.mock('@/app/utilities/Http/requireGateway', () => ({
  requireGateway: vi.fn(() => vi.fn()),
}))

vi.mock('@/app/context/FirebaseContext/FirebaseContext', () => ({
  useFirebase: () => ({
    firebasestorage: {
      uploadFile: uploadFileMock,
    },
  }),
}))

vi.mock('@/app/utilities/Http/normalizeApiError', () => ({
  normalizeApiError: (error: any) => ({ message: error?.message ?? 'error' }),
}))

vi.mock('@/app/stores/useDocumentsStore/useDocumentsStore', () => ({
  useDocumentsStore: (selector: any) =>
    selector({
      documents: documentsState.documents,
      fetchDocuments: documentsState.fetchDocuments,
    }),
}))

/* ---------------------- TIPOS Y DATOS ---------------------- */

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
  {
    department_id: undefined,
    name: 'Sin Identificador',
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

/* ---------------------- TESTS ---------------------- */

describe('useDocumentRegistry hook', () => {
  beforeEach(() => {
    fetchMock.mockClear()
    fetchDepartmentsMock.mockClear()
    withLoadingMock.mockClear()
    showAlertMock.mockClear()
    hideAlertMock.mockClear()
    postMock.mockClear()
    putMock.mockClear()
    uploadFileMock.mockClear()
    fetchDocumentsMock.mockClear()
    documentsState.documents = []
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
    const toolsChecklistField = result.current.fields.find(
      (field) => field.name === 'toolsChecklist',
    )

    expect(destinationAreaField?.options).toEqual([
      { label: 'Administración', value: 'dept-1' },
      { label: 'Operaciones', value: 'dept-2' },
    ])
    expect(toolsChecklistField?.options).toEqual([
      { label: 'Administración', value: 'dept-1' },
      { label: 'Operaciones', value: 'dept-2' },
    ])
    expect(toolsChecklistField?.value).toEqual([])
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
      toolsChecklist: [],
    }

    await act(async () => {
      await result.current.handleSubmit(values)
    })

    expect(withLoadingMock).toHaveBeenCalledTimes(1)
    const [, loadingOpts] = withLoadingMock.mock.calls[0] ?? []
    expect(loadingOpts?.message).toBe('Registrando documento…')

    const [uploadedFile, storageKey, disableTime] =
      uploadFileMock.mock.calls[0] ?? []

    expect(uploadedFile).toBe(file)
    expect(typeof storageKey).toBe('string')
    expect(storageKey).toMatch(
      /^HumanResources\/DocumentRegistry\/DOC-001_[A-Za-z0-9]+\.pdf$/,
    )
    expect(disableTime).toBe(true)

    expect(postMock).toHaveBeenCalledWith(DocumentsUrl, {
      name: 'Manual',
      code: 'DOC-001',
      description: 'Document description',
      document_type_id: 'type-1',
      department_id: ['dept-1'],
      management: true,
      route: 'https://firebase.test/documents/DOC-001.pdf',
      extension: 'pdf',
    })
    expect(putMock).not.toHaveBeenCalled()
    expect(fetchDocumentsMock).toHaveBeenCalledWith(true)

    expect(showAlertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
        title: 'Documento registrado',
      }),
    )

    await waitFor(() => {
      expect(result.current.uploadedRoute).toBe('')
      expect(result.current.formVersion).toBe(1)
    })
  })

  it('ignores the previously submitted file when the form resets', async () => {
    const { result } = renderHook(() => useDocumentRegistry())

    const file = new File(['hello'], 'Manual.pdf', { type: 'application/pdf' })

    const baseValues = {
      documentFile: file,
      documentKey: 'DOC-001',
      specifications: 'internal',
      destinationArea: 'dept-1',
      documentType: 'type-1',
      description: 'Document description',
      toolsChecklist: [],
    }

    await act(async () => {
      await result.current.handleSubmit(baseValues)
    })

    expect(uploadFileMock).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(result.current.formVersion).toBe(1)
    })

    uploadFileMock.mockClear()

    await act(async () => {
      await result.current.handleValuesChange(baseValues)
    })

    expect(uploadFileMock).not.toHaveBeenCalled()

    const newFile = new File(['bye'], 'Manual-v2.pdf', { type: 'application/pdf' })

    await act(async () => {
      await result.current.handleValuesChange({
        ...baseValues,
        documentFile: newFile,
      })
    })

    expect(uploadFileMock).toHaveBeenCalledTimes(1)
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
      toolsChecklist: ['dept-2'],
    }

    await act(async () => {
      await result.current.handleSubmit(values)
    })

    expect(withLoadingMock).toHaveBeenCalledTimes(1)
    expect(uploadFileMock).toHaveBeenCalled()
    expect(putMock).not.toHaveBeenCalled()
    expect(showAlertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        title: 'No se pudo registrar el documento',
      }),
    )

    const [, payload] = postMock.mock.calls[0] ?? []
    expect(payload?.management).toBe(false)
    expect(new Set(payload?.department_id)).toEqual(new Set(['dept-1', 'dept-2']))
  })

  it('includes checklist selections even when values are provided as option objects', async () => {
    const { result } = renderHook(() => useDocumentRegistry())

    const file = new File(['hello'], 'Manual.pdf', { type: 'application/pdf' })

    const values = {
      documentFile: file,
      documentKey: 'DOC-002',
      specifications: 'external',
      destinationArea: 'dept-2',
      documentType: 'type-1',
      description: 'Otro documento',
      toolsChecklist: [
        { label: 'Administración', value: 'dept-1' },
        { label: 'Operaciones', value: 'dept-2' },
      ],
    }

    await act(async () => {
      await result.current.handleSubmit(values)
    })

    const [, payload] = postMock.mock.calls.at(-1) ?? []
    expect(payload?.management).toBe(false)
    expect(new Set(payload?.department_id)).toEqual(new Set(['dept-1', 'dept-2']))
    expect(fetchDocumentsMock).toHaveBeenCalledWith(true)
  })

  it('prefills form values when editing an existing document', () => {
    documentsState.documents = [
      {
        document_id: 'doc-1',
        name: 'Manual de procesos',
        code: 'DOC-001',
        description: 'Guía de procesos',
        document_type: {
          document_type_id: '2dcf1875-35b6-4d9c-b6a2-6df144f1580c',
          name: 'MANUAL',
          description: 'MANUAL',
          is_active: true,
        },
        department: {
          department_id: 'dept-1',
          name: 'Administración',
          enterprise_id: 'ent-1',
          enterprice_name: 'Empresa 1',
        },
        departments: [
          {
            department_id: 'dept-1',
            name: 'Administración',
            enterprise_id: 'ent-1',
            enterprice_name: 'Empresa 1',
          },
        ],
        management: true,
        route: 'https://example.com/doc.pdf',
        extension: 'pdf',
      },
    ]

    const { result } = renderHook(() => useDocumentRegistry('doc-1'))

    const documentKeyField = result.current.fields.find((f) => f.name === 'documentKey')
    const specificationsField = result.current.fields.find((f) => f.name === 'specifications')
    const destinationAreaField = result.current.fields.find((f) => f.name === 'destinationArea')
    const documentTypeField = result.current.fields.find((f) => f.name === 'documentType')
    const descriptionField = result.current.fields.find((f) => f.name === 'description')
    const fileField = result.current.fields.find((f) => f.name === 'documentFile')
    const toolsChecklistField = result.current.fields.find((f) => f.name === 'toolsChecklist')

    expect(documentKeyField?.value).toBe('DOC-001')
    expect(specificationsField?.value).toBe('internal')
    expect(destinationAreaField?.value).toBe('dept-1')
    expect(documentTypeField?.value).toBe('2dcf1875-35b6-4d9c-b6a2-6df144f1580c')
    expect(descriptionField?.value).toBe('Guía de procesos')
    expect(fileField?.helperText).toBe('Archivo listo: Manual de procesos')
    expect(fileField?.validations).toBeUndefined()
    expect(fileField?.initialFile).toEqual({
      name: 'Manual de procesos',
      url: 'https://example.com/doc.pdf',
    })
    expect(toolsChecklistField?.value).toEqual(['dept-1'])
    expect(result.current.title).toBe('Edición de Documento')
    expect(result.current.submitLabel).toBe('Guardar Cambios')
    expect(fetchDocumentsMock).not.toHaveBeenCalled()
  })

  it('updates an existing document using PUT without reuploading the file', async () => {
    documentsState.documents = [
      {
        document_id: 'doc-1',
        name: 'Manual de procesos',
        code: 'DOC-001',
        description: 'Guía de procesos',
        document_type: {
          document_type_id: '2dcf1875-35b6-4d9c-b6a2-6df144f1580c',
          name: 'MANUAL',
          description: 'MANUAL',
          is_active: true,
        },
        department: {
          department_id: 'dept-1',
          name: 'Administración',
          enterprise_id: 'ent-1',
          enterprice_name: 'Empresa 1',
        },
        departments: [
          {
            department_id: 'dept-1',
            name: 'Administración',
            enterprise_id: 'ent-1',
            enterprice_name: 'Empresa 1',
          },
        ],
        management: true,
        route: 'https://example.com/doc.pdf',
        extension: 'pdf',
      },
    ]

    const { result } = renderHook(() => useDocumentRegistry('doc-1'))

    const values = {
      documentFile: null,
      documentKey: 'DOC-001',
      specifications: 'internal',
      destinationArea: 'dept-1',
      documentType: '2dcf1875-35b6-4d9c-b6a2-6df144f1580c',
      description: 'Guía de procesos',
      toolsChecklist: [],
    }

    await act(async () => {
      await result.current.handleSubmit(values)
    })

    expect(withLoadingMock).toHaveBeenCalled()
    const [, loadingOpts] = withLoadingMock.mock.calls.at(-1) ?? []
    expect(loadingOpts?.message).toBe('Actualizando documento…')

    expect(uploadFileMock).not.toHaveBeenCalled()
    expect(postMock).not.toHaveBeenCalled()
    expect(putMock).toHaveBeenCalledWith(
      DocumentsUrl,
      expect.objectContaining({
        document_id: 'doc-1',
        code: 'DOC-001',
        document_type_id: '2dcf1875-35b6-4d9c-b6a2-6df144f1580c',
        department_id: ['dept-1'],
        management: true,
        route: 'https://example.com/doc.pdf',
        extension: 'pdf',
      }),
    )
    expect(fetchDocumentsMock).toHaveBeenCalledWith(true)

    expect(showAlertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
        title: 'Documento actualizado',
      }),
    )

    await waitFor(() => {
      expect(result.current.uploadedRoute).toBe('https://example.com/doc.pdf')
      expect(result.current.formVersion).toBe(1)
      const documentKeyField = result.current.fields.find((f) => f.name === 'documentKey')
      const descriptionField = result.current.fields.find((f) => f.name === 'description')

      expect(documentKeyField?.value).toBe('')
      expect(descriptionField?.value).toBe('')
    })
  })

  it('requests documents when editing and the record is missing locally', () => {
    documentsState.documents = []

    const { result, rerender } = renderHook(() => useDocumentRegistry('missing'))

    expect(fetchDocumentsMock).toHaveBeenCalledWith(true)

    documentsState.documents = [
      {
        document_id: 'missing',
        name: 'Formato',
        code: 'DOC-002',
        description: 'Descripción',
        document_type: {
          document_type_id: '2dcf1875-35b6-4d9c-b6a2-6df144f1580c',
          name: 'MANUAL',
          description: 'MANUAL',
          is_active: true,
        },
        department: {
          department_id: 'dept-2',
          name: 'Operaciones',
          enterprise_id: 'ent-1',
          enterprice_name: 'Empresa 1',
        },
        departments: [
          { department_id: 'dept-2', name: 'Operaciones' },
          { department_id: 'dept-1', name: 'Administración' },
        ],
        management: false,
        route: 'https://example.com/doc.pdf',
        extension: 'pdf',
      },
    ]

    rerender()

    const documentKeyField = result.current.fields.find((f) => f.name === 'documentKey')
    const specificationsField = result.current.fields.find((f) => f.name === 'specifications')
    const fileField = result.current.fields.find((f) => f.name === 'documentFile')

    expect(documentKeyField?.value).toBe('DOC-002')
    expect(specificationsField?.value).toBe('external')
    expect(fileField?.helperText).toBe('Archivo listo: Formato')
    expect(fetchDocumentsMock).toHaveBeenCalledTimes(1)
  })
})
