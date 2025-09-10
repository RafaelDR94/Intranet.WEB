import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { describe, it, expect, vi } from 'vitest'

import { Checkbox } from './CheckBox'

describe('Checkbox component', () => {
    it('se renderiza desmarcado e indiferente por defecto', () => {
        const { container } = render(
            <Checkbox checked={false} onChange={vi.fn()} name="chk1" />
        )
        const checkbox = screen.getByRole('checkbox') as HTMLInputElement
        expect(checkbox.checked).toBe(false)
        expect(checkbox.indeterminate).toBe(false)
        expect(container.querySelector('svg')).toBeNull()
        expect(container.querySelector('.bg-current')).toBeNull()
    })

    it('muestra el estado checked con el SVG de checkmark', () => {
        const { container } = render(
            <Checkbox checked={true} onChange={vi.fn()} name="chk2" />
        )
        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).toBeChecked()
        // Debe aparecer un <svg> dentro del contenedor
        expect(container.querySelector('svg')).not.toBeNull()
    })

    it('muestra el estado indeterminate con el indicador apropiado', () => {
        render(
            <Checkbox
                checked={false}
                indeterminate={true}
                onChange={vi.fn()}
                name="chk3"
            />
        )
        const checkbox = screen.getByRole('checkbox') as HTMLInputElement
        expect(checkbox.indeterminate).toBe(true)
        expect(screen.getByRole('checkbox').closest('div')?.querySelector('.bg-current')).not.toBeNull()
    })


    it('aplica el estado disabled correctamente', () => {
        const { container } = render(
            <Checkbox
                checked={false}
                disabled={true}
                onChange={vi.fn()}
                name="chk4"
            />
        )
        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).toBeDisabled()
        // La capa del div debe tener cursor-not-allowed
        const wrapperDiv = container.querySelector('div')
        expect(wrapperDiv).toHaveClass('cursor-not-allowed')
    })

    it('llama a onChange con el valor correcto al hacer click', () => {
        const handleChange = vi.fn()
        render(
            <Checkbox
                checked={false}
                onChange={handleChange}
                name="chk5"
            />
        )
        const checkbox = screen.getByRole('checkbox')
        fireEvent.click(checkbox)
        // Al hacer click sobre un unchecked pasa a true
        expect(handleChange).toHaveBeenCalledWith(true)
    })

    it('muestra la etiqueta y respeta labelPosition="left"', () => {
        render(
            <Checkbox
                checked={false}
                onChange={vi.fn()}
                name="chk6"
                label="Mi etiqueta"
                labelPosition="left"
            />
        )
        const labelEl = screen.getByText('Mi etiqueta').closest('label')
        expect(labelEl).toHaveClass('flex-row-reverse', 'space-x-reverse')
    })

  it('asigna correctamente el atributo name al input', () => {
        render(
            <Checkbox
                checked={false}
                onChange={vi.fn()}
                name="nombreCheckbox"
            />
        )
        const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('name', 'nombreCheckbox')
  })

    it('propaga dataTestId al contenedor', () => {
        render(
            <Checkbox
                checked={false}
                onChange={vi.fn()}
                name="chk7"
                dataTestId="chk7"
            />
        )
        expect(screen.getByTestId('chk7')).toBeInTheDocument()
    })
})
