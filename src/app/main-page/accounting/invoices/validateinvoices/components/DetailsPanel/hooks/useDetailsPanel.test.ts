import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useDetailsPanel } from './useDetailsPanel';

const updateBillingDocument = vi.fn();
const validateBillingDocument = vi.fn();
const validateBillingDocumentOperations = vi.fn();
const rejectBillingDocument = vi.fn();
const fetchExpenseTypeCatalog = vi.fn();
const updateBillingDocumentJsonSap = vi.fn(async () => true);

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalAlert: { showAlert: vi.fn() },
    usePrincipalLoading: { showSpinner: vi.fn(), hideSpinner: vi.fn() },
  }),
}));

vi.mock('@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore', () => ({
  useBillingDocumentsStore: (selector: any) =>
    selector({
      updateBillingDocument,
      updateBillingDocumentJsonSap,
      validateBillingDocument,
      validateBillingDocumentOperations,
      rejectBillingDocument,
      fetchExpenseTypeCatalog,
      expenseTypeCatalog: [],
      updating: false,
      successPut: false,
      succesReject: false,
      succesValidate: false,
      rejecting: false,
      validating: false,
      resetFlags: vi.fn(),
      error: null,
    }),
}));

vi.mock('@/app/stores/useBillingCompleteProcessToSAPStore/useBillingCompleteProcessToSAPStore', () => ({
  useBillingCompleteProcessToSAPStore: (selector: any) =>
    selector({
      sending: false,
    }),
}));

describe('useDetailsPanel', () => {
  beforeEach(() => {
    updateBillingDocument.mockClear();
    validateBillingDocument.mockClear();
    validateBillingDocumentOperations.mockClear();
    rejectBillingDocument.mockClear();
    fetchExpenseTypeCatalog.mockClear();
    updateBillingDocumentJsonSap.mockClear();
  });

  it('envia acciones de comentario, rechazo y validacion', () => {
    const setPanelOpen = vi.fn();
    const { result } = renderHook(() =>
      useDetailsPanel({
        selected: { billingdocument_id: '1', requisition: {} } as any,
        rejectType: false,
        setPanelOpen,
        operations: false,
        reqisition: 'r1',
      }),
    );

    act(() => result.current.handleSubmitComment({ comments: 'hola' }));
    expect(updateBillingDocument).toHaveBeenCalled();

    act(() => result.current.handleSubmitReject({ comments: 'x' }));
    expect(rejectBillingDocument).toHaveBeenCalled();

    act(() => result.current.handleSubmitValid());
    expect(validateBillingDocument).toHaveBeenCalled();
  });

  it('encadena cambios de json_sap sin perder cambios previos', async () => {
    const setPanelOpen = vi.fn();
    const selected = {
      billingdocument_id: 'doc-1',
      requisition: {},
      json_sap: {
        items: [
          { claveInterna: 'OLD-1', claveProdServ: 'SAT-1' },
          { claveInterna: 'OLD-2', claveProdServ: 'SAT-2' },
        ],
      },
    } as any;

    const { result } = renderHook(() =>
      useDetailsPanel({
        selected,
        rejectType: false,
        setPanelOpen,
        operations: false,
        reqisition: 'r1',
      }),
    );

    await act(async () => {
      await Promise.all([
        result.current.handleUpdateJsonSapItem(0, 'NEW-1'),
        result.current.handleUpdateJsonSapItem(1, 'NEW-2'),
      ]);
    });

    expect(updateBillingDocumentJsonSap).toHaveBeenCalledTimes(2);

    const firstPayload = updateBillingDocumentJsonSap.mock.calls[0][0];
    const secondPayload = updateBillingDocumentJsonSap.mock.calls[1][0];
    const firstJson = JSON.parse(firstPayload.jsonsap);
    const secondJson = JSON.parse(secondPayload.jsonsap);

    expect(firstJson.items[0].claveInterna).toBe('NEW-1');
    expect(secondJson.items[0].claveInterna).toBe('NEW-1');
    expect(secondJson.items[1].claveInterna).toBe('NEW-2');
  });
});
