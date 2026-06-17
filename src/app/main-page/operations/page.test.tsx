import { render } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import OperationsPage from './page';

Object.assign(globalThis, { React });

const PermissionRedirect = vi.hoisted(() =>
  vi.fn(() => <div>PermissionRedirect</div>),
);

vi.mock('@/app/components/PermissionRedirect/PermissionRedirect', () => ({
  PermissionRedirect,
}));

describe('OperationsPage', () => {
  it('passes operations routes to PermissionRedirect', () => {
    render(<OperationsPage />);

    expect(PermissionRedirect).toHaveBeenCalledWith(
      expect.objectContaining({
        routes: [
          '/main-page/operations/requisitions',
          '/main-page/operations/documentshistory',
        ],
      }),
      undefined,
    );
  });
});
