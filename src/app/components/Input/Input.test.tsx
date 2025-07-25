import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Input } from './Input'

describe('Input component', () => {
  it('renderiza label y input asociados', () => {
    render(<Input label="Nombre" placeholder="Ingresa tu nombre" />)
    // Label
    expect(screen.getByText('Nombre')).toBeInTheDocument()
    // Input por placeholder
    const input = screen.getByPlaceholderText('Ingresa tu nombre')
    expect(input).toBeInTheDocument()
    expect((input as HTMLInputElement).type).toBe('text')
  })

  it('muestra helperText con la clase de color correspondiente al variant', () => {
    render(
      <Input
        label="Email"
        helperText="Formato inválido"
        variant="error"
      />
    )
    const helper = screen.getByText('Formato inválido')
    expect(helper).toBeInTheDocument()
    expect(helper).toHaveClass('text-alert-red-100')
  })

  it('aplica clases de tamaño md y lg correctamente', () => {
    const { rerender } = render(
      <Input label="Campo" inputSize="md" />
    )
    let input = screen.getByRole('textbox')
    expect(input).toHaveClass('text-sm', 'py-2')

    rerender(
      <Input label="Campo" inputSize="lg" />
    )
    input = screen.getByRole('textbox')
    expect(input).toHaveClass('text-base', 'py-3')
  })

  it('aplica las clases de variante default y filled', () => {
    const { rerender } = render(
      <Input label="A" variant="default" placeholder="p" />
    )
    let input = screen.getByPlaceholderText('p')
    expect(input).toHaveClass('border-gray-30', 'placeholder-gray-60')

    rerender(
      <Input label="A" variant="filled" placeholder="p" />
    )
    input = screen.getByPlaceholderText('p')
    expect(input).toHaveClass('border-gray-30', 'placeholder-black-100')
  })

  it('deshabilita el input y aplica clases de disabled', () => {
    render(
      <Input
        label="X"
        variant="disabled"
        placeholder="p"
      />
    )
    const input = screen.getByPlaceholderText('p')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('cursor-not-allowed', 'bg-gray-20')
  })

  it('llama a onChange al modificar su valor', () => {
    const handleChange = vi.fn()
    render(
      <Input
        label="Test"
        placeholder="test"
        onChange={handleChange}
        variant="default"
      />
    )
    const input = screen.getByPlaceholderText('test') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'hola' } })
    expect(handleChange).toHaveBeenCalled()
    expect(input.value).toBe('hola')
  })
})
