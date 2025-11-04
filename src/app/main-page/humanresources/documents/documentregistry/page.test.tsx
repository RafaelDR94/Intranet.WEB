import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const submitFn = vi.fn()
const handleSubmitMock = vi.fn()
const handleValuesChangeMock = vi.fn()

const useDocumentRegistryMock = vi.fn()
const useSearchParamsMock = vi.fn(() => new URLSearchParams())

vi.mock('./hooks/useDocumentRegistry', () => ({
  __esModule: true,
  default: (documentId?: string) => useDocumentRegistryMock(documentId),
}))

vi.mock('next/navigation', () => ({
  useSearchParams: () => useSearchParamsMock(),
}))

vi.mock('@/app/components/FormsLayout/FormsLayout', () => {
  const MockFormsLayout = ({
    title,
    primaryLabel,
    onPrimaryClick,
    primaryDisabled,
    children,
  }: any) => (
    <div>
      <h1>{title}</h1>
      <button type="button" disabled={primaryDisabled} onClick={onPrimaryClick}>
        {primaryLabel}
      </button>
      <div>{children}</div>
    </div>
  )

  return {
    __esModule: true,
    default: MockFormsLayout,
  }
})

vi.mock('@/app/components/DynamicForm/DynamicForm', () => {
  const MockDynamicForm = ({ children, onSubmit, onValuesChange }: any) => (
    <form
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        onSubmit?.({})
      }}
    >
      <div>{children}</div>
      <button
        type="button"
        onClick={() => {
          onValuesChange?.({ name: 'value' })
        }}
      >
        Notificar cambios
      </button>
    </form>
  )

  return {
    __esModule: true,
    default: MockDynamicForm,
  }
})

vi.mock('@/app/components/Button/Button', () => {
  const MockButton = ({ children, hideIcon: _hideIcon, ...props }: any) => (
    <button type="button" {...props}>
      {children}
    </button>
  )

  return {
    Button: MockButton,
  }
})

vi.mock('@/app/components/DocumentViewer/DocumentViewer', () => {
  const MockDocumentViewer = ({ fileUrl, onClose }: any) => (
    <div data-testid="document-viewer">
      <p>{fileUrl}</p>
      <button type="button" onClick={onClose}>
        Cerrar visor
      </button>
    </div>
  )

  return {
    __esModule: true,
    default: MockDocumentViewer,
  }
})

vi.mock('@/assets/icons/Docs/page.svg', () => ({
  __esModule: true,
  default: () => <svg data-testid="doc-icon" />,
}))

import DocumentRegistry from './page'

describe('DocumentRegistry page', () => {
  beforeEach(() => {
    submitFn.mockReset()
    handleSubmitMock.mockReset()
    handleValuesChangeMock.mockReset()
    useDocumentRegistryMock.mockReset()
    useSearchParamsMock.mockReset()
    useSearchParamsMock.mockReturnValue(new URLSearchParams())
    useDocumentRegistryMock.mockReturnValue({
      title: 'Registro de Documento',
      uploadedRoute: '',
      submitLabel: 'Registrar',
      submitRef: { current: submitFn },
      formReady: true,
      formVersion: 0,
      setFormReady: vi.fn(),
      fields: [],
      responsiveLayoutMatrix: [],
      handleSubmit: handleSubmitMock,
      handleValuesChange: handleValuesChangeMock,
      uploadingFile: false,
    })
  })

  it('renders the form layout and triggers submit via primary action', () => {
    render(<DocumentRegistry />)

    expect(screen.getByText('Registro de Documento')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Registrar' })).toBeEnabled()

    fireEvent.click(screen.getByRole('button', { name: 'Registrar' }))
    expect(submitFn).toHaveBeenCalledTimes(1)
  })

  it('propagates value changes from the dynamic form', () => {
    render(<DocumentRegistry />)

    fireEvent.click(screen.getByRole('button', { name: 'Notificar cambios' }))
    expect(handleValuesChangeMock).toHaveBeenCalledWith({ name: 'value' })
  })

  it('displays a viewer link when editing an existing document', () => {
    useSearchParamsMock.mockReturnValue(new URLSearchParams('documentId=doc-1'))
    useDocumentRegistryMock.mockReturnValue({
      title: 'Edición de Documento',
      uploadedRoute: 'https://example.com/file.pdf',
      submitLabel: 'Guardar Cambios',
      submitRef: { current: submitFn },
      formReady: true,
      formVersion: 1,
      setFormReady: vi.fn(),
      fields: [],
      responsiveLayoutMatrix: [],
      handleSubmit: handleSubmitMock,
      handleValuesChange: handleValuesChangeMock,
      uploadingFile: false,
    })

    render(<DocumentRegistry />)

    const openButton = screen.getByRole('button', { name: /Visualizar Archivo/i })
    fireEvent.click(openButton)

    expect(screen.getByTestId('document-viewer')).toBeInTheDocument()
    expect(screen.getByText('https://example.com/file.pdf')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar visor' }))
    expect(screen.queryByTestId('document-viewer')).not.toBeInTheDocument()
  })

  it('forwards documentId to the registry hook', () => {
    useSearchParamsMock.mockReturnValueOnce(new URLSearchParams('documentId=doc-9'))

    render(<DocumentRegistry />)

    expect(useDocumentRegistryMock).toHaveBeenCalledWith('doc-9')
  })
})
