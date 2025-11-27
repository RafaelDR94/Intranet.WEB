// src/app/components/Alert/Alert.test.tsx
import { render, screen, fireEvent,act } from '@testing-library/react'
import React from 'react'
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

  it('cierra la alerta al hacer clic cuando closeOnClick=true', () => {
    const onClose = vi.fn()
    const { container } = render(
      <Alert
        {...baseProps}
        autoCloseMs={0}
        onClose={onClose}
        closeOnClick
      />
    )

    const root = container.firstElementChild as HTMLElement
    fireEvent.click(root)

    expect(onClose).toHaveBeenCalledTimes(1)
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
describe('Alert autocierre', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })



  it('no se cierra si no se provee autoCloseMs', () => {
    render(<Alert title="Persistente" description="Sin autocierre" />)

    act(() => {
      vi.advanceTimersByTime(10_000)
    })

    expect(screen.getByText('Persistente')).toBeInTheDocument()
  })


  it('si se desmonta antes de vencer, no llama onClose', () => {
    const onClose = vi.fn()
    const { unmount } = render(
      <Alert
        title="Desmontar"
        description="Antes de tiempo"
        autoCloseMs={2000}
        onClose={onClose}
      />
    )

    act(() => {
      vi.advanceTimersByTime(500)
    })
    unmount()

    // Avanza el resto del tiempo, pero ya no debería llamar
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(onClose).not.toHaveBeenCalled()
  })
})

describe('Alert iconos adicionales', () => {
  it('muestra el ícono/indicador para type="warning"', () => {
    render(<Alert title="W" description="D" type="warning" />)
    expect(screen.getByTestId('icon-warning')).toBeInTheDocument()
  })

  it('muestra el indicador 🔔 para type="notification"', () => {
    render(<Alert title="N" description="D" type="notification" />)
    expect(screen.getByText('🔔')).toBeInTheDocument()
  })
})
