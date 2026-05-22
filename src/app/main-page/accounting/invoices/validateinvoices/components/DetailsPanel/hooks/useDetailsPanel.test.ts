import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useDetailsPanel } from './useDetailsPanel';

const updateBillingDocument = vi.fn();
const validateBillingDocument = vi.fn();
const validateBillingDocumentOperations = vi.fn();
const rejectBillingDocument = vi.fn();
const fetchExpenseTypeCatalog = vi.fn();
const updateBillingDocumentJsonSap = vi.fn(async () => true);
const resetFlags = vi.fn();
const showAlert = vi.fn();
const showSpinner = vi.fn();
const hideSpinner = vi.fn();

const storeState = {
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
  resetFlags,
  error: null,
};

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalAlert: { showAlert },
    usePrincipalLoading: { showSpinner, hideSpinner },
  }),
}));

vi.mock('@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore', () => ({
  useBillingDocumentsStore: (selector: any) =>
    selector(storeState),
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
    resetFlags.mockClear();
    showAlert.mockClear();
    showSpinner.mockClear();
    hideSpinner.mockClear();
    storeState.expenseTypeCatalog = [];
    storeState.updating = false;
    storeState.successPut = false;
    storeState.succesReject = false;
    storeState.succesValidate = false;
    storeState.rejecting = false;
    storeState.validating = false;
    storeState.error = null;
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
        result.current.handleUpdateJsonSapItem(0, { claveInterna: 'NEW-1' }),
        result.current.handleUpdateJsonSapItem(1, { claveInterna: 'NEW-2' }),
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

  it('invoca onJsonSapUpdated cuando un ajuste json_sap se guarda con exito', async () => {
    const setPanelOpen = vi.fn();
    const onJsonSapUpdated = vi.fn();
    const { result, rerender } = renderHook(() =>
      useDetailsPanel({
        selected: {
          billingdocument_id: 'doc-99',
          requisition: {},
          json_sap: {
            items: [{ claveInterna: 'OLD-1', claveProdServ: 'SAT-1', importe: '10' }],
          },
        } as any,
        rejectType: false,
        setPanelOpen,
        operations: false,
        reqisition: 'r1',
        onJsonSapUpdated,
      }),
    );

    await act(async () => {
      await result.current.handleUpdateJsonSapItem(0, { importe: '20' });
    });

    storeState.successPut = true;
    rerender();

    expect(onJsonSapUpdated).toHaveBeenCalledWith('doc-99');
  });
});
