import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../utilities/voucherBlue', () => ({
  computeLoadingFormInfo: () => false,
  buildPettyCashVoucherPayload: vi.fn(),
  getOptionLabel: vi.fn(),
  createInitialFields: () => [],
}));

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ currentPagePermissions: {} }),
}));

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalLoading: { showSpinner: vi.fn(), hideSpinner: vi.fn() },
    usePrincipalAlert: { showAlert: vi.fn(), hideAlert: vi.fn() },
  }),
}));

vi.mock('@/app/stores/useProyectsStore/useProyectsStore', () => ({
  useProyectsStore: (sel: any) => sel({ proyects: [], error: undefined, fetchProyects: vi.fn() }),
}));

vi.mock('@/app/stores/useFormFieldsStore/useFormFieldsStore', () => {
  const state = {
    fieldsByFormId: {},
    setFields: vi.fn(),
    updateField: vi.fn(),
    resetFields: vi.fn(),
  };
  const useFormFieldsStore = (sel: any) => sel(state);
  useFormFieldsStore.getState = () => state;
  return { useFormFieldsStore };
});

vi.mock('@/app/stores/useBillingPettyCash/useBillingPettyCash', () => ({
  useBillingPettyCash: (sel: any) => sel({
    createPettyCashVoucher: vi.fn(),
    updatePettyCashVoucher: vi.fn(),
    resetFlags: vi.fn(),
    fetchPettyCashFunds: vi.fn(),
    pettyCashFunds: [],
  }),
}));

import { useVoucherBlue } from './useVoucherBlue';

describe('useVoucherBlue', () => {
  it('exposes handleSubmit function', () => {
    const { result } = renderHook(() => useVoucherBlue({ mode: 'create' }));
    expect(typeof result.current.handleSubmit).toBe('function');
  });
});
