import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PopUp } from './PopUp'

// Mock de íconos SVG
vi.mock('@/assets/icons/navegacion/nav-arrow-right.svg', () => ({
  default: (props: any) => <svg data-testid="icon-right" {...props} />,
}))
vi.mock('@/assets/icons/navegacion/arrow-up.svg', () => ({
  default: (props: any) => <svg data-testid="icon-up" {...props} />,
}))
vi.mock('@/assets/icons/acciones/cancel.svg', () => ({
  default: (props: any) => <svg data-testid="icon-cancel" {...props} />,
}))

describe('PopUp component', () => {
  it('renderiza título y contenido correctamente', () => {
    render(<PopUp open title="Título de prueba" content="Contenido de prueba" />)
    expect(screen.getByText('Título de prueba')).toBeInTheDocument()
    expect(screen.getByText('Contenido de prueba')).toBeInTheDocument()
  })

  it('renderiza botón de cierre (icon-cancel)', () => {
    render(<PopUp open onClose={() => {}} />)
    expect(screen.getByTestId('icon-cancel')).toBeInTheDocument()
  })

  it('renderiza botón primario con texto por defecto', () => {
    render(<PopUp open showPrimaryButton onPrimaryButtonClick={() => {}} />)
    expect(screen.getByRole('button', { name: /Aceptar/i })).toBeInTheDocument()
  })

  it('renderiza botón secundario con texto por defecto', () => {
    render(<PopUp open showSecondaryButton onSecondaryButtonClick={() => {}} />)
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument()
  })

  it('renderiza botones con texto personalizado', () => {
    render(
      <PopUp
        open
        showPrimaryButton
        showSecondaryButton
        primaryButtonText="Confirmar"
        secondaryButtonText="Volver"
        onPrimaryButtonClick={() => {}}
        onSecondaryButtonClick={() => {}}
      />
    )
    expect(screen.getByRole('button', { name: /Confirmar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Volver/i })).toBeInTheDocument()
  })

  it('dispara callback del botón primario al hacer click', () => {
    const handlePrimary = vi.fn()
    render(<PopUp open showPrimaryButton onPrimaryButtonClick={handlePrimary} />)
    fireEvent.click(screen.getByRole('button', { name: /Aceptar/i }))
    expect(handlePrimary).toHaveBeenCalledTimes(1)
  })

  it('dispara callback del botón secundario al hacer click', () => {
    const handleSecondary = vi.fn()
    render(
      <PopUp
        open
        showSecondaryButton
        onSecondaryButtonClick={handleSecondary}
        onClose={() => {}}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }))
    expect(handleSecondary).toHaveBeenCalledTimes(1)
  })

  it('renderiza contenido adicional como children', () => {
    render(
      <PopUp open>
        <div data-testid="custom-child">Contenido extra</div>
      </PopUp>
    )
    expect(screen.getByTestId('custom-child')).toBeInTheDocument()
    expect(screen.getByText('Contenido extra')).toBeInTheDocument()
  })
})
