import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

vi.mock('@/assets/icons/Docs/page.svg', () => ({
  __esModule: true,
  default: () => <svg data-testid="doc-icon" />,
}))

const deleteMock = vi.fn()
const refreshMock = vi.fn()

vi.mock(
  '@/app/main-page/humanresources/documents/components/DocumentActionsMenuCell/DocumentActionsMenuCell',
  () => ({
    __esModule: true,
    default: ({ row, onDelete }: any) => (
      <div data-testid={`actions-menu-${row.id}`}>
        <button type="button" onClick={() => onDelete?.(row)}>
          Eliminar
        </button>
      </div>
    ),
  }),
)

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

vi.mock('./hooks/useManagementDocuments', () => ({
  useManagementDocuments: () => ({
    rows: [
      {
        id: '1',
        name: 'Manual de procesos',
        code: 'MG-001',
        description: 'Guía de procesos',
        documentType: 'FORMATO',
        department: 'VISITAX',
        extension: 'pdf',
        route: 'https://example.com',
        date: '2025-10-24',
        rawDate: '2025-10-24',
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
  DataTable: ({ tables, onRefreshPage, actionsRender }: any) => (
    <div>
      <div>DataTable</div>
      <button type="button" onClick={onRefreshPage}>
        Actualizar
      </button>
      {actionsRender && actionsRender()}
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
  usePathname: () => '/main-page/humanresources/documents/managementdocuments',
}))

import ManagementDocuments from './page'

describe('ManagementDocuments page', () => {
  beforeEach(() => {
    deleteMock.mockClear()
    refreshMock.mockClear()
    pushMock.mockClear()
  })

  it('renders table and actions', () => {
    render(<ManagementDocuments />)

    expect(screen.getByText('DataTable')).toBeInTheDocument()
    expect(screen.getByText('Nuevo Documento')).toBeInTheDocument()
  })

  it('calls refresh when clicking "Actualizar"', () => {
    render(<ManagementDocuments />)

    fireEvent.click(screen.getByText('Actualizar'))
    expect(refreshMock).toHaveBeenCalledTimes(1)
  })

  it('opens delete confirmation and deletes the selected document', async () => {
    deleteMock.mockResolvedValue(true)

    render(<ManagementDocuments />)

    // Clic en eliminar dentro del menú de acciones
    fireEvent.click(
      within(screen.getByTestId('actions-menu-1')).getByRole('button', {
        name: 'Eliminar',
      }),
    )

    // Verifica que el popup se abra con el texto correcto
    expect(screen.getByTestId('popup')).toBeInTheDocument()
    expect(
      screen.getByText('Esta acción confirmará la eliminación del documento seleccionado'),
    ).toBeInTheDocument()

    // Confirmar eliminación
    fireEvent.click(
      within(screen.getByTestId('popup')).getByRole('button', { name: 'Eliminar' }),
    )

    await waitFor(() => expect(deleteMock).toHaveBeenCalledWith('1'))
    await waitFor(() => expect(screen.queryByTestId('popup')).not.toBeInTheDocument())
  })
})
