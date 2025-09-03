import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
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
  default: () => <div>DynamicFormMock</div>,
}));
vi.mock('@/app/components/FormsLayout/FormsLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ currentPagePermissions: { canAddPicture: true } }),
}));

const matrix: any = { sm: [[10]] };

describe('TicketForm', () => {
  it('renders dynamic form', () => {
    render(<TicketForm responsiveLayoutMatrix={matrix} />);
    expect(screen.getByText('DynamicFormMock')).toBeInTheDocument();
  });
});
