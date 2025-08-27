import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/app/components/FormsLayout/FormsLayout', () => ({
  __esModule: true,
  default: ({ title, primaryLabel, primaryDisabled, onPrimaryClick, showSecondaryButton, secondaryLabel, onSecondaryClick, children }: any) => (
    <div>
      <h1>{title}</h1>
      <button disabled={primaryDisabled} onClick={onPrimaryClick}>{primaryLabel}</button>
      {showSecondaryButton && <button onClick={onSecondaryClick}>{secondaryLabel}</button>}
      {children}
    </div>
  ),
}));

vi.mock('@/app/components/DynamicForm/DynamicForm', () => ({
  __esModule: true,
  default: () => <div>DynamicForm</div>,
}));

const mockHook = {
  fields: [],
  loadingFormInfo: false,
  setFormReady: vi.fn(),
  submitRef: { current: null },
  handleSubmit: vi.fn(),
  onSubmit: vi.fn(),
  buttonDisabled: false,
  currentPagePermissions: {
    requisitionForm: true,
  },
};

vi.mock('./hooks/useRequisitionsForm', () => ({
  useRequisitionForm: vi.fn(() => mockHook),
}));

import RequisitionsForm from './RequisitionsForm';

describe('RequisitionsForm', () => {
  it('renders create form title', () => {
    render(<RequisitionsForm />);
    expect(screen.getByText('Solicitud de Requisiciones')).toBeInTheDocument();
    expect(screen.getByText('Guardar')).toBeInTheDocument();
  });

  it('calls onClose when cancel clicked in edit mode', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<RequisitionsForm mode="edit" onClose={onClose} />);
    const btn = screen.getByText('Cancelar');
    await user.click(btn);
    expect(onClose).toHaveBeenCalled();
  });
});
