import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

const historyData = [
  { status: 'Aprobado' },
  { status: 'Rechazado' },
  { status: 'Invalido' },
] as any;

vi.mock('@/app/stores/useBillingHistoryStore/useBillingHistoryStore', () => ({
  useBillingHistoryStore: (sel: any) => sel({ history: historyData, loading: false, forceFetchBillingHistory: vi.fn() }),
}));
vi.mock('@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore', () => ({
  useBillingDocumentsStore: (sel: any) => sel({ successPut: false }),
}));
vi.mock('@/app/stores/useBillingImagesStore/useBillingImagesStore', () => ({
  useBillingImagesStore: (sel: any) => sel({ successPut: false }),
}));
vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({ usePrincipalLoading: { showSpinner: vi.fn(), hideSpinner: vi.fn() } }),
}));
vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ user: { idEmployee: '1' }, currentPagePermissions: {} }),
}));

import useHistory from './useHistory';

describe('useHistory', () => {
  it('filters rejected history items', () => {
    const { result } = renderHook(() => useHistory());
    expect(result.current.rejected.length).toBe(2);
  });
});
