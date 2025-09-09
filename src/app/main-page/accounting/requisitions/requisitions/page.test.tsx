import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import Requisitions from './page';

vi.mock('./components/ExcelLoader/ExcelLoader', () => ({
  __esModule: true,
  default: () => <div>Excel</div>,
}));

vi.mock('../components/RequisitionsForm/RequisitionsForm', () => ({
  __esModule: true,
  default: () => <div>Form</div>,
}));

describe('Requisitions page', () => {
  it('renders excel loader and form', () => {
    render(<Requisitions />);
    expect(screen.getByText('Excel')).toBeInTheDocument();
    expect(screen.getByText('Form')).toBeInTheDocument();
  });
});
