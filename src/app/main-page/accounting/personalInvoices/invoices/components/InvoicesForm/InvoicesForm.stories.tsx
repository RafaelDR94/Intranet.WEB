import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { vi } from 'vitest';

import InvoicesForm from './InvoicesForm';

vi.mock('./hooks/useInvoicesForm', () => ({
  __esModule: true,
  default: () => ({
    fields: [],
    loadingFormInfo: false,
    submitRef: { current: null },
    formReady: true,
    setFormReady: vi.fn(),
    handleSubmit: vi.fn(),
    ResetForm: vi.fn(),
    handleImageClick: vi.fn(),
  }),
}));
vi.mock('@/app/components/DynamicForm/DynamicForm', () => ({
  __esModule: true,
  default: () => <div>DynamicForm</div>,
}));
vi.mock('@/app/components/FormsLayout/FormsLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ currentPagePermissions: { canAddDocuments: true } }),
}));

const meta: Meta<typeof InvoicesForm> = {
  title: 'MainPage/Accounting/PersonalInvoices/InvoicesForm',
  component: InvoicesForm,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof InvoicesForm>;

export const LightMode: Story = {
  args: { responsiveLayoutMatrix: { sm: [[10]] } },
  decorators: [(Story) => <div data-theme='light'><Story /></div>],
};

export const DarkMode: Story = {
  args: { responsiveLayoutMatrix: { sm: [[10]] } },
  decorators: [(Story) => <div data-theme='dark'><Story /></div>],
};
