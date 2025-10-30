import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

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
  default: () => <div>DynamicFormMock</div>,
}));
vi.mock('@/app/components/FormsLayout/FormsLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ currentPagePermissions: { canAddDocuments: true } }),
}));

const matrix: any = { sm: [[10]] };

describe('InvoicesForm', () => {
  it('renders dynamic form', () => {
    render(<InvoicesForm responsiveLayoutMatrix={matrix} />);
    expect(screen.getByText('DynamicFormMock')).toBeInTheDocument();
  });
});
