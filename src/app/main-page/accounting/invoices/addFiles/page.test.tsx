import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AddFilesPage from './page';

vi.mock('./components/AddFIlesComponent/AddFilesComponent', () => ({
  __esModule: true,
  default: () => <div>AddFilesComponent</div>,
}));

vi.mock('./components/PicturesTable/PicturesTable', () => ({
  __esModule: true,
  default: () => <div>PicturesTable</div>,
}));

vi.mock('@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore', () => ({
  useBillingDocumentsStore: vi.fn().mockReturnValue({
    successPost: false,
  }),
}));

vi.mock('@/app/stores/useBillingImagesStore/useBillingImagesStore', () => ({
  useBillingImagesStore: vi.fn().mockReturnValue({
    fetchBillingImages: vi.fn(),
  }),
}));

describe('AddFiles page', () => {
  it('renders add files component and pictures table', () => {
    render(<AddFilesPage />);
    expect(screen.getByText('AddFilesComponent')).toBeInTheDocument();
    expect(screen.getByText('PicturesTable')).toBeInTheDocument();
  });
});
