import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import PreRequisitionsAuthorization from './PreRequisitionsAuthorization'

const meta: Meta<typeof PreRequisitionsAuthorization> = {
  title:
    'MainPage/Authorizations/AuthorizationDetail/RequisitionsAuthorization/PreRequisitionsAuthorization',
  component: PreRequisitionsAuthorization,
  tags: ['autodocs'],
  args: {
    title: 'Presupuesto de requisicion',
    fields: [
      { label: 'Empresa', value: 'DISITREK' },
      { label: 'Codigo de proyecto', value: 'PY-SEMAR-014' },
      { label: 'Estado', value: 'Monterrey' },
      { label: 'Motivo', value: 'Instalacion de sistema' },
      { label: 'Fecha Inicio', value: '10/05/2026', type: 'date' },
      { label: 'Fecha Termino', value: '15/05/2026', type: 'date' },
      { label: 'Personal asignado', value: 'Angel Vazquez' },
    ],
    collaborators: 'Bruno Mendoza',
    rows: [
      {
        id: 'car-rental',
        concept: 'Renta de automovil',
        nationalQuoted: 0,
        foreignQuoted: 0,
        people: 0,
        days: 0,
        subtotal: 0,
      },
      {
        id: 'bus-ticket',
        concept: 'Boleto de autobus',
        nationalQuoted: 600,
        foreignQuoted: 0,
        people: 2,
        days: 2,
        subtotal: 2400,
        observations: 'ida y vuelta',
      },
      {
        id: 'food',
        concept: 'Alimentos',
        nationalQuoted: 200,
        foreignQuoted: 0,
        people: 2,
        days: 5,
        subtotal: 6000,
        observations: 'Tres comidas al dia',
      },
      {
        id: 'hotel',
        concept: 'Hotel (habitacion doble)',
        nationalQuoted: 1000,
        foreignQuoted: 0,
        people: 2,
        days: 5,
        subtotal: 4000,
        observations: '5 dias 4 noches',
      },
    ],
    subtotal: 7000,
    total: 7500,
  },
  decorators: [
    (Story, context) => (
      <div data-theme={context.globals.theme ?? 'light'} className="bg-gray-10 p-4">
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof PreRequisitionsAuthorization>

export const Light: Story = {}

export const Dark: Story = {
  decorators: [
    (Story) => (
      <div data-theme="dark" className="bg-gray-10 p-4">
        <Story />
      </div>
    ),
  ],
}
