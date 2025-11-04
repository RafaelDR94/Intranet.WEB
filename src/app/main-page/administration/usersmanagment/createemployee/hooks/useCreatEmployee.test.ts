import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useCreateEemployee from './useCreatEmployee';

let employeesStoreState: any;
let enterprisesStoreState: any;
let formStoreState: any;
let firebaseMock: any;
let queryParams: Record<string, any>;
const showAlert = vi.fn();
const showSpinner = vi.fn();
const hideSpinner = vi.fn();
const pushMock = vi.fn();

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalAlert: { showAlert },
    usePrincipalLoading: { showSpinner, hideSpinner },
  }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock('@/app/context/FirebaseContext/FirebaseContext', () => ({
  useFirebase: () => firebaseMock,
}));

vi.mock('@/app/hooks/useQuery/useQuery', () => ({
  __esModule: true,
  default: () => ({ all: queryParams }),
}));

vi.mock('@/app/stores/useFormFieldsStore/useFormFieldsStore', () => ({
  useFormFieldsStore: () => formStoreState,
}));

vi.mock('@/app/stores/useEnterprisesStore/useEnterprisesStore', () => ({
  useEnterprisesStore: (selector: any) => selector(enterprisesStoreState),
}));

vi.mock('@/app/stores/useEmployeesStore/useEmployeesStore', () => ({
  useEmployeesStore: (selector: any) => selector(employeesStoreState),
}));

describe('useCreatEmployee', () => {
  beforeEach(() => {
    employeesStoreState = {
      fetchEmployees: vi.fn(),
      fetchActiveEmployees: vi.fn(),
      employees: [],
      employeesList: [],
      error: null,
      errorEmployees: null,
      createEmployee: vi.fn().mockResolvedValue(undefined),
      fetchEmployeeById: vi.fn().mockResolvedValue(null),
      creating: false,
      creatingEmployee: false,
      successPost: false,
      succesCreate: false,
      updateEmployee: vi.fn().mockResolvedValue(undefined),
      updating: false,
      updatingEmployee: false,
      successPut: false,
      succesUpdate: false,
      employee: null,
      currentEmployee: null,
      resetFlags: vi.fn(),
      resetEmployee: vi.fn(() => {
        employeesStoreState.employee = null;
        employeesStoreState.currentEmployee = null;
      }),
      setCurrentEmployee: vi.fn((employee: any) => {
        employeesStoreState.employee = employee;
        employeesStoreState.currentEmployee = employee;
      }),
    };

    enterprisesStoreState = {
      fetchWorkpositions: vi.fn().mockResolvedValue([]),
      fetchEnterprises: vi.fn(),
      enterprises: [],
      error: null,
      resetFlags: vi.fn(),
    };

    formStoreState = {
      fieldsByFormId: {},
      formVersionsByFormId: {},
      setFields: vi.fn((formId: string, fields: any[]) => {
        formStoreState.fieldsByFormId[formId] = fields;
      }),
      updateField: vi.fn(),
      resetFields: vi.fn((formId: string) => {
        delete formStoreState.fieldsByFormId[formId];
      }),
    };

    firebaseMock = {
      firebasestorage: {
        uploadFile: vi.fn().mockResolvedValue('https://firebase.local/photo.jpg'),
      },
    };

    queryParams = {};

    showAlert.mockClear();
    showSpinner.mockClear();
    hideSpinner.mockClear();
    pushMock.mockClear();
  });

  it('envía createEmployee cuando no existe un empleado actual', async () => {
    employeesStoreState.employee = null;
    employeesStoreState.currentEmployee = null;

    queryParams = { idEmployee: 'emp-1' };

    const { result } = renderHook(() => useCreateEemployee());

    await act(async () => {
      await result.current.handleSubmit({
        employee_number: '001',
        firstname: 'Demo',
        secondname: '',
        lastname: 'Perez',
        motherlast_name: 'Lopez',
        gender: 'M',
        email: 'demo@example.com',
        phone_number: '5551234',
        extension: '123',
        image_url: 'https://static/avatar.png',
        departments: 'dep-1',
        workposition: 'pos-1',
        manager: 'mgr-1',
      });
    });

    expect(employeesStoreState.createEmployee).toHaveBeenCalledWith({
      employee_number: '001',
      firstname: 'Demo',
      secondname: '',
      lastname: 'Perez',
      motherlast_name: 'Lopez',
      gender: 'M',
      email: 'demo@example.com',
      phone_number: '5551234',
      extension: '123',
      image_url: 'https://static/avatar.png',
      department_id: 'dep-1',
      workposition_id: 'pos-1',
      manager_id: 'mgr-1',
    });
    expect(employeesStoreState.updateEmployee).not.toHaveBeenCalled();
    expect(firebaseMock.firebasestorage.uploadFile).not.toHaveBeenCalled();
  });

  it('actualiza un empleado cargando la imagen cuando existe currentEmployee', async () => {
    const employee = {
      employee_id: 'emp-1',
      firstname: 'Demo',
      lastname: 'Perez',
      motherlast_name: 'Lopez',
      phone_number: '5512345678',
      department: { department_id: 'dep-1', enterprise_id: 'ent-1' },
      workposition: { workposition_id: 'pos-1' },
      manager_id: 'mgr-1',
      email: 'demo@example.com',
      image_url: 'https://static/avatar.png',
    };
    employeesStoreState.employee = employee;
    employeesStoreState.currentEmployee = employee;
    queryParams = { idEmployee: 'emp-1' };

    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });

    const { result } = renderHook(() => useCreateEemployee());

    await act(async () => {
      await result.current.handleSubmit({
        employee_number: '001',
        firstname: 'Demo',
        secondname: '',
        lastname: 'Perez',
        motherlast_name: 'Lopez',
        gender: 'M',
        email: 'demo@example.com',
        phone_number: '5551234',
        extension: '123',
        image_url: file,
        departments: 'dep-1',
        workposition: 'pos-1',
        manager: 'mgr-1',
      });
    });

    expect(firebaseMock.firebasestorage.uploadFile).toHaveBeenCalledWith(
      file,
      'Employees/DemoPerezLopez/profileImage.jpg',
    );

    expect(employeesStoreState.updateEmployee).toHaveBeenCalledWith({
      employee_number: '001',
      firstname: 'Demo',
      secondname: '',
      lastname: 'Perez',
      motherlast_name: 'Lopez',
      gender: 'M',
      email: 'demo@example.com',
      phone_number: '5551234',
      extension: '123',
      image_url: 'https://firebase.local/photo.jpg',
      department_id: 'dep-1',
      workposition_id: 'pos-1',
      manager_id: 'mgr-1',
      employee_id: 'emp-1',
    });
    expect(showSpinner).toHaveBeenCalled();
    expect(hideSpinner).toHaveBeenCalled();
  });
});

