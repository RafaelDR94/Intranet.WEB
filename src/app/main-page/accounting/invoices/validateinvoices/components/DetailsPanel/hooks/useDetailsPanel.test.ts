import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { useDetailsPanel } from './useDetailsPanel';

const updateBillingDocument = vi.fn();
const validateBillingDocument = vi.fn();
const validateBillingDocumentOperations = vi.fn();
const rejectBillingDocument = vi.fn();
const fetchExpenseTypeCatalog = vi.fn();
const updateBillingDocumentJsonSap = vi.fn();

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

describe('useDetailsPanel', () => {
  it('envía acciones de comentario, rechazo y validación', () => {
    const setPanelOpen = vi.fn();
    const { result } = renderHook(() =>
      useDetailsPanel({ selected: { billingdocument_id: '1', requisition: {} } as any, rejectType: false, setPanelOpen, operations: false, reqisition: 'r1' })
    );
    act(() => result.current.handleSubmitComment({ comments: 'hola' }));
    expect(updateBillingDocument).toHaveBeenCalled();
    act(() => result.current.handleSubmitReject({ comments: 'x' }));
    expect(rejectBillingDocument).toHaveBeenCalled();
    act(() => result.current.handleSubmitValid());
    expect(validateBillingDocument).toHaveBeenCalled();
  });
});

