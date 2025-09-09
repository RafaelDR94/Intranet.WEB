import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import PictureTable from './PicturesTable';

const mockHook = vi.fn();

vi.mock('@/app/components/DataTable/DataTable', () => ({
  DataTable: ({ children }: any) => <div>DataTable{children}</div>,
}));

vi.mock('@/app/components/Spinner/Spinner', () => ({
  Spinner: () => <div role='status'>loading</div>,
}));

vi.mock('./usePictureTable', () => ({
  __esModule: true,
  default: () => mockHook(),
}));

describe('PictureTable', () => {
  it('muestra spinner cuando está cargando', () => {
    mockHook.mockReturnValue({
      loading: true,
      opePicture: vi.fn(),
      isMobile: false,
      billingImages: [],
      setOpenRejectPicture: vi.fn(),
      openRejectPicture: { state: false, row: null },
      handleSubmitReject: vi.fn(),
      hideImage: vi.fn(),
      currentPagePermissions: { canLinkImage: true, canAddDocuments: true, canSeeTicketsList: true },
    });
    render(<PictureTable setSelectedPictures={vi.fn()} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renderiza la tabla cuando no está cargando', () => {
    mockHook.mockReturnValue({
      loading: false,
      opePicture: vi.fn(),
      isMobile: false,
      billingImages: [],
      setOpenRejectPicture: vi.fn(),
      openRejectPicture: { state: false, row: null },
      handleSubmitReject: vi.fn(),
      hideImage: vi.fn(),
      currentPagePermissions: { canLinkImage: true, canAddDocuments: true, canSeeTicketsList: true },
    });
    render(<PictureTable setSelectedPictures={vi.fn()} />);
    expect(screen.getByText('DataTable')).toBeInTheDocument();
  });
});

