import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useEmployeesList from './useEmployeesList';

let employeesStoreState: any;
let authState: any;
const showAlert = vi.fn();
const showSpinner = vi.fn();
const hideSpinner = vi.fn();
const pushMock = vi.fn();
let queryParams: Record<string, any>;

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalAlert: { showAlert },
    usePrincipalLoading: { showSpinner, hideSpinner },
  }),
}));

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => authState,
}));

vi.mock('@/app/hooks/useQuery/useQuery', () => ({
  __esModule: true,
  default: () => ({ all: queryParams }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock('@/app/stores/useEmployeesStore/useEmployeesStore', () => ({
  useEmployeesStore: (selector: any) => selector(employeesStoreState),
}));

describe('useEmployeesList', () => {
  beforeEach(() => {
    employeesStoreState = {
      fetchEmployees: vi.fn(),
      employees: [],
      employee: null,
      setCurrentEmployee: vi.fn((employee: any) => {
        employeesStoreState.employee = employee;
      }),
      deleteEmployee: vi.fn().mockResolvedValue(true),
      employeesError: null,
      lodingEmployees: false,
      deleting: false,
      succesDelete: false,
      resetFlags: vi.fn(),
      resetEmployee: vi.fn(() => {
        employeesStoreState.employee = null;
      }),
    };
    authState = { currentPagePermissions: { create: true } };
    queryParams = {};

    showAlert.mockClear();
    showSpinner.mockClear();
    hideSpinner.mockClear();
    pushMock.mockClear();
  });

  it('navega al formulario de creación con handleOpenNew', () => {
    const { result } = renderHook(() => useEmployeesList());

    act(() => {
      result.current.handleOpenNew();
    });

    expect(pushMock).toHaveBeenCalledWith('/main-page/administration/usersmanagment/createemployee');
  });

  it('permite abrir y cerrar el popup de eliminación', async () => {
    const employee = { employee_id: 'emp-1', fullname: 'Demo User' };
    const { result } = renderHook(() => useEmployeesList());

    expect(result.current.openDeletePopUp).toBe(false);

    act(() => {
      result.current.handleOpenDeletePopUp(employee);
    });

    expect(result.current.openDeletePopUp).toBe(true);
    expect(employeesStoreState.employee).toEqual(employee);

    await act(async () => {
      await result.current.handleDeleteEmployee();
    });

    expect(employeesStoreState.deleteEmployee).toHaveBeenCalledWith('emp-1');
    expect(result.current.openDeletePopUp).toBe(false);
  });
});
