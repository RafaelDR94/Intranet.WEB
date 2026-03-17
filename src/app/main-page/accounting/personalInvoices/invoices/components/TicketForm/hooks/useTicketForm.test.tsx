import { renderHook, waitFor } from '@testing-library/react';
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
vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ user: { idEmployee: '1' } }),
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
const resetFlagsMock = vi.fn();
const forceFetchBillingHistoryMock = vi.fn();
const fetchBillingAllDocumentsByEmployeeMock = vi.fn();
const billingImagesStoreState = {
  creating: false,
  updating: false,
  error: undefined as string | undefined,
  successPost: false,
  successPut: false,
  createBillingImage: createBillingImageMock,
  updateBillingImage: updateBillingImageMock,
  resetFlags: resetFlagsMock,
};
vi.mock('@/app/stores/useBillingImagesStore/useBillingImagesStore', () => ({
  useBillingImagesStore: (sel: any) =>
    sel(billingImagesStoreState),
}));
vi.mock('@/app/stores/useBillingHistoryStore/useBillingHistoryStore', () => ({
  useBillingHistoryStore: (sel: any) =>
    sel({ forceFetchBillingHistory: forceFetchBillingHistoryMock }),
}));
vi.mock(
  '@/app/stores/useBillingAllDocumentsByEmployeeStore/useBillingAllDocumentsByEmployeeStore',
  () => ({
    useBillingAllDocumentsByEmployeeStore: (sel: any) =>
      sel({
        fetchBillingAllDocumentsByEmployee: fetchBillingAllDocumentsByEmployeeMock,
      }),
  }),
);
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
      ticket: new File(['x'], 'ticket.png', { type: 'image/png' }),
      category: 'cat-1',
    });

    expect(createBillingImageMock).toHaveBeenCalledWith(
      expect.objectContaining({ requisition_id: 'REQ-123', employee_id: '1' })
    );
  });

  it('envó­a image (string) en PUT cuando edita', async () => {
    const dataEdit: any = {
      billing_image_id: 'BILL-1',
      billingrequisition_id: 'REQ-EDIT',
      image: 'https://image.example.com/old.png',
      comments: 'c',
    };

    const { result } = renderHook(() => useTicketForm({ dataEdit }));

    await result.current.handleSubmit({
      requisition: 'REQ-EDIT',
      ticket: null,
      category: 'cat-1',
      numnights: '1',
      numpersons: '1',
      description: 'desc',
    });

    expect(updateBillingImageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        billing_image_id: 'BILL-1',
        requisition_id: 'REQ-EDIT',
        image: 'https://image.example.com/old.png',
      }),
    );
  });

  it('refresca tablas (all documents) al completar un PUT', async () => {
    billingImagesStoreState.successPut = true;
    const dataEdit: any = {
      billing_image_id: 'BILL-1',
      billingrequisition_id: 'REQ-EDIT',
      image: 'https://image.example.com/old.png',
      comments: 'c',
    };

    renderHook(() => useTicketForm({ dataEdit }));

    await waitFor(() => {
      expect(forceFetchBillingHistoryMock).toHaveBeenCalledWith('1');
      expect(fetchBillingAllDocumentsByEmployeeMock).toHaveBeenCalledWith('1', true);
    });

    billingImagesStoreState.successPut = false;
  });
});
