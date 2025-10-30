import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { vi } from 'vitest';

import AddFilesComponent from './AddFilesComponent';

vi.mock('@/app/main-page/accounting/personalInvoices/invoices/context/InvoicesContext', () => ({
  InvoicesProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/app/main-page/accounting/personalInvoices/invoices/components/InvoicesForm/InvoicesForm', () => ({
  __esModule: true,
  default: () => <div>InvoicesForm</div>,
}));

const meta: Meta<typeof AddFilesComponent> = {
  title: 'MainPage/Accounting/Invoices/AddFilesComponent',
  component: AddFilesComponent,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof AddFilesComponent>;

export const LightMode: Story = {
  args: { billingImages: null, setSelectedPictures: () => {} },
  decorators: [(Story) => <div data-theme='light'><Story /></div>],
};

export const DarkMode: Story = {
  args: { billingImages: null, setSelectedPictures: () => {} },
  decorators: [(Story) => <div data-theme='dark'><Story /></div>],
};

