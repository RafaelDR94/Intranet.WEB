import { describe, it, expect, vi } from 'vitest';

import AddFilesPage from './page';

const redirect = vi.fn();

vi.mock('next/navigation', () => ({
  redirect: (...args: Parameters<typeof redirect>) => redirect(...args),
}));

describe('AddFiles page', () => {
  it('redirects to billable files page', () => {
    AddFilesPage();
    expect(redirect).toHaveBeenCalledWith(
      '/main-page/accounting/billablefiles/billablefiles',
    );
  });
});
