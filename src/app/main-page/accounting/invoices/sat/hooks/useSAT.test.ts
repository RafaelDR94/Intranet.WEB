import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useSAT from './useSAT';

const fetchSatBillingDocument = vi.fn();
const sendToSapBillingDocument = vi.fn();
const fetchBillingDocumentById = vi.fn();
const updateQuery = vi.fn();
let queryAllMock: Record<string, unknown> = {};

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
      fetchBillingDocumentById,
      error: null,
      sendToSapBillingDocument,
      sending: false,
      succesSend: false,
    }),
}));

vi.mock('@/app/hooks/useQuery/useQuery', () => ({
  __esModule: true,
  default: () => ({ all: queryAllMock, updateQuery }),
}));

describe('useSAT', () => {
  beforeEach(() => {
    queryAllMock = {};
    fetchSatBillingDocument.mockClear();
    sendToSapBillingDocument.mockClear();
  });

  it('usa filtro por idRequisition cuando viene en query', () => {
    queryAllMock = { idRequisition: 'req-1', idEmployee: 'emp-1' };

    renderHook(() => useSAT());

    expect(fetchSatBillingDocument).toHaveBeenCalledWith(true, { idRequisition: 'req-1' });
  });

  it('usa filtro por idEmployee cuando no viene idRequisition', () => {
    queryAllMock = { idEmployee: 'emp-1' };

    renderHook(() => useSAT());

    expect(fetchSatBillingDocument).toHaveBeenCalledWith(true, { idEmployee: 'emp-1' });
  });

  it('fetches billing documents on mount and sends selected ids to SAP', () => {
    const { result } = renderHook(() => useSAT());

    expect(fetchSatBillingDocument).toHaveBeenCalledWith(true, undefined);

    act(() => {
      result.current.handleMultiSelect([{ billingdocument_id: '1' } as any]);
    });

    act(() => {
      result.current.handleSendToSap();
    });

    expect(sendToSapBillingDocument).toHaveBeenCalledWith(['1']);
  });
});
