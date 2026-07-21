import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/assets/icons/Docs/page.svg', () => ({
  __esModule: true,
  default: () => <svg data-testid="doc-icon" />,
}))

const deleteMock = vi.fn()
const refreshMock = vi.fn()

vi.mock(
  '@/app/main-page/request/documents/components/DocumentActionsMenuCell/DocumentActionsMenuCell',
  () => ({
    __esModule: true,
    default: ({ row, onDelete, onView }: any) => (
      <div data-testid={`actions-menu-${row.id}`}>
        <button type="button" onClick={() => onView?.(row)}>
          Ver detalles
        </button>
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

vi.mock('./hooks/useOperationalDocuments', () => ({
  useOperationalDocuments: () => ({
    rows: [
      {
        id: '1',
        name: 'CÃ³digo de proyectos DR',
        code: 'OP-001',
        description: 'Procedimiento operativo estÃ¡ndar',
        documentType: 'FORMATO',
        department: 'Contabilidad / NÃ³mina',
        extension: 'pdf',
        route: 'https://example.com',
        date: '2025-02-03',
        rawDate: '2025-02-03',
      },
      {
        id: '2',
        name: 'Lineamiento de seguridad',
        code: 'OP-002',
        description: 'Seguridad operativa',
        documentType: 'POLITICA',
        department: 'Operaciones',
        extension: 'pdf',
        route: 'https://example.com/politica',
        date: '2025-02-04',
        rawDate: '2025-02-04',
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
  DataTable: ({
    tables,
    onRefreshPage,
    actionsRender,
    showFilter,
    filterOptions,
    onFilterChange,
    dateKey,
  }: any) => (
    <div>
      <div>DataTable</div>
      <button type="button" onClick={onRefreshPage}>
        Actualizar
      </button>
      {showFilter &&
        filterOptions?.map((option: any) => (
          <button key={option.value} type="button" onClick={() => onFilterChange?.(option.value)}>
            {option.label}
          </button>
        ))}
      {actionsRender && actionsRender()}
      {[...(tables?.[0]?.data ?? [])]
        .sort((left: any, right: any) => {
          const leftDate = dateKey?.(left) ?? left.rawDate ?? left.date ?? ''
          const rightDate = dateKey?.(right) ?? right.rawDate ?? right.date ?? ''

          return String(rightDate).localeCompare(String(leftDate))
        })
        .map((row: any, index: number) => (
          <div key={row.id ?? index}>
            <span>{row.name}</span>
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
  usePathname: () => '/main-page/humanresources/documents/operationaldocuments',
}))

import OperationalDocuments from './page'

describe('OperationalDocuments page', () => {
  beforeEach(() => {
    deleteMock.mockClear()
    refreshMock.mockClear()
    pushMock.mockClear()
  })

  it('renders header and actions', () => {
    render(<OperationalDocuments />)

    expect(screen.getByText('DataTable')).toBeInTheDocument()
    expect(screen.getByText('Nuevo Documento')).toBeInTheDocument()
  })

  it('renders the most recent document first', () => {
    render(<OperationalDocuments />)

    const codes = screen.getAllByText(/OP-002|OP-001/)
    expect(codes[0]).toHaveTextContent('OP-002')
    expect(codes[1]).toHaveTextContent('OP-001')
  })

  it('calls refresh when clicking "Actualizar"', () => {
    render(<OperationalDocuments />)

    fireEvent.click(screen.getByText('Actualizar'))
    expect(refreshMock).toHaveBeenCalledTimes(1)
  })

  it('filters documents by document type', () => {
    render(<OperationalDocuments />)

    expect(screen.getByText('CÃ³digo de proyectos DR')).toBeInTheDocument()
    expect(screen.getByText('Lineamiento de seguridad')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'POLITICA' }))

    expect(screen.queryByText('CÃ³digo de proyectos DR')).not.toBeInTheDocument()
    expect(screen.getByText('Lineamiento de seguridad')).toBeInTheDocument()
  })

  it('navigates to the request document registry when creating a document', () => {
    render(<OperationalDocuments />)

    fireEvent.click(screen.getByRole('button', { name: 'Nuevo Documento' }))

    expect(pushMock).toHaveBeenCalledWith('/main-page/request/documents/documentregistry')
  })

  it('navigates to the request document registry when viewing a document', () => {
    render(<OperationalDocuments />)

    fireEvent.click(
      within(screen.getByTestId('actions-menu-1')).getByRole('button', {
        name: 'Ver detalles',
      }),
    )

    expect(pushMock).toHaveBeenCalledWith(
      '/main-page/request/documents/documentregistry?documentId=1',
    )
  })

  it('opens delete confirmation and deletes the selected document', async () => {
    deleteMock.mockResolvedValue(true)
    render(<OperationalDocuments />)

    fireEvent.click(
      within(screen.getByTestId('actions-menu-1')).getByRole('button', { name: 'Eliminar' }),
    )

    expect(screen.getByTestId('popup')).toBeInTheDocument()
    expect(
      screen.getByText('Esta acción confirmará la eliminación del documento seleccionado'),
    ).toBeInTheDocument()

    fireEvent.click(
      within(screen.getByTestId('popup')).getByRole('button', { name: 'Eliminar' }),
    )

    await waitFor(() => expect(deleteMock).toHaveBeenCalledWith('1'))
    await waitFor(() => expect(screen.queryByTestId('popup')).not.toBeInTheDocument())
  })
})
