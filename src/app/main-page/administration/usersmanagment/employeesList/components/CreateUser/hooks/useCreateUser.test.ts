import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useCreateUser from './useCreateUser';

let employeesStoreState: any;
let usersStoreState: any;
let formState: any;
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

vi.mock('@/app/stores/useFormFieldsStore/useFormFieldsStore', () => ({
  useFormFieldsStore: (selector?: any) => {
    if (typeof selector === 'function') {
      return selector(formState);
    }
    return formState;
  },
}));

describe('useCreateUser', () => {
  beforeEach(() => {
    formState = {
      fieldsByFormId: {},
      formVersionsByFormId: {},
      setFields: vi.fn((formId: string, newFields: any[]) => {
        formState.fieldsByFormId[formId] = newFields;
        formState.formVersionsByFormId[formId] = (formState.formVersionsByFormId[formId] ?? 0) + 1;
      }),
      updateField: vi.fn((formId: string, name: string, changes: any) => {
        formState.fieldsByFormId[formId] = (formState.fieldsByFormId[formId] ?? []).map((field: any) =>
          field.name === name ? { ...field, ...changes } : field,
        );
      }),
      resetFields: vi.fn((formId: string) => {
        delete formState.fieldsByFormId[formId];
        delete formState.formVersionsByFormId[formId];
      }),
    };

    employeesStoreState = {
      employee: {
        employee_id: 'emp-1',
        email: 'employee@example.com',
      },
    };

    usersStoreState = {
      roles: [{ id: 'role-1', name: 'Administrador' }],
      fetchRoles: vi.fn(),
      loadingRoles: false,
      successGetRoles: true,
      createUser: vi.fn().mockResolvedValue(undefined),
      creating: false,
      successPost: false,
      error: null,
      resetFlags: vi.fn(),
    };

    showAlert.mockClear();
    showSpinner.mockClear();
    hideSpinner.mockClear();
  });

  it('genera el payload y ejecuta createUser cuando hay empleado', async () => {
    const { result } = renderHook(() => useCreateUser());

    await act(async () => {
      await result.current.handleSubmit({
        username: ' user@example.com ',
        password: 'password123',
        roleId: 'role-1',
        twoFactorEnabled: true,
        changePassword: true,
      });
    });

    expect(usersStoreState.createUser).toHaveBeenCalledWith({
      username: 'user@example.com',
      password: 'password123',
      roleId: 'role-1',
      employeeId: 'emp-1',
      twoFactorEnabled: true,
      changePassword: true,
    });
  });

  it('muestra alerta cuando no hay empleado seleccionado', async () => {
    employeesStoreState.employee = null;

    const { result } = renderHook(() => useCreateUser());

    await act(async () => {
      await result.current.handleSubmit({
        username: 'demo@example.com',
        password: 'pass',
        roleId: 'role-1',
      });
    });

    expect(usersStoreState.createUser).not.toHaveBeenCalled();
    expect(showAlert).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'warning', title: 'Selecciona un empleado' }),
    );
  });
});
