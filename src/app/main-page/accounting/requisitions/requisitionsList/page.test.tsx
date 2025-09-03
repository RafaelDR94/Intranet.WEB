import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import RequisitionsList from './page'

vi.mock('./componentes/RequisitionsDetails/RequisitionDetails', () => ({
  __esModule: true,
  default: () => <div>details</div>,
}))

vi.mock('./componentes/RequisitionsTable/RequisitionsTable', () => ({
  __esModule: true,
  default: () => <div>table</div>,
}))

describe('RequisitionsList page', () => {
  it('renders details and table components', () => {
    render(<RequisitionsList />)
    expect(screen.getByText('details')).toBeInTheDocument()
    expect(screen.getByText('table')).toBeInTheDocument()
  })
})
