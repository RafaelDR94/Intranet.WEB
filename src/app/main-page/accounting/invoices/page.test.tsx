import { render } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import InvoicesPage from './page';

Object.assign(globalThis, { React });

const PermissionRedirect = vi.hoisted(() =>
  vi.fn(() => <div>PermissionRedirect</div>),
);

vi.mock('@/app/components/PermissionRedirect/PermissionRedirect', () => ({
  PermissionRedirect,
}));

describe('InvoicesPage', () => {
  it('passes invoice routes to PermissionRedirect', () => {
    render(<InvoicesPage />);

    expect(PermissionRedirect).toHaveBeenCalledWith(
      expect.objectContaining({
        routes: [
          '/main-page/accounting/invoices/validateinvoices',
          '/main-page/accounting/invoices/nondeductibles',
          '/main-page/accounting/invoices/sat',
        ],
      }),
      undefined,
    );
  });
});
