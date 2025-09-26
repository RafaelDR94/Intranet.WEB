import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { InvoicesProvider, useInvoices } from './InvoicesContext';

vi.mock('@/app/context/AuthContext/AuthContext', () => ({ useAuth: () => ({ user: null, currentPagePermissions: {} }) }));
vi.mock('next/navigation', () => ({ usePathname: () => '/' }));
vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({ usePrincipal: () => ({ usePrincipalAlert: { showAlert: vi.fn(), hideAlert: vi.fn() } }) }));
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
  const state = { setFields: vi.fn(), updateField: vi.fn(), resetFields: vi.fn(), fieldsByFormId: {} };
  const hook: any = (selector: any) => selector(state);
  hook.getState = () => state;
  return { useFormFieldsStore: hook };
});

const TestComponent = () => {
  const ctx = useInvoices();
  return <div>{ctx.formId1}</div>;
};

describe('InvoicesContext', () => {
  it('provides default formId1', () => {
    render(
      <InvoicesProvider>
        <TestComponent />
      </InvoicesProvider>
    );
    expect(screen.getByText('invoices-form')).toBeInTheDocument();
  });
});
