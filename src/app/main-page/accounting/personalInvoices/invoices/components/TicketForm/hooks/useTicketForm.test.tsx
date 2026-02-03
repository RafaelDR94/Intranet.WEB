import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

const uploadImageMock = vi.fn();
vi.mock('@/app/context/FirebaseContext/FirebaseContext', () => ({
  useFirebase: () => ({ firebasestorage: { uploadImage: uploadImageMock } }),
}));
vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalLoading: { showSpinner: vi.fn(), hideSpinner: vi.fn() },
    usePrincipalAlert: { showAlert: vi.fn(), hideAlert: vi.fn() },
  }),
}));
vi.mock('../../../context/InvoicesContext', () => ({
  useInvoices: () => ({ field2: [], formId2: 'form2', user: { idEmployee: '1' } }),
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
const createBillingImageMock = vi.fn();
const updateBillingImageMock = vi.fn();
vi.mock('@/app/stores/useBillingImagesStore/useBillingImagesStore', () => ({
  useBillingImagesStore: (sel: any) =>
    sel({
      creating: false,
      updating: false,
      error: undefined,
      successPost: false,
      successPut: false,
      createBillingImage: createBillingImageMock,
      updateBillingImage: updateBillingImageMock,
      resetFlags: vi.fn(),
    }),
}));
vi.mock('@/app/stores/useBillingHistoryStore/useBillingHistoryStore', () => ({
  useBillingHistoryStore: (sel: any) => sel({ forceFetchBillingHistory: vi.fn() }),
}));
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('id=REQ-123'),
}));

import useTicketForm from './useTicketForm';

describe('useTicketForm', () => {
  it('exposes handleSubmit function', () => {
    const { result } = renderHook(() => useTicketForm({}));
    expect(typeof result.current.handleSubmit).toBe('function');
  });

  it('sends requisition id from query params when creating a ticket', async () => {
    uploadImageMock.mockResolvedValue('https://image.example.com/ticket.png');

    const { result } = renderHook(() => useTicketForm({}));

    await result.current.handleSubmit({
      ticket: {} as File,
      category: 'cat-1',
    });

    expect(createBillingImageMock).toHaveBeenCalledWith(
      expect.objectContaining({ requisition_id: 'REQ-123' })
    );
  });
});
