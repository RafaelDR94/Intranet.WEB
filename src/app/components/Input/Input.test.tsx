import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
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
    expect(input).toHaveClass('border-gray-70', 'placeholder-gray-70')

    rerender(
      <Input label="A" variant="filled" placeholder="p" />
    )
    input = screen.getByPlaceholderText('p')
    expect(input).toHaveClass('border-gray-70', 'placeholder-gray-70')
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
  it('propaga dataTestId al contenedor', () => {
    render(<Input label="Nombre" dataTestId="input1" />)
    expect(screen.getByTestId('input1-container')).toBeInTheDocument()
  })
   it('renderiza un icono personalizado y maneja onIconClick', () => {
    const handleIconClick = vi.fn()
    const Icon = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="mock-icon" {...props} />
    render(
      <Input label="Buscar" icon={Icon} onIconClick={handleIconClick} />
    )
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(handleIconClick).toHaveBeenCalled()
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument()
  })

  it('alterna la visibilidad en inputs de tipo password', () => {
    render(
      <Input label="Clave" placeholder="clave" type="password" />
    )
    const input = screen.getByPlaceholderText('clave') as HTMLInputElement
    expect(input.type).toBe('password')
    const toggle = screen.getByRole('button')
    fireEvent.click(toggle)
    expect(input.type).toBe('text')
  })
})
describe('Input component (extras)', () => {
  it('renderiza un textarea cuando as="textarea" y respeta rows', () => {
    render(<Input as="textarea" label="Comentarios" placeholder="Escribe algo" rows={6} />)
    const el = screen.getByPlaceholderText('Escribe algo') as HTMLTextAreaElement
    expect(el).toBeInTheDocument()
    expect(el.tagName).toBe('TEXTAREA')
    expect(el).toHaveAttribute('aria-multiline', 'true')
    expect(el.rows).toBe(6)
  })

  it('usa rows=4 por defecto en textarea cuando no se especifica', () => {
    render(<Input as="textarea" label="Notas" placeholder="Notas" />)
    const el = screen.getByPlaceholderText('Notas') as HTMLTextAreaElement
    expect(el.rows).toBe(4) // default del componente
  })

  it('aplica clases específicas de textarea (altura/overflow sin resize)', () => {
    render(<Input as="textarea" label="Detalle" placeholder="Detalle" />)
    const el = screen.getByPlaceholderText('Detalle')
    // textareaClasses añade estas utilidades
    expect(el).toHaveClass('min-h-20')
    expect(el).toHaveClass('overflow-y-auto')
    expect(el).toHaveClass('resize-none')
  })


  it('deshabilita por prop disabled sin requerir variant="disabled"', () => {
    render(<Input label="Campo" placeholder="x" disabled />)
    const el = screen.getByPlaceholderText('x')
    expect(el).toBeDisabled()
  })

  it('aplica className adicional al control', () => {
    render(<Input placeholder="extra" className="ring-1 ring-inset" />)
    const el = screen.getByPlaceholderText('extra')
    expect(el).toHaveClass('ring-1', 'ring-inset')
  })

  it('renderiza icono + password: hay dos botones (icono y toggle), y ambos funcionan', () => {
    const onIconClick = vi.fn()
    const Icon = (p: React.SVGProps<SVGSVGElement>) => <svg data-testid="mock" {...p} />
    render(<Input label="Clave" placeholder="pwd" type="password" icon={Icon} onIconClick={onIconClick} />)

    const input = screen.getByPlaceholderText('pwd') as HTMLInputElement
    // 1) botón del icono personalizado
    // 2) botón del eye toggle
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBe(2)

    // clic al icono personalizado
    fireEvent.click(buttons[0])
    expect(onIconClick).toHaveBeenCalled()

    // toggle de password
    expect(input.type).toBe('password')
    fireEvent.click(buttons[1])
    expect(input.type).toBe('text')
  })

  it('icono sin onIconClick no revienta al hacer click', () => {
    const Icon = (p: React.SVGProps<SVGSVGElement>) => <svg data-testid="ico" {...p} />
    render(<Input label="Buscar" icon={Icon} />)
    const btn = screen.getByRole('button')
    expect(() => fireEvent.click(btn)).not.toThrow()
    expect(screen.getByTestId('ico')).toBeInTheDocument()
  })

  it('helperText pinta el color correcto por variante (success, info, warning)', () => {
    const table: Array<[variant: 'success'|'info'|'warning', expectedClass: string]> = [
      ['success', 'text-alert-green-100'],
      ['info',    'text-alert-blue-100'],
      ['warning', 'text-alert-yellow-100'],
    ]
    for (const [variant, klass] of table) {
      render(<Input label="Estado" helperText={`ht-${variant}`} variant={variant} />)
      const helper = screen.getByText(`ht-${variant}`)
      expect(helper).toHaveClass(klass)
    }
  })
})
