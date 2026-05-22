import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useCreateEemployee from './useCreatEmployee';

let employeesStoreState: any;
let enterprisesStoreState: any;
let formStoreState: any;
let firebaseMock: any;
let queryParams: Record<string, any>;
let updateFieldCalls: Array<{ formId: string; name: string; changes: any }>;
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
      fetchWorkpositionsByDepartment: vi.fn().mockResolvedValue([]),
      fetchEnterprises: vi.fn(),
      enterprises: [],
      error: null,
      resetFlags: vi.fn(),
    };

    updateFieldCalls = [];
    formStoreState = {
      fieldsByFormId: {},
      formVersionsByFormId: {},
      setFields: vi.fn((formId: string, fields: any[]) => {
        formStoreState.fieldsByFormId[formId] = fields;
      }),
      updateField: vi.fn((formId: string, name: string, changes: any) => {
        updateFieldCalls.push({ formId, name, changes });
      }),
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

  it('envia createEmployee cuando no existe un empleado actual', async () => {
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
      gtstype: undefined,
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
      gtstype: undefined,
      employee_id: 'emp-1',
    });
    expect(showSpinner).toHaveBeenCalled();
    expect(hideSpinner).toHaveBeenCalled();
  });

  it('no ejecuta envios cuando el formulario esta en modo solo lectura', async () => {
    const loggedUser = { idEmployee: 'emp-readonly' } as any;

    const { result } = renderHook(() => useCreateEemployee({ loggedUser }));

    expect(result.current.isReadOnly).toBe(true);

    await act(async () => {
      await result.current.handleSubmit({
        employee_number: '001',
      });
    });

    expect(employeesStoreState.createEmployee).not.toHaveBeenCalled();
    expect(employeesStoreState.updateEmployee).not.toHaveBeenCalled();
  });

  it('al seleccionar empresa carga departamentos y mantiene puesto bloqueado hasta elegir departamento', async () => {
    enterprisesStoreState.enterprises = [
      {
        enterprise_id: 'ent-1',
        name: 'Empresa Demo',
        departments: [{ department_id: 'dep-1', name: 'Sistemas' }],
      },
    ];
    employeesStoreState.employees = [{ employee_id: 'mgr-1', fullname: 'Manager Demo' }];

    renderHook(() => useCreateEemployee());

    const enterpriseField = updateFieldCalls
      .filter((call) => call.name === 'enteprise')
      .at(-1);

    await act(async () => {
      await enterpriseField?.changes?.onChange?.('ent-1');
    });

    const departmentField = updateFieldCalls
      .filter((call) => call.name === 'departments')
      .at(-1);
    const workpositionField = updateFieldCalls
      .filter((call) => call.name === 'workposition')
      .at(-1);

    expect(departmentField?.changes).toMatchObject({
      value: '',
      options: [{ label: 'Sistemas', value: 'dep-1' }],
    });
    expect(typeof departmentField?.changes?.onChange).toBe('function');
    expect(workpositionField?.changes).toMatchObject({
      value: '',
      options: [],
      disabled: true,
    });
    expect(enterprisesStoreState.fetchWorkpositionsByDepartment).not.toHaveBeenCalled();
  });

  it('al seleccionar departamento consulta puestos y actualiza las opciones', async () => {
    enterprisesStoreState.enterprises = [
      {
        enterprise_id: 'ent-1',
        name: 'Empresa Demo',
        departments: [{ department_id: 'dep-1', name: 'Sistemas' }],
      },
    ];
    employeesStoreState.employees = [{ employee_id: 'mgr-1', fullname: 'Manager Demo' }];
    enterprisesStoreState.fetchWorkpositionsByDepartment = vi
      .fn()
      .mockResolvedValue([{ workposition_id: 'wp-1', name: 'Developer' }]);

    renderHook(() => useCreateEemployee());

    const enterpriseField = updateFieldCalls
      .filter((call) => call.name === 'enteprise')
      .at(-1);

    await act(async () => {
      await enterpriseField?.changes?.onChange?.('ent-1');
    });

    const departmentField = updateFieldCalls
      .filter((call) => call.name === 'departments')
      .at(-1);

    await act(async () => {
      await departmentField?.changes?.onChange?.('dep-1');
    });

    expect(enterprisesStoreState.fetchWorkpositionsByDepartment).toHaveBeenCalledWith(
      'dep-1',
      true,
    );

    const workpositionUpdates = updateFieldCalls.filter(
      (call) => call.name === 'workposition',
    );

    expect(workpositionUpdates.some((call) =>
      call.changes?.disabled === true &&
      Array.isArray(call.changes?.options) &&
      call.changes.options.length === 0 &&
      call.changes.value === '',
    )).toBe(true);

    expect(workpositionUpdates.some((call) =>
      call.changes?.disabled === false &&
      call.changes?.value === '' &&
      JSON.stringify(call.changes?.options) ===
        JSON.stringify([{ label: 'Developer', value: 'wp-1' }]),
    )).toBe(true);
  });

  it('en edicion precarga puesto si sigue existiendo para el departamento', async () => {
    const employee = {
      employee_id: 'emp-1',
      firstname: 'Demo',
      lastname: 'Perez',
      motherlast_name: 'Lopez',
      phone_number: '5512345678',
      department: { department_id: 'dep-1', enterprise_id: 'ent-1' },
      workposition: { workposition_id: 'wp-1' },
      manager_id: 'mgr-1',
      email: 'demo@example.com',
      image_url: 'https://static/avatar.png',
    };
    employeesStoreState.employee = employee;
    employeesStoreState.currentEmployee = employee;
    employeesStoreState.employees = [{ employee_id: 'mgr-1', fullname: 'Manager Demo' }];
    enterprisesStoreState.enterprises = [
      {
        enterprise_id: 'ent-1',
        name: 'Empresa Demo',
        departments: [{ department_id: 'dep-1', name: 'Sistemas' }],
      },
    ];
    enterprisesStoreState.fetchWorkpositionsByDepartment = vi
      .fn()
      .mockResolvedValue([{ workposition_id: 'wp-1', name: 'Developer' }]);
    queryParams = { idEmployee: 'emp-1' };

    renderHook(() => useCreateEemployee());

    await act(async () => {
      await Promise.resolve();
    });

    const workpositionField = updateFieldCalls
      .filter((call) => call.name === 'workposition')
      .at(-1);

    expect(workpositionField?.changes).toMatchObject({
      value: 'wp-1',
      options: [{ label: 'Developer', value: 'wp-1' }],
      disabled: false,
    });
  });

  it('en edicion limpia el puesto si ya no pertenece al departamento', async () => {
    const employee = {
      employee_id: 'emp-1',
      firstname: 'Demo',
      lastname: 'Perez',
      motherlast_name: 'Lopez',
      phone_number: '5512345678',
      department: { department_id: 'dep-1', enterprise_id: 'ent-1' },
      workposition: { workposition_id: 'wp-9' },
      manager_id: 'mgr-1',
      email: 'demo@example.com',
      image_url: 'https://static/avatar.png',
    };
    employeesStoreState.employee = employee;
    employeesStoreState.currentEmployee = employee;
    employeesStoreState.employees = [{ employee_id: 'mgr-1', fullname: 'Manager Demo' }];
    enterprisesStoreState.enterprises = [
      {
        enterprise_id: 'ent-1',
        name: 'Empresa Demo',
        departments: [{ department_id: 'dep-1', name: 'Sistemas' }],
      },
    ];
    enterprisesStoreState.fetchWorkpositionsByDepartment = vi
      .fn()
      .mockResolvedValue([{ workposition_id: 'wp-1', name: 'Developer' }]);
    queryParams = { idEmployee: 'emp-1' };

    renderHook(() => useCreateEemployee());

    await act(async () => {
      await Promise.resolve();
    });

    const workpositionField = updateFieldCalls
      .filter((call) => call.name === 'workposition')
      .at(-1);

    expect(workpositionField?.changes).toMatchObject({
      value: '',
      options: [{ label: 'Developer', value: 'wp-1' }],
      disabled: false,
    });
  });
});
