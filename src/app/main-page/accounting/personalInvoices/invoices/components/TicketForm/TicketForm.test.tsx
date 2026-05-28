import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, it, expect, vi } from 'vitest'

import TicketForm from './TicketForm'

const DynamicFormMock = vi.hoisted(() => vi.fn(() => <div>DynamicFormMock</div>))
const FormsLayoutMock = vi.hoisted(() =>
  vi.fn(({ children }: { children: React.ReactNode }) => <div>{children}</div>),
)

vi.mock('./hooks/useTicketForm', () => ({
  __esModule: true,
  default: () => ({
    fields: [
      {
        type: 'imageUploaderExpanded',
        name: 'ticket',
        label: 'Imagen del ticket (JPG o PNG)',
        placeholder: 'placeholder original',
        buttonLabel: 'Seleccionar imagen',
        value: [],
      },
    ],
    formKey: 0,
    loadingFormInfo: false,
    submitRef: { current: null },
    formReady: true,
    setFormReady: vi.fn(),
    handleSubmit: vi.fn(),
  }),
}))
vi.mock('@/app/components/DynamicForm/DynamicForm', () => ({
  __esModule: true,
  default: DynamicFormMock,
}))
vi.mock('@/app/components/FormsLayout/FormsLayout', () => ({
  __esModule: true,
  default: FormsLayoutMock,
}))
vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ currentPagePermissions: { canAddPicture: false } }),
}))

const matrix: any = { sm: [[10]] }

describe('TicketForm', () => {
  it('renders dynamic form', () => {
    render(<TicketForm responsiveLayoutMatrix={matrix} />)
    expect(screen.getByText('DynamicFormMock')).toBeInTheDocument()
  })

  it('applies upload copy overrides to the ticket field', () => {
    render(
      <TicketForm
        responsiveLayoutMatrix={matrix}
        uploadFieldLabel="Imagenes de los tickets (JPG o PNG)"
        uploadFieldPlaceholder="o arrastra/selecciona las imagenes que deseas subir"
        uploadFieldButtonLabel="Seleccionar tickets"
        layoutTitle="Carga de tickets"
        layoutPrimaryLabel="Guardar tickets"
      />,
    )

    expect(FormsLayoutMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Carga de tickets',
        primaryLabel: 'Guardar tickets',
      }),
      undefined,
    )
    expect(DynamicFormMock).toHaveBeenCalledWith(
      expect.objectContaining({
        fields: [
          expect.objectContaining({
            name: 'ticket',
            label: 'Imagenes de los tickets (JPG o PNG)',
            placeholder: 'o arrastra/selecciona las imagenes que deseas subir',
            buttonLabel: 'Seleccionar tickets',
          }),
        ],
      }),
      undefined,
    )
  })

  it('prepends an inline readonly employee field when requested', () => {
    render(
      <TicketForm
        responsiveLayoutMatrix={matrix}
        showInlineEmployeeName
        inlineEmployeeNameValue="SUPER"
      />,
    )

    expect(DynamicFormMock).toHaveBeenCalledWith(
      expect.objectContaining({
        fields: [
          expect.objectContaining({
            name: 'debtorName',
            label: 'Nombre',
            onlyText: true,
            value: 'SUPER',
          }),
          expect.objectContaining({
            name: 'ticket',
          }),
        ],
      }),
      undefined,
    )
  })
})
