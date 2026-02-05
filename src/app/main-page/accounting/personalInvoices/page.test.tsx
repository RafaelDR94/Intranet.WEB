import { render } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import PersonalInvoicesPage from './page';

Object.assign(globalThis, { React });

const PermissionRedirect = vi.hoisted(() =>
  vi.fn(() => <div>PermissionRedirect</div>),
);

vi.mock('@/app/components/PermissionRedirect/PermissionRedirect', () => ({
  PermissionRedirect,
}));

describe('PersonalInvoicesPage', () => {
  it('passes personal invoices routes to PermissionRedirect', () => {
    render(<PersonalInvoicesPage />);

    expect(PermissionRedirect).toHaveBeenCalledWith(
      expect.objectContaining({
        routes: ['/main-page/accounting/personalInvoices/requisitions'],
      }),
      undefined,
    );
  });
});
