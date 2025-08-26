import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

// Mocks de SVG
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
    render(<Select options={options} selected={[]} onChange={vi.fn()} label="Test Select" />)
    expect(screen.getByText('Test Select')).toBeInTheDocument()
    expect(screen.getByText('Select')).toBeInTheDocument()
    expect(screen.queryByText('Opción Uno')).toBeNull()
  })

  it('abre y cierra el menú al hacer click en el trigger (no disabled)', async () => {
    const user = userEvent.setup()
    render(<Select options={options} selected={[]} onChange={vi.fn()} />)

    await user.click(screen.getByText('Select'))
    expect(screen.getByText('Opción Uno')).toBeInTheDocument()
    expect(screen.getByText('Opción Dos')).toBeInTheDocument()

    // Cerrar
    await user.click(screen.getByText('Escribe para filtrar…')) // el trigger muestra este texto cuando está abierto
    expect(screen.queryByText('Opción Uno')).toBeNull()
  })

  it('single select llama onChange y cierra menú', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Select options={options} selected={[]} onChange={handleChange} />)

    await user.click(screen.getByText('Select'))
    // Seleccionar por onMouseDown (user.click incluye mouseDown)
    await user.click(screen.getByText('Opción Uno'))

    expect(handleChange).toHaveBeenCalledWith(['one'])
    expect(screen.queryByText('Opción Tres')).toBeNull() // menú cerrado
  })

  it('multiple select permite seleccionar y muestra contador y lista', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    const { rerender } = render(
      <Select options={options} selected={[]} onChange={handleChange} multiple />
    )

    await user.click(screen.getByText('Select'))
    await user.click(screen.getByText('Opción Uno'))
    expect(handleChange).toHaveBeenCalledWith(['one'])

    // Simular actualización de prop
    rerender(<Select options={options} selected={['one']} onChange={handleChange} multiple />)

    expect(screen.getByText('1 Opciones Seleccionadas')).toBeInTheDocument()
    expect(screen.getByText('Opciones: Opción Uno')).toBeInTheDocument()
  })

  it('no abre menú cuando está disabled', async () => {
    const user = userEvent.setup()
    render(<Select options={options} selected={[]} onChange={vi.fn()} disabled />)

    await user.click(screen.getByText('Select'))
    expect(screen.queryByText('Opción Uno')).toBeNull()
  })

  it('muestra helperText con clase según variante', () => {
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
    // OJO: esta aserción depende de tu `baseStyles`; mantenla si sabes el valor exacto
    expect(helper).toHaveClass('text-alert-red-100')
  })

  it('no permite seleccionar opciones deshabilitadas', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Select options={options} selected={[]} onChange={handleChange} />)

    await user.click(screen.getByText('Select'))
    await user.click(screen.getByText('Opción Dos'))
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('typeahead: abre con Enter, filtra por teclas y selecciona con Enter', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Select options={options} selected={[]} onChange={handleChange} />)

    // Focus en el trigger (div con tabIndex=0)
    await user.tab()
    // Abrir con Enter
    await user.keyboard('{Enter}')
    expect(screen.getByText('Escribe para filtrar…')).toBeInTheDocument()

    // Escribir "tres"
    await user.keyboard('tres')
    // Debe aparecer solo "Opción Tres"
    expect(screen.getByText('Opción Tres')).toBeInTheDocument()
    expect(screen.queryByText('Opción Uno')).toBeNull()

    // Seleccionar con Enter (single: el atajo toma la primera coincidencia)
    await user.keyboard('{Enter}')
    expect(handleChange).toHaveBeenCalledWith(['three'])
    expect(screen.queryByText('Opción Tres')).toBeNull() // cerrado
  })

  it('Escape limpia búsqueda primero y luego cierra', async () => {
    const user = userEvent.setup()
    render(<Select options={options} selected={[]} onChange={vi.fn()} />)

    await user.tab()
    await user.keyboard('{Enter}') // abrir
    await user.keyboard('uno')
    // Escape 1: limpia búsqueda
    await user.keyboard('{Escape}')
    expect(screen.getByText('Escribe para filtrar…')).toBeInTheDocument()
    // Escape 2: cierra
    await user.keyboard('{Escape}')
    expect(screen.queryByText('Opción Uno')).toBeNull()
  })
})
