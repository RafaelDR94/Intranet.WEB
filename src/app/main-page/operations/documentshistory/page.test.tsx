import { render } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import OperationsDocumentsHistoryPage from './page';

Object.assign(globalThis, { React });

const DocumentHistory = vi.hoisted(() =>
  vi.fn(() => <div>DocumentHistory</div>),
);

vi.mock('@/app/shared/documentshistory/DocumentHistory', () => ({
  default: DocumentHistory,
}));

describe('OperationsDocumentsHistoryPage', () => {
  it('renders the shared document history screen with operations scope', () => {
    render(<OperationsDocumentsHistoryPage />);

    expect(DocumentHistory).toHaveBeenCalledWith(
      expect.objectContaining({ scope: 'operations' }),
      undefined,
    );
  });
});
