import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import PreRequisitionsAuthorization from './PreRequisitionsAuthorization'
import type { PreRequisitionsAuthorizationProps } from './types'

const baseProps: PreRequisitionsAuthorizationProps = {
  title: 'Presupuesto de requisicion PY-SEMAR-014',
  fields: [
    { label: 'Empresa', value: 'DISITREK' },
    { label: 'Codigo de proyecto', value: 'PY-SEMAR-014' },
    { label: 'Estado', value: 'Monterrey' },
    { label: 'Motivo', value: 'Instalacion de sistema' },
    { label: 'Fecha Inicio', value: '10/05/2026', type: 'date' },
    { label: 'Fecha Termino', value: '15/05/2026', type: 'date' },
    { label: 'Personal asignado', value: 'Angel Vazquez' },
  ],
  collaborators: 'Bruno Mendoza',
  rows: [
    {
      id: 'car-rental',
      concept: 'Renta de automovil',
      nationalQuoted: 0,
      foreignQuoted: 0,
      people: 0,
      days: 0,
      subtotal: 0,
    },
    {
      id: 'bus',
      concept: 'Boleto de autobus',
      nationalQuoted: 600,
      foreignQuoted: 0,
      people: 2,
      days: 2,
      subtotal: 2400,
      observations: 'ida y vuelta',
    },
  ],
}

describe('PreRequisitionsAuthorization', () => {
  it('renderiza la informacion enviada por props', () => {
    render(<PreRequisitionsAuthorization {...baseProps} />)

    expect(screen.getByText('Presupuesto de requisicion PY-SEMAR-014')).toBeInTheDocument()
    expect(screen.getByText('DISITREK')).toBeInTheDocument()
    expect(screen.getByText('Colaboradores incluidos: Bruno Mendoza')).toBeInTheDocument()
    expect(screen.getByText('Boleto de autobus')).toBeInTheDocument()
    expect(screen.getAllByText('2,400').length).toBeGreaterThan(0)
  })

  it('ejecuta callbacks de aprobacion y rechazo', () => {
    const onApprove = vi.fn()
    const onReject = vi.fn()

    render(
      <PreRequisitionsAuthorization
        {...baseProps}
        onApprove={onApprove}
        onReject={onReject}
      />,
    )

    fireEvent.click(screen.getByText('Rechazar'))
    fireEvent.click(screen.getByText('Aprobar'))

    expect(onReject).toHaveBeenCalledTimes(1)
    expect(onApprove).toHaveBeenCalledTimes(1)
  })
})
