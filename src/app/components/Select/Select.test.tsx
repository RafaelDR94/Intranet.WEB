import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// Mocks de los SVGs
vi.mock('@/assets/icons/navegacion/nav-arrow-down.svg', () => ({
  default: (props: any) => <svg data-testid="chevron-down" {...props} />,
}))
vi.mock('@/assets/icons/navegacion/nav-arrow-up.svg', () => ({
  default: (props: any) => <svg data-testid="chevron-up" {...props} />,
}))
vi.mock('@/assets/icons/acciones/check.svg', () => ({
  default: (props: any) => <svg data-testid="check-icon" {...props} />,
}))

import { Select } from './Select'
import { SelectOption } from './types'

describe('Select component', () => {
  const options: SelectOption[] = [
    { label: 'Opción Uno', value: 'one' },
    { label: 'Opción Dos', value: 'two', disabled: true },
    { label: 'Opción Tres', value: 'three' },
  ]

  it('renderiza label y placeholder, menú cerrado inicialmente', () => {
    render(
      <Select
        options={options}
        selected={[]}
        onChange={vi.fn()}
        label="Test Select"
      />
    )
    expect(screen.getByText('Test Select')).toBeInTheDocument()
    expect(screen.getByText('Select')).toBeInTheDocument()
    // El menú no debe estar visible
    expect(screen.queryByText('Opción Uno')).toBeNull()
  })

  it('abre y cierra el menú al hacer click en el trigger (no disabled)', () => {
    render(
      <Select
        options={options}
        selected={[]}
        onChange={vi.fn()}
      />
    )
    // Abrir
    fireEvent.click(screen.getByText('Select'))
    expect(screen.getByText('Opción Uno')).toBeInTheDocument()
    expect(screen.getByText('Opción Dos')).toBeInTheDocument()
    // Cerrar
    fireEvent.click(screen.getByText('Select'))
    expect(screen.queryByText('Opción Uno')).toBeNull()
  })

  it('single select llama onChange y cierra menú', () => {
    const handleChange = vi.fn()
    render(
      <Select
        options={options}
        selected={[]}
        onChange={handleChange}
      />
    )
    // Abrir menú
    fireEvent.click(screen.getByText('Select'))
    // Seleccionar la primera opción
    fireEvent.click(screen.getByText('Opción Uno'))
    expect(handleChange).toHaveBeenCalledWith(['one'])
    // Tras selección, el menú se cierra
    expect(screen.queryByText('Opción Tres')).toBeNull()
  })

  it('multiple select permite seleccionar y muestra contador y lista', () => {
    const handleChange = vi.fn()
    const { rerender } = render(
      <Select
        options={options}
        selected={[]}
        onChange={handleChange}
        multiple
      />
    )
    // Abrir menú
    fireEvent.click(screen.getByText('Select'))
    // Seleccionar 'one'
    fireEvent.click(screen.getByText('Opción Uno'))
    expect(handleChange).toHaveBeenCalledWith(['one'])
    // Simular que el prop selected se actualiza
    rerender(
      <Select
        options={options}
        selected={['one']}
        onChange={handleChange}
        multiple
      />
    )
    // Ahora muestra el contador
    expect(screen.getByText('1 Opciones Seleccionadas')).toBeInTheDocument()
    // Muestra listado de etiquetas
    expect(screen.getByText('Opciones: Opción Uno')).toBeInTheDocument()
  })

  it('no abre menú cuando está disabled', () => {
    const handleChange = vi.fn()
    render(
      <Select
        options={options}
        selected={[]}
        onChange={handleChange}
        disabled
      />
    )
    // Intento de abrir
    fireEvent.click(screen.getByText('Select'))
    // Menú sigue cerrado
    expect(screen.queryByText('Opción Uno')).toBeNull()
  })

  it('muestra helperText con color según variante', () => {
    render(
      <Select
        options={options}
        selected={[]}
        onChange={vi.fn()}
        helperText="Ayuda"
        variant="error"
      />
    )
    const helper = screen.getByText('Ayuda')
    expect(helper).toBeInTheDocument()
    expect(helper).toHaveClass('text-alert-red-100')
  })
})
