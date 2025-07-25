// src/app/components/Button/Button.test.tsx
import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// --- Mocks para los SVGs que propagan className ---
vi.mock('@/assets/icons/navegacion/nav-arrow-right.svg', () => ({
  default: (props: any) => <svg data-testid="icon-right" {...props} />,
}))
vi.mock('@/assets/icons/navegacion/arrow-up.svg', () => ({
  default: (props: any) => <svg data-testid="icon-up" {...props} />,
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
    expect(icon).toHaveClass('ml-2')          // ahora pasará
    expect(icon).toHaveClass('transition-transform')
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
})
