import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useValidateInvoices } from './useValidateInvoices';

const fetchBillingDocuments = vi.fn();
const validateBillingDocument = vi.fn();
const useSearchParamsMock = vi.fn(
  () => new URLSearchParams('idEmployee=emp-1'),
);
const usePathnameMock = vi.fn(
  () => '/main-page/accounting/invoices/validateinvoices',
);
const useRouterMock = vi.fn(() => ({ replace: vi.fn(), push: vi.fn() }));

vi.mock('next/navigation', () => ({
  useSearchParams: () => useSearchParamsMock(),
  usePathname: () => usePathnameMock(),
  useRouter: () => useRouterMock(),
}));

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalAlert: { showAlert: vi.fn() },
    usePrincipalLoading: { showSpinner: vi.fn(), hideSpinner: vi.fn() },
  }),
}));

vi.mock('@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore', () => ({
  useBillingDocumentsStore: (selector: any) =>
    selector({
      billingDocuments: [],
      billingDocumentnotToday: [],
      loading: false,
      validating: false,
      succesValidate: false,
      fetchBillingDocuments,
      error: null,
      resetFlags: vi.fn(),
      validateBillingDocument,
      sendToSapBillingDocument: vi.fn(),
      sending: false,
      succesSend: false,
    }),
}));

describe('useValidateInvoices', () => {
  it('fetches documents with employee filter and validates multiple rows', () => {
    const { result } = renderHook(() => useValidateInvoices());

    expect(fetchBillingDocuments).toHaveBeenCalledWith(true, {
      filterValue: '5',
      idEmployee: 'emp-1',
    });

    act(() => {
      result.current.handleMultiSelectt1(0, [{ billingdocument_id: '1' } as any]);
      result.current.handleMultiSelectt2(0, [{ billingdocument_id: '2' } as any]);
    });

    act(() => {
      result.current.handleMultiValidate();
    });

    expect(validateBillingDocument).toHaveBeenCalledWith(['1', '2']);
  });
});
