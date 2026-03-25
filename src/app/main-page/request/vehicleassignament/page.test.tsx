import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import VehicleAssignamentPage from './page'

(globalThis as any).React = React

const handleRefresh = vi.fn()
const handleOpenDetails = vi.fn()
const handleCloseDetails = vi.fn()

const useVehicleAssignamentPageReturn = {
  inTransitRows: [
    {
      id: '1',
      driver: 'Alice',
      status: 'En transito',
      departureSort: 10,
      assignment: { vehicleassignments_id: 'A1' },
    },
  ],
  otherRows: [
    {
      id: '2',
      driver: 'Bob',
      status: 'Finalizado',
      departureSort: 5,
      assignment: { vehicleassignments_id: 'A2' },
    },
  ],
  loading: false,
  handleRefresh,
  searchableKeys: ['driver'],
  handleOpenDetails,
  handleCloseDetails,
  openDetailsPanel: true,
}

vi.mock('./hooks/useVehicleAssignamentPage', () => ({
  __esModule: true,
  default: vi.fn(() => useVehicleAssignamentPageReturn),
}))

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ user: { idEmployee: 'E1' } }),
}))

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalAlert: { showAlert: vi.fn() },
    usePrincipalLoading: { showSpinner: vi.fn(), hideSpinner: vi.fn() },
    usePrincipalImage: { showImage: vi.fn() },
    usePrincipalTheme: {},
  }),
}))

vi.mock('@/app/components/DataTable/DataTable', () => {
  const React = require('react')
  return {
    __esModule: true,
    DataTable: ({ tables, onRefreshPage, onTableActionClick }: any) => {
      const table = tables?.[0]
      const rows =
        table?.data?.map((row: any, index: number) =>
          React.createElement(
            'div',
            { key: `${row.id}-${index}` },
            table.columns?.map((column: any) =>
              column.render ? column.render(row) : null
            )
          )
        ) ?? []

      return React.createElement(
        'div',
        { 'data-testid': `datatable-${table?.title}` },
        React.createElement(
          'button',
          {
            type: 'button',
            'data-testid': `refresh-${table?.title}`,
            onClick: () => onRefreshPage?.(),
          },
          'refresh'
        ),
        onTableActionClick
          ? React.createElement(
              'button',
              {
                type: 'button',
                'data-testid': `action-${table?.title}`,
                onClick: () => onTableActionClick?.(),
              },
              'action'
            )
          : null,
        rows
      )
    },
  }
})

vi.mock('@/app/components/Button/Button', () => {
  const React = require('react')
  return {
    __esModule: true,
    Button: ({ children, onClick, hideIcon: _hideIcon }: any) =>
      React.createElement(
        'button',
        { type: 'button', 'data-testid': `button-${children}`, onClick },
        children
      ),
  }
})

vi.mock('@/app/components/Label/Label', () => {
  const React = require('react')
  return {
    __esModule: true,
    default: ({ text }: any) =>
      React.createElement('span', { 'data-testid': `label-${text}` }, text),
  }
})

vi.mock(
  '@/app/main-page/generalservices/vehicleregist/vehicleregistrylist/components/RegistDetails.tsx/RegistDetails',
  () => {
  const React = require('react')
  return {
    __esModule: true,
    default: ({ open, onClose }: { open: boolean; onClose: () => void }) =>
      React.createElement(
        'div',
        { 'data-testid': `regist-details-${String(open)}` },
        React.createElement(
          'button',
          {
            type: 'button',
            'data-testid': 'close-panel',
            onClick: onClose,
          },
          'close'
        )
      ),
  }
})

describe('VehicleAssignamentPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders tables but without create and arrive actions', () => {
    render(<VehicleAssignamentPage />)

    expect(screen.getByTestId('datatable-Registro Vehicular en Transito')).toBeInTheDocument()
    expect(screen.getByTestId('datatable-Registro Vehicular')).toBeInTheDocument()
    expect(screen.queryByTestId('action-Registro Vehicular')).toBeNull()
    expect(screen.queryByTestId('button-Llegada')).toBeNull()
  })

  it('still allows opening details', () => {
    render(<VehicleAssignamentPage />)

    const [firstOpenButton] = screen.getAllByTestId('button-Ver Más')
    fireEvent.click(firstOpenButton)
    expect(handleOpenDetails).toHaveBeenCalledWith(
      useVehicleAssignamentPageReturn.inTransitRows[0].assignment
    )

    fireEvent.click(screen.getByTestId('close-panel'))
    expect(handleCloseDetails).toHaveBeenCalled()
  })
})
