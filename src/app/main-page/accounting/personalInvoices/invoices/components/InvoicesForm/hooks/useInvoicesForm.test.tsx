import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const uploadFile = vi.fn().mockResolvedValue('url');
const showAlert = vi.fn();
vi.mock('@/app/context/FirebaseContext/FirebaseContext', () => ({
  useFirebase: () => ({ firebasestorage: { uploadFile } }),
}));
vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalLoading: { showSpinner: vi.fn(), hideSpinner: vi.fn() },
    usePrincipalAlert: { showAlert, hideAlert: vi.fn() },
    usePrincipalImage: { showImage: vi.fn() },
  }),
}));
vi.mock('../../../context/InvoicesContext', () => ({
  useInvoices: () => ({
    field1: [],
    formId1: 'form1',
    user: { idEmployee: '1' },
    targetEmployeeId: '1',
  }),
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
  beforeEach(() => {
    createBillingDocument.mockReset();
    showAlert.mockReset();
    uploadFile.mockResolvedValue('url');
  });

  it('calls createBillingDocument on submit', async () => {
    createBillingDocument.mockResolvedValue({ billing_document_id: '1' });
    const { result } = renderHook(() => useInvoicesForm({}));
    await act(async () => {
      await result.current.handleSubmit({
        requisition: '1',
        description: 1,
        category: 1,
        numnights: 1,
        numpersons: 1,
        xml: new File(["<cfdi:Comprobante/>"], "a.xml", { type: "text/xml" }),
        pdf: new File(["%PDF-1.4"], "a.pdf", { type: "application/pdf" }),
      });
    });
    expect(createBillingDocument).toHaveBeenCalled();
  });

  it('muestra error y no envó­a si el XML estó¡ vacó­o', async () => {
    const { result } = renderHook(() => useInvoicesForm({}));
    showAlert.mockClear();
    createBillingDocument.mockClear();

    await act(async () => {
      await result.current.handleSubmit({
        requisition: '1',
        description: 1,
        category: 1,
        numnights: 1,
        numpersons: 1,
        xml: new File([''], 'a.xml', { type: 'text/xml' }),
        pdf: new File(['%PDF-1.4'], 'a.pdf', { type: 'application/pdf' }),
      });
    });

    expect(createBillingDocument).not.toHaveBeenCalled();
    expect(showAlert).toHaveBeenCalled();
  });

  it('muestra el mensaje real del backend cuando createBillingDocument falla', async () => {
    createBillingDocument.mockRejectedValue(
      new Error('Este documento ya se encuentra registrado en la requisiciÃ³n1233'),
    );

    const { result } = renderHook(() => useInvoicesForm({}));

    await act(async () => {
      await result.current.handleSubmit({
        requisition: '1',
        description: 1,
        category: 1,
        numnights: 1,
        numpersons: 1,
        xml: new File(["<cfdi:Comprobante/>"], "a.xml", { type: "text/xml" }),
        pdf: new File(["%PDF-1.4"], "a.pdf", { type: "application/pdf" }),
      });
    });

    expect(showAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'No se pudo enviar',
        description: 'Este documento ya se encuentra registrado en la requisiciÃ³n1233',
      }),
    );
  });
});
