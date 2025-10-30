import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { vi } from 'vitest';

import SideMenu from './SideMenu';

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ user: { fullName: 'User' }, currentPagePermissions: { canAddPicture: true, canAddDocuments: true, canSeeDetails: true } }),
}));
vi.mock('@/app/components/DetailsPanelLayout/DetailsPanelLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('../../invoices/components/TicketForm/TicketForm', () => ({
  __esModule: true,
  default: () => <div>TicketForm</div>,
}));
vi.mock('../../invoices/components/InvoicesForm/InvoicesForm', () => ({
  __esModule: true,
  default: () => <div>InvoicesForm</div>,
}));

const meta: Meta<typeof SideMenu> = {
  title: 'MainPage/Accounting/PersonalInvoices/SideMenu',
  component: SideMenu,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof SideMenu>;

const selected = { requisitionkey: 'R1', project: { name: 'Proj' }, status: 'Rechazado' } as any;

export const LightMode: Story = {
  args: { panelOpen: true, setPanelOpen: () => {}, selected },
  decorators: [(Story) => <div data-theme='light'><Story /></div>],
};

export const DarkMode: Story = {
  args: { panelOpen: true, setPanelOpen: () => {}, selected },
  decorators: [(Story) => <div data-theme='dark'><Story /></div>],
};
