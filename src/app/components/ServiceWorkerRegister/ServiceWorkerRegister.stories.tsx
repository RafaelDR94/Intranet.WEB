import type { Meta, StoryObj } from '@storybook/react'

import { ServiceWorkerRegister } from './ServiceWorkerRegister'

const meta: Meta<typeof ServiceWorkerRegister> = {
  title: 'Components/ServiceWorkerRegister',
  component: ServiceWorkerRegister,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Registra un service worker para habilitar funcionalidades PWA.',
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof ServiceWorkerRegister>

export const LightMode: Story = {
  render: () => (
    <div data-theme="light" style={{ backgroundColor: 'var(--color-gray-10)', padding: '1rem' }}>
      <ServiceWorkerRegister />
      <span>Service worker registered</span>
    </div>
  ),
}

export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" style={{ backgroundColor: 'var(--color-gray-10)', padding: '1rem' }}>
      <ServiceWorkerRegister />
      <span>Service worker registered</span>
    </div>
  ),
}
