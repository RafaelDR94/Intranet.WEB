import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/assets/icons/Docs/page.svg', () => ({
  __esModule: true,
  default: () => <svg data-testid="doc-star" />,
}))

vi.mock('@/app/main-page/humanresources/documents/components/DocumentActionsMenuCell', () => ({
  __esModule: true,
  default: () => <div data-testid="actions-menu" />,
}))

const refreshMock = vi.fn()

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

import OperationalDocuments from './page'

describe('OperationalDocuments page', () => {
  beforeEach(() => {
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
})
