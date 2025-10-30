import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { useValidateInvoices } from './useValidateInvoices';

const fetchBillingDocuments = vi.fn();
const validateBillingDocument = vi.fn();

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
    }),
}));

describe('useValidateInvoices', () => {
  it('fetches documents and valida múltiple', () => {
    const { result } = renderHook(() => useValidateInvoices());
    expect(fetchBillingDocuments).toHaveBeenCalledWith(true);
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

