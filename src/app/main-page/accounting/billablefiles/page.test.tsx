import { render } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import BillableFilesPage from './page';

Object.assign(globalThis, { React });

const PermissionRedirect = vi.hoisted(() =>
  vi.fn(() => <div>PermissionRedirect</div>),
);

vi.mock('@/app/components/PermissionRedirect/PermissionRedirect', () => ({
  PermissionRedirect,
}));

describe('BillableFilesPage', () => {
  it('passes billable files routes to PermissionRedirect', () => {
    render(<BillableFilesPage />);

    expect(PermissionRedirect).toHaveBeenCalledWith(
      expect.objectContaining({
        routes: ['/main-page/accounting/billablefiles/billablefiles'],
      }),
      undefined,
    );
  });
});
