import type { Meta, StoryObj } from '@storybook/react';
import { vi } from 'vitest';
import React from 'react';
import TicketForm from './TicketForm';

vi.mock('./hooks/useTicketForm', () => ({
  __esModule: true,
  default: () => ({
    fields: [],
    loadingFormInfo: false,
    submitRef: { current: null },
    formReady: true,
    setFormReady: vi.fn(),
    handleSubmit: vi.fn(),
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
  useAuth: () => ({ currentPagePermissions: { canAddPicture: true } }),
}));

const meta: Meta<typeof TicketForm> = {
  title: 'MainPage/Accounting/PersonalInvoices/TicketForm',
  component: TicketForm,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof TicketForm>;

export const LightMode: Story = {
  args: { responsiveLayoutMatrix: { sm: [[10]] } },
  decorators: [(Story) => <div data-theme='light'><Story /></div>],
};

export const DarkMode: Story = {
  args: { responsiveLayoutMatrix: { sm: [[10]] } },
  decorators: [(Story) => <div data-theme='dark'><Story /></div>],
};
