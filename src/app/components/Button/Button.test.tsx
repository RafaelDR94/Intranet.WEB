// src/app/components/Button/Button.test.tsx
import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, it, expect, vi } from 'vitest'

// --- Mocks para los SVGs que propagan className ---
vi.mock('@/assets/icons/navegacion/nav-arrow-right.svg', () => ({
  default: (props: any) => <svg data-testid="icon-right" {...props} />,
}))
vi.mock('@/assets/icons/navegacion/arrow-up.svg', () => ({
  default: (props: any) => <svg data-testid="icon-up" {...props} />,
}))
vi.mock('@/assets/icons/acciones/cancel.svg', () => ({
  default: (props: any) => <svg data-testid="icon-cancel" {...props} />,
}))

import { Button } from './Button'

describe('Button component', () => {
  it('se renderiza con las props por defecto', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByTestId('icon-right')).toBeInTheDocument()
  })

  it('muestra children y aplica margen al icono', () => {
    render(<Button>Prueba</Button>)
    expect(screen.getByText('Prueba')).toBeInTheDocument()
    const icon = screen.getByTestId('icon-right')
    expect(icon).toHaveClass('transition-transform')
  })

  it('renderiza ícono de cancelar cuando arrowDirection="cancel"', () => {
    render(<Button arrowDirection="cancel">Cancelar</Button>)
    expect(screen.getByTestId('icon-cancel')).toBeInTheDocument()
  })

  it('soporta diferentes variantes y tamaños', () => {
    render(<Button variant="outline" size="large">Hola</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toHaveClass('border-green-80')
    expect(btn).toHaveClass('px-5', 'py-2.5')
  })

  it('renderiza flecha hacia arriba cuando arrowDirection="up"', () => {
    render(<Button arrowDirection="up">Arriba</Button>)
    expect(screen.getByTestId('icon-up')).toBeInTheDocument()
  })

  it('soporta iconOnly sin children y sin margen', () => {
    render(<Button iconOnly>Ignored</Button>)
    const icon = screen.getByTestId('icon-right')
    expect(icon).not.toHaveClass('ml-2')
  })

  it('renderiza icono custom cuando se pasa prop icon', () => {
    const CustomIcon = (props: any) => <svg data-testid="custom-icon" {...props} />
    render(<Button icon={CustomIcon}>Texto</Button>)
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })
    it('propaga dataTestId al botón', () => {
    render(<Button dataTestId="btn1">Id</Button>)
    expect(screen.getByTestId('btn1')).toBeInTheDocument()
  })
    it('no renderiza el icono cuando hideIcon es true', () => {
    render(<Button hideIcon>Sin icono</Button>)
    expect(screen.queryByTestId('icon-right')).not.toBeInTheDocument()
  })
})
