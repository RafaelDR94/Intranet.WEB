import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { vi } from 'vitest';

import DetailsPanel from './DetailsPanel';

vi.mock('./hooks/useDetailsPanel', () => ({
  useDetailsPanel: () => ({
    labels: { left: 'Usuario: Test', right: 'Código: Demo' },
    openRejectInvoice: false,
    openValidInvoice: false,
    setOpenRejectInvoice: () => {},
    setOpenValidInvoice: () => {},
    handleSubmitComment: () => {},
    handleSubmitReject: () => {},
    handleSubmitValid: () => {},
  }),
}));

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ currentPagePermissions: {} }),
}));

const meta: Meta<typeof DetailsPanel> = {
  title: 'MainPage/Accounting/Invoices/DetailsPanel',
  component: DetailsPanel,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof DetailsPanel>;

export const LightMode: Story = {
  args: {
    panelOpen: true,
    setPanelOpen: () => {},
    selected: null,
    rejectType: false,
    operations: false,
  },
  decorators: [(Story) => <div data-theme='light'><Story /></div>],
};

export const DarkMode: Story = {
  args: {
    panelOpen: true,
    setPanelOpen: () => {},
    selected: null,
    rejectType: false,
    operations: false,
  },
  decorators: [(Story) => <div data-theme='dark'><Story /></div>],
};

