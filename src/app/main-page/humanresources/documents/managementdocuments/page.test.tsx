import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

vi.mock('@/assets/icons/Docs/page.svg', () => ({
  __esModule: true,
  default: () => <svg data-testid="doc-star" />,
}))

vi.mock('@/app/main-page/humanresources/documents/components/DocumentActionsMenuCell', () => ({
  __esModule: true,
  default: () => <div data-testid="actions-menu" />,
}))

const refreshMock = vi.fn()

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
  }),
}))

vi.mock('@/app/components/DataTable/DataTable', () => ({
  DataTable: ({ actionsRender }: any) => (
    <div>
      DataTable
      {actionsRender && actionsRender()}
    </div>
  ),
}))

const pushMock = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}))

import ManagementDocuments from './page'

describe('ManagementDocuments page', () => {
  beforeEach(() => {
    refreshMock.mockClear()
    pushMock.mockClear()
  })

  it('renders table header and actions', () => {
    render(<ManagementDocuments />)

    expect(screen.getByText('Documentos Gerenciales')).toBeInTheDocument()
    expect(screen.getByText('DataTable')).toBeInTheDocument()
    expect(screen.getByText('Nuevo Documento')).toBeInTheDocument()
  })

  it('triggers refresh on button click', () => {
    render(<ManagementDocuments />)

    fireEvent.click(screen.getByText('Actualizar'))
    expect(refreshMock).toHaveBeenCalled()
  })
})
