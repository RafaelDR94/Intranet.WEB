import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { vi } from 'vitest';
import RequisitionsForm from './RequisitionsForm';

vi.mock('./hooks/useRequisitionsForm', () => ({
  useRequisitionForm: () => ({
    fields: [],
    loadingFormInfo: false,
    setFormReady: () => {},
    submitRef: { current: null },
    handleSubmit: () => {},
    onSubmit: () => {},
    buttonDisabled: false,
  }),
}));

const meta: Meta<typeof RequisitionsForm> = {
  title: 'MainPage/Accounting/Requisitions/RequisitionsForm',
  component: RequisitionsForm,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof RequisitionsForm>;

export const LightMode: Story = {
  args: { mode: 'create' },
  decorators: [Story => <div data-theme="light"><Story /></div>],
};

export const DarkMode: Story = {
  args: { mode: 'create' },
  decorators: [Story => <div data-theme="dark"><Story /></div>],
};
