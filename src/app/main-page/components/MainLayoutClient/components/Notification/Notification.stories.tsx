import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import Notification from './Notification';

const meta: Meta<typeof Notification> = {
  title: 'Components/Notification',
  component: Notification,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Notification>;

export const LightMode: Story = {
  args: {
    title: 'Solicitud de Vale Rosa',
    description: 'Notificacion de evento recibida',
    createdAt: new Date().toISOString(),
    actionLabel: 'Ir a evento',
  },
  decorators: [Story => <div data-theme="light"><Story /></div>],
};

export const DarkMode: Story = {
  args: {
    title: 'Solicitud de Vale Rosa',
    description: 'Notificacion de evento recibida',
    createdAt: new Date().toISOString(),
    actionLabel: 'Ir a evento',
  },
  decorators: [Story => <div data-theme="dark"><Story /></div>],
};
