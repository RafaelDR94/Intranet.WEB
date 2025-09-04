// src/app/components/ToggleButton/ToggleButton.test.tsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ToggleButton } from './ToogleButton'

describe('ToggleButton component', () => {
  it('se renderiza desmarcado por defecto', () => {
    const handleChange = vi.fn()
    render(<ToggleButton checked={false} onChange={handleChange} />)

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement
    expect(checkbox.checked).toBe(false)

    const wrapperDiv = checkbox.parentElement as HTMLElement
    // estado unchecked usa bg-gray-10
    expect(wrapperDiv).toHaveClass('bg-gray-20')
    // el handle está al inicio
    const handleSpan = wrapperDiv.querySelector('span')!
    expect(handleSpan).toHaveClass('translate-x-0')
  })

  it('se renderiza marcado cuando checked=true', () => {
    const handleChange = vi.fn()
    render(<ToggleButton checked={true} onChange={handleChange} />)

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement
    expect(checkbox.checked).toBe(true)

    const wrapperDiv = checkbox.parentElement as HTMLElement
    // estado checked usa bg-green-90
    expect(wrapperDiv).toHaveClass('bg-green-90')
    const handleSpan = wrapperDiv.querySelector('span')!
    expect(handleSpan).toHaveClass('translate-x-[12px]')
  })

  it('llama a onChange al hacer click sobre el checkbox', () => {
    const handleChange = vi.fn()
    render(<ToggleButton checked={false} onChange={handleChange} />)

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement
    fireEvent.click(checkbox)
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('no llama a onChange y muestra estado disabled', () => {
    const handleChange = vi.fn()
    render(<ToggleButton checked={false} onChange={handleChange} disabled />)

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement
    expect(checkbox.disabled).toBe(true)

    const wrapperLabel = screen.getByRole('checkbox').closest('label')!
    expect(wrapperLabel).toHaveClass('cursor-not-allowed')

    fireEvent.click(checkbox)
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('renderiza la etiqueta y respeta labelPosition="left"', () => {
    render(
      <ToggleButton
        checked={false}
        onChange={() => {}}
        label="Mi Toggle"
        labelPosition="left"
      />
    )
    // el texto de la etiqueta aparece
    const labelEl = screen.getByText('Mi Toggle')
    expect(labelEl).toBeInTheDocument()

    // el wrapper del label debe tener clases de posición
    const wrapperLabel = labelEl.closest('label')!
    expect(wrapperLabel).toHaveClass(
      'flex-row-reverse',
      'space-x-reverse'
    )
  })
   it('aplica un color personalizado a la etiqueta', () => {
    render(
      <ToggleButton
        checked={false}
        onChange={() => {}}
        label="Color"
        labelColor="text-blue-100"
      />
    )
    const labelEl = screen.getByText('Color')
    expect(labelEl).toHaveClass('text-blue-100')
  })
})
