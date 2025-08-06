// src/app/components/DynamicForm/DynamicForm.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { DynamicForm } from './DynamicForm'
import { FieldModel } from './types'
// --- MOCK de TODOS los SVGs que se importan a lo largo del formulario ---
vi.mock('@/assets/icons/navegacion/nav-arrow-down.svg',    () => ({ default: () => <svg data-testid="icon" /> }))
vi.mock('@/assets/icons/navegacion/nav-arrow-up.svg',      () => ({ default: () => <svg data-testid="icon" /> }))
vi.mock('@/assets/icons/acciones/check.svg',               () => ({ default: () => <svg data-testid="icon" /> }))
vi.mock('@/assets/icons/acciones/info-empty.svg',          () => ({ default: () => <svg data-testid="icon" /> }))
vi.mock('@/assets/icons/organization/star.svg',            () => ({ default: () => <svg data-testid="icon" /> }))
vi.mock('@/assets/icons/bussines/high-priority.svg',       () => ({ default: () => <svg data-testid="icon" /> }))
vi.mock('@/assets/icons/acciones/upload.svg',              () => ({ default: () => <svg data-testid="icon" /> }))
// SVGs del Button
vi.mock('@/assets/icons/navegacion/nav-arrow-right.svg',   () => ({ default: () => <svg data-testid="icon" /> }))
vi.mock('@/assets/icons/navegacion/arrow-up.svg',          () => ({ default: () => <svg data-testid="icon" /> }))

// Helper para inicializar y capturar los callbacks
function renderForm(fields: FieldModel[], extraProps = {}) {
  const onSubmit    = vi.fn()
  const onSecondary = vi.fn()
  render(
    <DynamicForm
      fields={fields}
      onSubmit={onSubmit}
      secondaryButtonLabel="Sec"
      showSecondaryButtonIf={() => true}
      onSecondaryButtonClick={onSecondary}
      {...extraProps}
    />
  )
  return { onSubmit, onSecondary }
}

describe('DynamicForm', () => {
  it('renderiza título y valida campo required', async () => {
    const fields: FieldModel[] = [
      {
        type: 'input',
        name: 'name',
        label: 'Nombre',
        placeholder: 'Escribe nombre',
        value: '',
        validations: [{ type: 'required' }],
      },
    ]
    const { onSubmit } = renderForm(fields, { title: 'Mi Form' })

    // 1) Título y campo
    expect(screen.getByText('Mi Form')).toBeInTheDocument()
    const input = screen.getByPlaceholderText('Escribe nombre')
    expect(input).toBeInTheDocument()

    // 2) Intentar enviar sin valor => muestra error
    fireEvent.click(screen.getByText('Submit'))
    await waitFor(() =>
      expect(screen.getByText('Este campo es requerido')).toBeInTheDocument()
    )

    // 3) Rellenar y enviar => onSubmit con { name: 'Juan' }
    await userEvent.type(input, 'Juan')
    fireEvent.click(screen.getByText('Submit'))
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({ name: 'Juan' })
    )
  })

  it('muestra y oculta campo con showIf', async () => {
    const fields: FieldModel[] = [
      { type: 'toggle', name: 'toggle', label: 'Mostrar', value: false },
      {
        type: 'input',
        name: 'secret',
        label: 'Secreto',
        value: '',
        showIf: (vals) => vals.toggle === true,
      },
    ]
    const { onSubmit } = renderForm(fields)

    // Al principio no debe verse Secreto
    expect(screen.queryByText('Secreto')).toBeNull()

    // Hacer click en toggle
    const toggleCheckbox = screen.getByRole('checkbox', { name: 'Mostrar' })
    fireEvent.click(toggleCheckbox)

    // Ahora aparece la etiqueta "Secreto"
    await waitFor(() =>
      expect(screen.getByText('Secreto')).toBeInTheDocument()
    )
    // Encontrar el textbox que corresponde al campo "Secreto"
    const secretInput = screen.getByRole('textbox')
    await userEvent.type(secretInput, 'abc')

    // Envío
    fireEvent.click(screen.getByText('Submit'))
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({ toggle: true, secret: 'abc' })
    )
  })

  it('dispara el botón secundario con valores actuales', async () => {
    const fields: FieldModel[] = [
      { type: 'input', name: 'foo', label: 'Foo', value: 'x' },
    ]
    const { onSecondary } = renderForm(fields)

    // El botón secundario "Sec" debe existir y llamar con { foo: 'x' }
    const secBtn = screen.getByText('Sec')
    fireEvent.click(secBtn)
    await waitFor(() =>
      expect(onSecondary).toHaveBeenCalledWith({ foo: 'x' })
    )
  })

  it('maneja campo de archivo con validación required', async () => {
    const fields: FieldModel[] = [
      {
        type: 'file',
        name: 'doc',
        label: 'Subir archivo',
        value: null,
        accept: '.txt',
        validations: [{ type: 'required' }],
      },
    ]
    const { onSubmit } = renderForm(fields)

    fireEvent.click(screen.getByText('Submit'))
    await waitFor(() =>
      expect(screen.getByText('Este campo es requerido')).toBeInTheDocument()
    )

    const file = new File(['contenido'], 'test.txt', { type: 'text/plain' })
    const fileInput = screen
      .getByText('Subir archivo')
      .closest('div')?.querySelector('input') as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [file] } })

    fireEvent.click(screen.getByText('Submit'))
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({ doc: file })
    )
  })

  it('permite enviar el formulario desde un botón externo', async () => {
    const fields: FieldModel[] = [
      { type: 'input', name: 'foo', label: 'Foo', value: '' },
    ]
    const onSubmit = vi.fn()
   const submitRef = React.createRef<() => void | Promise<any>>()

    render(
      <>
        <DynamicForm
          fields={fields}
          onSubmit={onSubmit}
          showSubmitIf={() => false}
          externalSubmitRef={submitRef}
        />
        <button onClick={() => submitRef.current?.()}>Enviar</button>
      </>
    )

    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'bar')

    fireEvent.click(screen.getByText('Enviar'))
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({ foo: 'bar' })
    )
  })
})
