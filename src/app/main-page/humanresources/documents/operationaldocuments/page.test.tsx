import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/assets/icons/Docs/page.svg', () => ({
  __esModule: true,
  default: () => <svg data-testid="doc-star" />,
}))

const deleteMock = vi.fn()
const refreshMock = vi.fn()

vi.mock('@/app/main-page/humanresources/documents/components/DocumentActionsMenuCell', () => ({
  __esModule: true,
  default: ({ row, onDelete }: any) => (
    <div data-testid={`actions-menu-${row.id}`}>
      <button type="button" onClick={() => onDelete?.(row)}>
        Eliminar
      </button>
    </div>
  ),
}))

vi.mock('@/app/components/PopUp/PopUp', () => ({
  __esModule: true,
  PopUp: ({
    open,
    title,
    content,
    showPrimaryButton,
    showSecondaryButton,
    primaryButtonText = 'Aceptar',
    secondaryButtonText = 'Cancelar',
    onPrimaryButtonClick,
    onSecondaryButtonClick,
  }: any) =>
    open ? (
      <div data-testid="popup">
        <p>{title}</p>
        <p>{content}</p>
        {showSecondaryButton && (
          <button type="button" onClick={onSecondaryButtonClick}>
            {secondaryButtonText}
          </button>
        )}
        {showPrimaryButton && (
          <button type="button" onClick={onPrimaryButtonClick}>
            {primaryButtonText}
          </button>
        )}
      </div>
    ) : null,
}))

vi.mock('./hooks/useOperationalDocuments', () => ({
  useOperationalDocuments: () => ({
    rows: [
      {
        id: '1',
        name: 'Código de proyectos DR',
        code: 'OP-001',
        description: 'Procedimiento operativo estándar',
        documentType: 'FORMATO',
        department: 'Contabilidad / Nómina',
        extension: 'pdf',
        route: 'https://example.com',
        date: '2025-02-03',
        rawDate: '2025-02-03',
      },
    ],
    loading: false,
    error: undefined,
    refresh: refreshMock,
    deleteDocument: deleteMock,
    deletingDocument: false,
  }),
}))

vi.mock('@/app/components/DataTable/DataTable', () => ({
  DataTable: ({ tables }: any) => (
    <div>
      DataTable
      {tables?.[0]?.data.map((row: any, index: number) => (
        <div key={row.id ?? index}>
          {tables?.[0]?.columns?.map((column: any, columnIndex: number) => (
            <div key={column.key ?? columnIndex}>
              {column.render ? column.render(row) : row[column.key]}
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
}))

const pushMock = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}))

import OperationalDocuments from './page'

describe('OperationalDocuments page', () => {
  beforeEach(() => {
    deleteMock.mockClear()
    refreshMock.mockClear()
    pushMock.mockClear()
  })

  it('renders table header and actions', () => {
    render(<OperationalDocuments />)

    expect(screen.getByText('Documentos Operativos')).toBeInTheDocument()
    expect(screen.getByText('DataTable')).toBeInTheDocument()
    expect(screen.getByText('Nuevo Documento')).toBeInTheDocument()
  })

  it('triggers refresh on button click', () => {
    render(<OperationalDocuments />)

    fireEvent.click(screen.getByText('Actualizar'))
    expect(refreshMock).toHaveBeenCalled()
  })

  it('opens delete confirmation and deletes the selected document', async () => {
    deleteMock.mockResolvedValue(true)

    render(<OperationalDocuments />)

    fireEvent.click(
      within(screen.getByTestId('actions-menu-1')).getByRole('button', {
        name: 'Eliminar',
      }),
    )

    expect(screen.getByTestId('popup')).toBeInTheDocument()
    expect(
      screen.getByText('¿Deseas eliminar el documento "Código de proyectos DR"?'),
    ).toBeInTheDocument()

    fireEvent.click(
      within(screen.getByTestId('popup')).getByRole('button', { name: 'Eliminar' }),
    )

    await waitFor(() => {
      expect(deleteMock).toHaveBeenCalledWith('1')
    })

    await waitFor(() => {
      expect(screen.queryByTestId('popup')).not.toBeInTheDocument()
    })
  })
})
