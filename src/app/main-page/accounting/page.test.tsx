import { render } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import AccountingPage from './page';

Object.assign(globalThis, { React });

const PermissionRedirect = vi.hoisted(() =>
  vi.fn(() => <div>PermissionRedirect</div>),
);

vi.mock('@/app/components/PermissionRedirect/PermissionRedirect', () => ({
  PermissionRedirect,
}));

describe('AccountingPage', () => {
  it('passes accounting routes to PermissionRedirect', () => {
    render(<AccountingPage />);

    expect(PermissionRedirect).toHaveBeenCalledWith(
      expect.objectContaining({
        routes: [
          '/main-page/accounting/invoices',
          '/main-page/accounting/personalInvoices',
          '/main-page/accounting/requisitions',
          '/main-page/accounting/sap',
          '/main-page/accounting/billablefiles',
        ],
      }),
      undefined,
    );
  });
});
