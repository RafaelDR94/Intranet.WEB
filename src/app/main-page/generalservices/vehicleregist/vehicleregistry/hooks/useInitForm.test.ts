import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { FieldModel } from '@/app/components/DynamicForm/types';
import useInitForm from './useInitForm';

const {
  formFieldsState,
  setFields,
  resetFields,
  updateField,
  useFormFieldsStoreMock,
} = vi.hoisted(() => {
  const state = {
    fieldsByFormId: {
      'departure-form': [] as FieldModel[],
      'arrive-form': [] as FieldModel[],
    },
    formVersionsByFormId: {
      'departure-form': 0,
      'arrive-form': 0,
    } as Record<string, number>,
  };

  const incrementVersion = (formId: string) => {
    state.formVersionsByFormId[formId] =
      (state.formVersionsByFormId[formId] ?? 0) + 1;
  };

  const setFieldsMock = vi.fn((formId: string, fields: FieldModel[]) => {
    state.fieldsByFormId[formId] = fields;
    incrementVersion(formId);
  });

  const resetFieldsMock = vi.fn((formId: string) => {
    state.fieldsByFormId[formId] = [];
    incrementVersion(formId);
  });

  const updateFieldMock = vi.fn(
    (formId: string, name: string, patch: Partial<FieldModel>) => {
      const fields = state.fieldsByFormId[formId] ?? [];
      const index = fields.findIndex((field) => field.name === name);
      if (index !== -1) {
        fields[index] = { ...fields[index], ...patch };
      }
      incrementVersion(formId);
    }
  );

  const hook = Object.assign(
    (selector: (store: typeof state) => unknown) => selector(state),
    {
      getState: () => ({
        ...state,
        setFields: setFieldsMock,
        resetFields: resetFieldsMock,
        updateField: updateFieldMock,
      }),
    }
  );

  return {
    formFieldsState: state,
    setFields: setFieldsMock,
    resetFields: resetFieldsMock,
    updateField: updateFieldMock,
    useFormFieldsStoreMock: hook,
  };
});

const {
  employeesStoreState,
  useEmployeesStoreMock,
} = vi.hoisted(() => {
  const state = {
    employees: [
      { employee_id: 'driver-1', fullname: 'Alice Example' },
    ] as Array<{ employee_id: string; fullname: string }>,
    fetchEmployees: vi.fn(),
    reset: vi.fn(),
    error: undefined as string | undefined,
  };
  const hook = (selector: any) => selector(state);
  return { employeesStoreState: state, useEmployeesStoreMock: hook };
});

const {
  transportsStore,
  useTransportStoreMock,
} = vi.hoisted(() => {
  const state = {
    transports: [
      {
        transport_id: 'vehicle-1',
        brand: 'Nissan',
        model: 'Versa',
        plates: 'ABC123',
      },
    ] as Array<{
      transport_id: string;
      brand?: string;
      model?: string;
      plates?: string;
      vehicletrackinglist?: unknown[];
    }>,
    fetchTransports: vi.fn(),
    currentAssignment: null as null | { vehicleassignments_id: string; vehicletrackinglist?: unknown[] },
    fetchAssignmentById: vi.fn(),
    loadingAssignments: false,
    error: undefined as string | undefined,
  };
  const hook = (selector: any) => selector(state);
  return { transportsStore: state, useTransportStoreMock: hook };
});

const usePrincipalLoading = {
  showSpinner: vi.fn(),
  hideSpinner: vi.fn(),
};

vi.mock('@/app/stores/useFormFieldsStore/useFormFieldsStore', () => ({
  useFormFieldsStore: useFormFieldsStoreMock,
}));

vi.mock('@/app/stores/useEmployeesStore/useEmployeesStore', () => ({
  useEmployeesStore: useEmployeesStoreMock,
}));

vi.mock('@/app/stores/useTransportStore/useTransportStore', () => ({
  useTransportStore: useTransportStoreMock,
}));

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalLoading,
  }),
}));

const departureFormId = 'departure-form';
const arriveFormId = 'arrive-form';

describe('useInitForm', () => {
  beforeEach(() => {
    formFieldsState.fieldsByFormId[departureFormId] = [];
    formFieldsState.fieldsByFormId[arriveFormId] = [];
    formFieldsState.formVersionsByFormId[departureFormId] = 0;
    formFieldsState.formVersionsByFormId[arriveFormId] = 0;
    setFields.mockClear();
    resetFields.mockClear();
    updateField.mockClear();
    employeesStoreState.employees.splice(
      0,
      employeesStoreState.employees.length,
      { employee_id: 'driver-1', fullname: 'Alice Example' },
    );
    employeesStoreState.fetchEmployees.mockClear();
    transportsStore.transports.splice(
      0,
      transportsStore.transports.length,
      {
        transport_id: 'vehicle-1',
        brand: 'Nissan',
        model: 'Versa',
        plates: 'ABC123',
      },
    );
    transportsStore.fetchTransports.mockClear();
    transportsStore.fetchAssignmentById.mockClear();
    transportsStore.currentAssignment = null;
    usePrincipalLoading.showSpinner.mockClear();
    usePrincipalLoading.hideSpinner.mockClear();
  });

  it('returns departure form metadata when initialized for departure', async () => {
    const { result } = renderHook(() => useInitForm('departure'));

    await waitFor(() => expect(setFields).toHaveBeenCalled());

    expect(result.current.formId).toBe(departureFormId);
    expect(Array.isArray(result.current.fields)).toBe(true);
  });

  it('resets both forms when ResetForms is invoked', async () => {
    const { result } = renderHook(() => useInitForm('departure'));
    await waitFor(() => expect(setFields).toHaveBeenCalled());

    setFields.mockClear();
    act(() => {
      result.current.ResetForms();
    });

    expect(setFields).toHaveBeenCalledWith(departureFormId, []);
    expect(setFields).toHaveBeenCalledWith(arriveFormId, []);
  });

  it('syncs changed values and avoids redundant updates', async () => {
    const { result, rerender } = renderHook(() => useInitForm('departure'));

    await waitFor(() => expect(setFields).toHaveBeenCalled());

    const driverField: FieldModel = {
      name: 'driver',
      type: 'select',
      label: 'Conductor',
      value: 'driver-1',
    };

    setFields.mockClear();
    setFields(departureFormId, [driverField]);
    rerender();
    updateField.mockClear();

    act(() => {
      result.current.syncFormValues({ driver: 'driver-2' });
    });

    expect(updateField).toHaveBeenCalledWith(
      departureFormId,
      'driver',
      expect.objectContaining({ value: 'driver-2' })
    );

    formFieldsState.fieldsByFormId[departureFormId][0] = {
      ...driverField,
      value: 'driver-2',
    };
    updateField.mockClear();
    rerender();

    act(() => {
      result.current.syncFormValues({ driver: 'driver-2' });
    });

    expect(updateField).not.toHaveBeenCalled();
  });

  it('triggers fetchers when employees or transports are missing', async () => {
    employeesStoreState.employees.splice(0, employeesStoreState.employees.length);
    transportsStore.transports.splice(0, transportsStore.transports.length);

    renderHook(() => useInitForm('departure'));

    await waitFor(() => {
      expect(employeesStoreState.fetchEmployees).toHaveBeenCalled();
      expect(transportsStore.fetchTransports).toHaveBeenCalled();
    });
  });
});
