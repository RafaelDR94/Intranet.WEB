import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { useRequisitionForm } from './useRequisitionsForm';

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalLoading: { showSpinner: vi.fn(), hideSpinner: vi.fn() },
    usePrincipalAlert: { showAlert: vi.fn(), hideAlert: vi.fn() },
  }),
}));

const setFields = vi.fn();
const updateField = vi.fn();
const resetFields = vi.fn();
vi.mock('@/app/stores/useFormFieldsStore/useFormFieldsStore', () => {
  const store = { fieldsByFormId: {} };
  const hook: any = (selector: any) => selector(store);
  hook.getState = () => ({ setFields, updateField, resetFields });
  return { useFormFieldsStore: hook };
});

vi.mock('@/app/stores/useEmployeesStore/useEmployeesStore', () => ({
  useEmployeesStore: (selector: any) =>
    selector({
      employees: [],
      error: undefined,
      fetchEmployees: vi.fn(),
      loading: false,
      successGet: true,
    }),
}));

vi.mock('@/app/stores/useProyectsStore/useProyectsStore', () => ({
  useProyectsStore: (selector: any) =>
    selector({
      proyects: [],
      error: undefined,
      fetchProyects: vi.fn(),
      loading: false,
      successGet: true,
    }),
}));

const createRequisition = vi.fn();
const updateRequisition = vi.fn();
const resetFlags = vi.fn();
vi.mock('@/app/stores/useRequisitionStore/useRequisitionStore', () => ({
  useRequisitionsStore: (selector: any) =>
    selector({
      createRequisition,
      updateRequisition,
      resetFlags,
      creating: false,
      updating: false,
      successPost: false,
      successPut: false,
      error: undefined,
    }),
}));

vi.mock('../utilities/requisition', () => ({
  computeLoadingFormInfo: vi.fn().mockReturnValue(false),
  getOptionLabel: vi.fn(),
  buildRequisitionPayload: vi.fn().mockReturnValue({}),
  createInitialFields: vi.fn().mockReturnValue([]),
}));

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ currentPagePermissions: { requisitionForm: true } }),
}));

describe('useRequisitionForm', () => {
  it('toggles buttonDisabled when form readiness changes', () => {
    const { result } = renderHook(() => useRequisitionForm('create'));
    expect(result.current.buttonDisabled).toBe(true);
    act(() => result.current.setFormReady(true));
    expect(result.current.buttonDisabled).toBe(false);
  });
});
