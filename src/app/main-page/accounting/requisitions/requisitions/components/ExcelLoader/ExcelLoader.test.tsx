import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import ExcelLoader from './ExcelLoader';

vi.mock('@/app/components/FormsLayout/FormsLayout', () => ({
  __esModule: true,
  default: ({ title, children, primaryLabel, onPrimaryClick, primaryDisabled }: any) => (
    <div>
      <h1>{title}</h1>
      <button disabled={primaryDisabled} onClick={onPrimaryClick}>
        {primaryLabel}
      </button>
      {children}
    </div>
  ),
}));

vi.mock('@/app/components/FileUploaderexpanded/FileUploaderExpanded', () => ({
  __esModule: true,
  default: ({ label, accept, onFile }: any) => (
    <div>
      <label htmlFor="file-input">{label}</label>
      <input id="file-input" data-testid="file-input" accept={accept} onChange={() => onFile(null)} />
    </div>
  ),
}));

vi.mock('./hooks/useExcelLoader', () => ({
  useExcelLoader: () => ({
    handleFile: vi.fn(),
    onSubmit: vi.fn(),
    buttonDisabled: false,
  }),
}));

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ currentPagePermissions: { addMultiple: true } }),
}));

describe('ExcelLoader component', () => {
  it('renders layout and file input', () => {
    render(<ExcelLoader />);
    expect(screen.getByText('Sube aquí tus requisiciones')).toBeInTheDocument();
    expect(screen.getByLabelText('Selecciona el archivo excel a subir')).toBeInTheDocument();
    expect(screen.getByTestId('file-input')).toHaveAttribute('accept', '.xlsx,.xls');
  });
});
