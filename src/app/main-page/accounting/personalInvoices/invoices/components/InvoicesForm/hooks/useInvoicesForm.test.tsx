import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

const uploadFile = vi.fn().mockResolvedValue('url');
vi.mock('@/app/context/FirebaseContext/FirebaseContext', () => ({
  useFirebase: () => ({ firebasestorage: { uploadFile } }),
}));
vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalLoading: { showSpinner: vi.fn(), hideSpinner: vi.fn() },
    usePrincipalAlert: { showAlert: vi.fn(), hideAlert: vi.fn() },
    usePrincipalImage: { showImage: vi.fn() },
  }),
}));
vi.mock('../../../context/InvoicesContext', () => ({
  useInvoices: () => ({ field1: [], formId1: 'form1', user: { idEmployee: '1' } }),
}));
vi.mock('../../../hooks/useInitInvoicesForms', () => ({
  __esModule: true,
  default: () => ({
    loadingFormInfo: false,
    submitRef: { current: null },
    formReady: true,
    setFormReady: vi.fn(),
    ResetForm: vi.fn(),
    updateField: vi.fn(),
  }),
}));
const createBillingDocument = vi.fn();
vi.mock('@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore', () => ({
  useBillingDocumentsStore: (sel: any) =>
    sel({
      creating: false,
      updating: false,
      error: undefined,
      successPost: false,
      successPut: false,
      createBillingDocument,
      updateBillingDocument: vi.fn(),
      resetFlags: vi.fn(),
    }),
}));
vi.mock('@/app/stores/useBillingHistoryStore/useBillingHistoryStore', () => ({
  useBillingHistoryStore: (sel: any) => sel({ forceFetchBillingHistory: vi.fn() }),
}));

import useInvoicesForm from './useInvoicesForm';

describe('useInvoicesForm', () => {
  it('calls createBillingDocument on submit', async () => {
    const { result } = renderHook(() => useInvoicesForm({}));
    await act(async () => {
      await result.current.handleSubmit({
        requisition: '1',
        description: 1,
        category: 1,
        numnights: 1,
        numpersons: 1,
        xml: new File([''], 'a.xml'),
        pdf: new File([''], 'a.pdf'),
      });
    });
    expect(createBillingDocument).toHaveBeenCalled();
  });
});
