import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useUpdateUser from './useUpdateUser';

let employeesStoreState: any;
let usersStoreState: any;
let formState: any;
let authStoreState: any;
const showAlert = vi.fn();
const showSpinner = vi.fn();
const hideSpinner = vi.fn();

const changePasswordMock = vi.fn();
const resetAuthFlagsMock = vi.fn();

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

vi.mock('@/app/stores/useAuthStore/useAuthStore', () => {
  const useAuthStoreMock = (selector?: any) => {
    if (typeof selector === 'function') {
      return selector({ changePassword: changePasswordMock, resetFlags: resetAuthFlagsMock });
    }
    return { changePassword: changePasswordMock, resetFlags: resetAuthFlagsMock };
  };
  useAuthStoreMock.getState = () => authStoreState;
  return { useAuthStore: useAuthStoreMock };
});

vi.mock('@/app/stores/useFormFieldsStore/useFormFieldsStore', () => ({
  useFormFieldsStore: (selector?: any) => {
    if (typeof selector === 'function') {
      return selector(formState);
    }
    return formState;
  },
}));

describe('useUpdateUser', () => {
  beforeEach(() => {
    const user = {
      user_id: 'user-1',
      username: 'user@example.com',
      signature: 'signature.png',
      two_factor_enabled: true,
      change_password: false,
      role: { id: 'role-1' },
    };

    employeesStoreState = {
      employee: {
        employee_id: 'emp-1',
        email: 'user@example.com',
        user,
      },
    };

    usersStoreState = {
      roles: [
        { id: 'role-1', name: 'Administrador' },
        { id: 'role-2', name: 'Invitado' },
      ],
      fetchRoles: vi.fn(),
      loadingRoles: false,
      successGetRoles: true,
      updateUser: vi.fn().mockResolvedValue(undefined),
      updating: false,
      successPut: false,
      error: null,
      resetFlags: vi.fn(),
    };

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
      resetFields: vi.fn(),
    };

    authStoreState = {
      successChangePassword: true,
      error: null,
    };

    changePasswordMock.mockClear();
    resetAuthFlagsMock.mockClear();
    showAlert.mockClear();
    showSpinner.mockClear();
    hideSpinner.mockClear();
  });

  it('actualiza el usuario cuando los datos son válidos', async () => {
    const { result } = renderHook(() => useUpdateUser());

    await act(async () => {
      await result.current.handleSubmit({
        username: 'user@example.com',
        roleId: 'role-2',
        twoFactorEnabled: false,
        changePassword: true,
        shouldUpdatePassword: false,
      });
    });

    expect(usersStoreState.updateUser).toHaveBeenCalledWith({
      userId: 'user-1',
      username: 'user@example.com',
      roleId: 'role-2',
      signature: 'signature.png',
      twoFactorEnabled: false,
      changePassword: true,
    });
  });

  it('muestra advertencia cuando la nueva contraseña es inválida', async () => {
    const { result } = renderHook(() => useUpdateUser());

    await act(async () => {
      await result.current.handleSubmit({
        username: 'user@example.com',
        roleId: 'role-1',
        shouldUpdatePassword: true,
        newPassword: '123',
        changePassword: true,
      });
    });

    expect(changePasswordMock).not.toHaveBeenCalled();
    expect(usersStoreState.updateUser).not.toHaveBeenCalled();
    expect(showAlert).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'warning', title: 'Contraseña inválida' }),
    );
  });
});
