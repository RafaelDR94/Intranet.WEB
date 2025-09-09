import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import AddFilesComponent from './AddFilesComponent';

vi.mock('@/app/main-page/accounting/personalInvoices/invoices/context/InvoicesContext', () => ({
  InvoicesProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="provider">{children}</div>,
}));

vi.mock('@/app/main-page/accounting/personalInvoices/invoices/components/InvoicesForm/InvoicesForm', () => ({
  __esModule: true,
  default: ({ onCloseImage }: { onCloseImage: () => void }) => (
    <div>
      <span>InvoicesFormMock</span>
      <button onClick={onCloseImage}>close</button>
    </div>
  ),
}));

describe('AddFilesComponent', () => {
  it('renderiza el formulario y maneja cierre de imagen', () => {
    const setSelectedPictures = vi.fn();
    render(<AddFilesComponent billingImages={null} setSelectedPictures={setSelectedPictures} />);
    expect(screen.getByText('InvoicesFormMock')).toBeInTheDocument();
    fireEvent.click(screen.getByText('close'));
    expect(setSelectedPictures).toHaveBeenCalledWith(null);
  });
});

