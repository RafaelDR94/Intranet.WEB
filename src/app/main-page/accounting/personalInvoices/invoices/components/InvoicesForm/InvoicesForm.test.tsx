import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import InvoicesForm from './InvoicesForm';

import type { ResponsiveLayoutMatrix } from '@/app/components/DynamicForm/types';

const DynamicFormMock = vi.hoisted(() => vi.fn(() => <div>DynamicFormMock</div>));
const FormsLayoutMock = vi.hoisted(() =>
  vi.fn(({ children }: { children: React.ReactNode }) => <div>{children}</div>),
);

vi.mock('./hooks/useInvoicesForm', () => ({
  __esModule: true,
  default: () => ({
    fields: [],
    formVersion: 3,
    loadingFormInfo: false,
    submitRef: { current: null },
    formReady: true,
    setFormReady: vi.fn(),
    handleSubmit: vi.fn(),
    ResetForm: vi.fn(),
    handleImageClick: vi.fn(),
  }),
}));
vi.mock('@/app/components/DynamicForm/DynamicForm', () => ({
  __esModule: true,
  default: DynamicFormMock,
}));
vi.mock('@/app/components/FormsLayout/FormsLayout', () => ({
  __esModule: true,
  default: FormsLayoutMock,
}));
vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ currentPagePermissions: { canAddDocuments: true } }),
}));

const matrix: ResponsiveLayoutMatrix = { sm: [[10]] };

describe('InvoicesForm', () => {
  it('renders dynamic form', () => {
    render(<InvoicesForm responsiveLayoutMatrix={matrix} />);
    expect(screen.getByText('DynamicFormMock')).toBeInTheDocument();
    expect(DynamicFormMock).toHaveBeenCalledWith(
      expect.objectContaining({
        valuesVersion: 3,
        valuesVersionActive: true,
      }),
      undefined,
    );
  });

  it('supports shared layout title and header content overrides', () => {
    render(
      <InvoicesForm
        responsiveLayoutMatrix={matrix}
        layoutTitle="Sube aqui tus archivos"
        layoutPrimaryLabel="Enviar Archivos"
        headerContent={<div>HeaderContentMock</div>}
      />,
    );

    expect(FormsLayoutMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Sube aqui tus archivos',
        primaryLabel: 'Enviar Archivos',
      }),
      undefined,
    );
    expect(screen.getByText('HeaderContentMock')).toBeInTheDocument();
    expect(DynamicFormMock).toHaveBeenCalled();
  });
});
