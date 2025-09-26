import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { vi } from 'vitest';

import VoucherBlue from './VoucherBlue';

vi.mock('./hooks/useVoucherBlue', () => ({
  useVoucherBlue: () => ({
    fields: [],
    loadingFormInfo: false,
    submitRef: { current: null },
    formReady: true,
    setFormReady: vi.fn(),
    handleSubmit: vi.fn(),
    onSubmit: vi.fn(),
    buttonDisabled: false,
    currentPagePermissions: { updaterequisitionForm: true },
    disableForm: false,
    setDisableForm: vi.fn(),
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
  useAuth: () => ({ currentPagePermissions: { updaterequisitionForm: true } }),
}));

const meta: Meta<typeof VoucherBlue> = {
  title: 'MainPage/Request/PettyCash/PettyCashRequest/VoucherBlue',
  component: VoucherBlue,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof VoucherBlue>;

export const LightMode: Story = {
  args: { responsiveLayoutMatrix: { sm: [[10]] } },
  decorators: [(Story) => <div data-theme='light'><Story /></div>],
};

export const DarkMode: Story = {
  args: { responsiveLayoutMatrix: { sm: [[10]] } },
  decorators: [(Story) => <div data-theme='dark'><Story /></div>],
};
