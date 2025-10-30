import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import VoucherPink from './VoucherPink';

vi.mock('./hooks/useVoucherPink', () => ({
  useVoucherPink: () => ({
    fields: [],
    loadingFormInfo: false,
    setFormReady: vi.fn(),
    submitRef: { current: null },
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
  default: () => <div>DynamicFormMock</div>,
}));

vi.mock('@/app/components/FormsLayout/FormsLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('VoucherPink', () => {
  it('renders dynamic form', () => {
    render(<VoucherPink />);
    expect(screen.getByText('DynamicFormMock')).toBeInTheDocument();
  });
});