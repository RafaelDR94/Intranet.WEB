import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import useSAT from './useSAT';

const fetchSatBillingDocument = vi.fn();
const completeProcessToSAP = vi.fn();

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalAlert: { showAlert: vi.fn() },
    usePrincipalLoading: { showSpinner: vi.fn(), hideSpinner: vi.fn() },
  }),
}));

vi.mock('@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore', () => ({
  useBillingDocumentsStore: (selector: any) =>
    selector({
      billingDocumentsBadCode: [],
      billingDocumentsValid: [],
      billingDocumentsNotValid: [],
      billingDocumentsEfos: [],
      loadigSat: false,
      resetFlags: vi.fn(),
      fetchSatBillingDocument,
      error: null,
    }),
}));

vi.mock('@/app/stores/useBillingCompleteProcessToSAPStore/useBillingCompleteProcessToSAPStore', () => ({
  useBillingCompleteProcessToSAPStore: (selector: any) =>
    selector({
      sending: false,
      success: false,
      completeProcessToSAP,
      error: null,
      resetFlags: vi.fn(),
    }),
}));

describe('useSAT', () => {
  it('fetches billing documents on mount and envía a SAP', () => {
    const { result } = renderHook(() => useSAT());
    expect(fetchSatBillingDocument).toHaveBeenCalledWith(true);
    act(() => {
      result.current.handleMultiSelect([{ billingdocument_id: '1' } as any]);
    });
    act(() => {
      result.current.handleSendToSap();
    });
    expect(completeProcessToSAP).toHaveBeenCalledWith(['1']);
  });
});

