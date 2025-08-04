// src/app/components/Alert/Alert.test.tsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// Mock de SVGs
vi.mock('@/assets/icons/acciones/info-empty.svg', () => ({
  default: () => <svg data-testid="icon-info" />,
}))
vi.mock('@/assets/icons/organization/star.svg', () => ({
  default: () => <svg data-testid="icon-success" />,
}))
vi.mock('@/assets/icons/bussines/high-priority.svg', () => ({
  default: () => <svg data-testid="icon-warning" />,
}))

import { Alert } from './Alert'

describe('Alert component', () => {
  const baseProps = {
    title: 'Título de prueba',
    description: 'Descripción de prueba',
    onPrimaryClick: vi.fn(),
    onSecondaryClick: vi.fn(),
  }

  it('renderiza título y descripción', () => {
    render(<Alert {...baseProps} />)
    expect(screen.getByText('Título de prueba')).toBeInTheDocument()
    expect(screen.getByText('Descripción de prueba')).toBeInTheDocument()
  })

  it('muestra icono y clases por defecto (default filled)', () => {
    const { container } = render(<Alert {...baseProps} />)
    // Icono default
    expect(screen.getByTestId('icon-info')).toBeInTheDocument()

    // El root container es el primer hijo de `container`
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveClass('bg-turquoise-20', 'border border-turquoise-100')
  })

  it('aplica clases para type="success" variant="subtle"', () => {
    const { container } = render(
      <Alert {...baseProps} type="success" variant="subtle" />
    )
    // Icono success
    expect(screen.getByTestId('icon-success')).toBeInTheDocument()

    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveClass('bg-alert-green-10', 'border-alert-green-100')
  })

  it('renderiza y dispara callbacks de botones con labels personalizados', () => {
    render(
      <Alert
        {...baseProps}
        primaryLabel="Aceptar"
        secondaryLabel="Cancelar"
      />
    )
    const btnPrimary = screen.getByRole('button', { name: 'Aceptar' })
    const btnSecondary = screen.getByRole('button', { name: 'Cancelar' })
    fireEvent.click(btnPrimary)
    fireEvent.click(btnSecondary)
    expect(baseProps.onPrimaryClick).toHaveBeenCalled()
    expect(baseProps.onSecondaryClick).toHaveBeenCalled()
  })

  it('oculta botón primario cuando showPrimaryButton=false y viceversa', () => {
    const { rerender } = render(
      <Alert
        {...baseProps}
        primaryLabel="P"
        secondaryLabel="S"
        showPrimaryButton={false}
        showSecondaryButton={true}
      />
    )
    expect(screen.queryByRole('button', { name: 'P' })).toBeNull()
    expect(screen.getByRole('button', { name: 'S' })).toBeInTheDocument()

    rerender(
      <Alert
        {...baseProps}
        primaryLabel="P2"
        secondaryLabel="S2"
        showPrimaryButton={true}
        showSecondaryButton={false}
      />
    )
    expect(screen.getByRole('button', { name: 'P2' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'S2' })).toBeNull()
  })
})
