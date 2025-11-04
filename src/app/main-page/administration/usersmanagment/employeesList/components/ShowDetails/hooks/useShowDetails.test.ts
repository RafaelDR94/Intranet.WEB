import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useShowDetails } from './useShowDetails';

let employeesStoreState: any;
let usersStoreState: any;
const showAlert = vi.fn();
const showSpinner = vi.fn();
const hideSpinner = vi.fn();

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalAlert: { showAlert },
    usePrincipalLoading: { showSpinner, hideSpinner },
  }),
}));

vi.mock('@/app/stores/useEmployeesStore/useEmployeesStore', () => ({
  useEmployeesStore: (selector: any) => selector(employeesStoreState),
}));

vi.mock('@/app/stores/useUsersStore/useUsersStore', () => ({
  useUsersStore: (selector: any) => selector(usersStoreState),
}));

describe('useShowDetails', () => {
  beforeEach(() => {
    employeesStoreState = {
      employee: {
        employee_id: 'emp-1',
        firstname: 'Ana',
        secondname: 'Maria',
        lastname: 'Lopez',
        motherlast_name: 'Gomez',
        department: { name: 'TI', enterprice_name: 'Empresa' },
        workposition: { name: 'Analista' },
        employee_number: '001',
        phone_number: '5512345678',
        email: 'ana@example.com',
        user: { user_id: 'user-1', is_active: true },
        is_active: true,
        image_url: '',
      },
      setCurrentEmployee: vi.fn(),
      forceFetchEmployees: vi.fn(),
    };

    usersStoreState = {
      toggleActive: vi.fn().mockResolvedValue(undefined),
      togglingActive: false,
      successToggleActive: false,
      error: null,
      resetFlags: vi.fn(),
    };

    showAlert.mockClear();
    showSpinner.mockClear();
    hideSpinner.mockClear();
  });

  it('formatea correctamente la información base del empleado', () => {
    const { result } = renderHook(() => useShowDetails());

    expect(result.current.hasEmployee).toBe(true);
    expect(result.current.primaryNameLine).toBe('Ana Maria');
    expect(result.current.secondaryNameLine).toBe('Lopez Gomez');
    expect(result.current.companyName).toBe('Empresa');
    expect(result.current.departmentName).toBe('TI');
    expect(result.current.phoneNumber).toBe('55 1234 5678');
  });

  it('emite toggleActive con el estado invertido y cierra el popup', async () => {
    const { result } = renderHook(() => useShowDetails());

    act(() => {
      result.current.openConfirmToggle();
    });

    expect(result.current.confirmToggleOpen).toBe(true);

    await act(async () => {
      await result.current.handleConfirmToggle();
    });

    expect(usersStoreState.toggleActive).toHaveBeenCalledWith({
      id: 'user-1',
      isActive: false,
    });
    expect(result.current.confirmToggleOpen).toBe(false);
  });
});
