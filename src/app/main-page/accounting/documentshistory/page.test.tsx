import { render } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import AccountingDocumentsHistoryPage from './page';

Object.assign(globalThis, { React });

const DocumentHistory = vi.hoisted(() =>
  vi.fn(() => <div>DocumentHistory</div>),
);

vi.mock('@/app/shared/documentshistory/DocumentHistory', () => ({
  default: DocumentHistory,
}));

describe('AccountingDocumentsHistoryPage', () => {
  it('renders the shared document history screen with accounting scope', () => {
    render(<AccountingDocumentsHistoryPage />);

    expect(DocumentHistory).toHaveBeenCalledWith(
      expect.objectContaining({ scope: 'accounting' }),
      undefined,
    );
  });
});
