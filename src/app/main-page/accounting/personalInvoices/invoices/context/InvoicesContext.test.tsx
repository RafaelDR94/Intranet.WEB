import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { InvoicesProvider, useInvoices } from './InvoicesContext';

let pathnameMock = '/';
let searchParamsMock = new URLSearchParams();
let authUserMock: { idEmployee?: string } | null = null;

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ user: authUserMock, currentPagePermissions: {} }),
}));
vi.mock('next/navigation', () => ({
  usePathname: () => pathnameMock,
  useSearchParams: () => ({ get: (key: string) => searchParamsMock.get(key) }),
}));
vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalAlert: { showAlert: vi.fn(), hideAlert: vi.fn() },
  }),
}));
vi.mock('@/app/stores/useRequisitionStore/useRequisitionStore', () => ({
  useRequisitionsStore: (sel: any) =>
    sel({
      requisitions: [],
      requisitionsError: null,
      warning: null,
      fetchRequisitionsByIdEmployee: vi.fn(),
      fetchRequisitions: vi.fn(),
      resetFlags: vi.fn(),
      reset: vi.fn(),
    }),
}));
vi.mock('@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore', () => ({
  useBillingDocumentsStore: (sel: any) =>
    sel({
      billingDocumentDescription: [],
      billingCategories: [],
      billingerror: null,
      fetchBillingDocumentCategories: vi.fn(),
      fetchBillingDocumentDescriptions: vi.fn(),
      resetFlags: vi.fn(),
    }),
}));
vi.mock('@/app/stores/useFormFieldsStore/useFormFieldsStore', () => {
  const state = {
    setFields: vi.fn(),
    updateField: vi.fn(),
    resetFields: vi.fn(),
    fieldsByFormId: {},
  };
  const hook: any = (selector: any) => selector(state);
  hook.getState = () => state;
  return { useFormFieldsStore: hook };
});

const TestComponent = () => {
  const ctx = useInvoices();
  return (
    <div>
      <span>{ctx.formId1}</span>
      <span data-testid="target-employee">{ctx.targetEmployeeId}</span>
    </div>
  );
};

describe('InvoicesContext', () => {
  it('provides default formId1', () => {
    pathnameMock = '/';
    searchParamsMock = new URLSearchParams();
    authUserMock = null;

    render(
      <InvoicesProvider>
        <TestComponent />
      </InvoicesProvider>,
    );

    expect(screen.getByText('invoices-form')).toBeInTheDocument();
  });

  it('uses idEmployee from query on accounting flows', () => {
    pathnameMock = '/main-page/accounting/personalInvoices/invoices';
    searchParamsMock = new URLSearchParams('idEmployee=query-employee');
    authUserMock = { idEmployee: 'auth-employee' };

    render(
      <InvoicesProvider>
        <TestComponent />
      </InvoicesProvider>,
    );

    expect(screen.getByTestId('target-employee')).toHaveTextContent('query-employee');
  });

  it('uses authenticated employee on request flows even if query idEmployee exists', () => {
    pathnameMock = '/main-page/request/ownrequisitions/uploadbillablefiles';
    searchParamsMock = new URLSearchParams('idEmployee=query-employee');
    authUserMock = { idEmployee: 'auth-employee' };

    render(
      <InvoicesProvider>
        <TestComponent />
      </InvoicesProvider>,
    );

    expect(screen.getByTestId('target-employee')).toHaveTextContent('auth-employee');
  });
});
