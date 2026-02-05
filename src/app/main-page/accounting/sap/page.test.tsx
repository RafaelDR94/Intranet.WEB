import { render } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import SapPage from './page';

Object.assign(globalThis, { React });

const PermissionRedirect = vi.hoisted(() =>
  vi.fn(() => <div>PermissionRedirect</div>),
);

vi.mock('@/app/components/PermissionRedirect/PermissionRedirect', () => ({
  PermissionRedirect,
}));

describe('SapPage', () => {
  it('passes SAP routes to PermissionRedirect', () => {
    render(<SapPage />);

    expect(PermissionRedirect).toHaveBeenCalledWith(
      expect.objectContaining({
        routes: [
          '/main-page/accounting/sap/administration',
          '/main-page/accounting/sap/operations',
        ],
      }),
      undefined,
    );
  });
});
