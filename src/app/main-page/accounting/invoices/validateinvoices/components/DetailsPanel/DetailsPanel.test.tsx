import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import DetailsPanel from './DetailsPanel';

vi.mock('./hooks/useDetailsPanel', () => ({
  useDetailsPanel: () => ({
    labels: { left: 'Usuario: Test', right: 'Código: Demo' },
    openRejectInvoice: false,
    openValidInvoice: false,
    setOpenRejectInvoice: vi.fn(),
    setOpenValidInvoice: vi.fn(),
    handleSubmitComment: vi.fn(),
    handleUpdateJsonSapItem: vi.fn(),
    handleSubmitReject: vi.fn(),
    handleSubmitValid: vi.fn(),
  }),
}));

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ currentPagePermissions: {} }),
}));

vi.mock('@/app/components/DetailsPanelLayout/DetailsPanelLayout', () => ({
  __esModule: true,
  default: ({ leftLabel, rightLabel, children }: any) => (
    <div>
      <span>{leftLabel}</span>
      <span>{rightLabel}</span>
      {children}
    </div>
  ),
}));

describe('DetailsPanel', () => {
  it('muestra labels del panel', () => {
    const setPanelOpen = vi.fn();
    render(
      <DetailsPanel
        panelOpen
        setPanelOpen={setPanelOpen}
        selected={null}
        rejectType={false}
        operations={false}
      />
    );
    expect(screen.getByText('Usuario: Test')).toBeInTheDocument();
    expect(screen.getByText('Código: Demo')).toBeInTheDocument();
  });
});

