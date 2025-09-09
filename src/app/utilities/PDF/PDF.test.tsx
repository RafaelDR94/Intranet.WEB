import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { CreatePDF } from './PDF';
import type { FullDocument } from './types';

vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:test') } as any);

vi.mock('@react-pdf/renderer', () => ({
  pdf: () => ({ toBlob: async () => new Blob(['test']) }),
  Document: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Page: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Text: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  View: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Image: () => null,
  Font: { register: vi.fn() },
  StyleSheet: { create: (s: unknown) => s },
}));

describe('CreatePDF utility', () => {
  it('generates a blob URL and calls setter', async () => {
    const setPDF = vi.fn();
    const data: FullDocument = { pages: [{ title: 'Test', elements: [] }] };
    await CreatePDF(data, setPDF);
    expect(setPDF).toHaveBeenCalledWith('blob:test');
  });
});
