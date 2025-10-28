import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useVehicleRegistry from './useVehicleRegistry';

const {
  submitRef,
  setFormReady,
  syncFormValues,
  useInitFormReturn,
  vehicleImagesStoreState,
  resetAll,
  useVehicleRegistryImagesStoreMock,
  queryAllState,
  sumbitPost,
  showAlert,
  push,
  resetCurrentAssignment,
  useTransportStoreState,
  useTransportStoreMock,
} = vi.hoisted(() => {
  const submitRefValue = { current: vi.fn() };
  const setFormReadyFn = vi.fn();
  const syncFormValuesFn = vi.fn();
  const useInitFormReturnValue = {
    submitRef: submitRefValue,
    formReady: true,
    setFormReady: setFormReadyFn,
    fields: [],
    formVersion: 1,
    syncFormValues: syncFormValuesFn,
    formId: 'departure-form',
  };

  const resetAllFn = vi.fn();
  const vehicleImagesStoreStateValue = {
    slots: [
      { id: 'front', title: 'Frontal', imageSrc: 'data:image', file: null },
      { id: 'rear', title: 'Trasera', imageSrc: 'data:image', file: null },
    ],
    signature: 'signature-data',
    resetAll: resetAllFn,
  };
  const useVehicleRegistryImagesStoreMockFn = vi.fn((selector: any) =>
    selector(vehicleImagesStoreStateValue)
  );

  const queryAllStateValue = {
    place: 'departure',
    id: '123',
  };

  const sumbitPostFn = vi.fn();
  const showAlertFn = vi.fn();
  const pushFn = vi.fn();
  const resetCurrentAssignmentFn = vi.fn();
  const useTransportStoreStateValue = {
    currentAssignment: null as null | { vehicleassignments_id: string },
    resetCurrentAssignment: resetCurrentAssignmentFn,
  };
  const useTransportStoreMockFn = vi.fn((selector: any) =>
    selector(useTransportStoreStateValue)
  );

  return {
    submitRef: submitRefValue,
    setFormReady: setFormReadyFn,
    syncFormValues: syncFormValuesFn,
    useInitFormReturn: useInitFormReturnValue,
    vehicleImagesStoreState: vehicleImagesStoreStateValue,
    resetAll: resetAllFn,
    useVehicleRegistryImagesStoreMock: useVehicleRegistryImagesStoreMockFn,
    queryAllState: queryAllStateValue,
    sumbitPost: sumbitPostFn,
    showAlert: showAlertFn,
    push: pushFn,
    resetCurrentAssignment: resetCurrentAssignmentFn,
    useTransportStoreState: useTransportStoreStateValue,
    useTransportStoreMock: useTransportStoreMockFn,
  };
});

vi.mock('./useInitForm', () => ({
  __esModule: true,
  default: vi.fn(() => useInitFormReturn),
}));

vi.mock('@/app/stores/useVehicleRegistryImagesStore/useVehicleRegistryImagesStore', () => ({
  useVehicleRegistryImagesStore: useVehicleRegistryImagesStoreMock,
}));

vi.mock('@/app/hooks/useQuery/useQuery', () => ({
  __esModule: true,
  default: () => ({
    all: queryAllState,
  }),
}));

vi.mock('./useSubmitForm', () => ({
  __esModule: true,
  default: () => ({
    sumbitPost,
  }),
}));

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalAlert: { showAlert },
  }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

vi.mock('@/app/stores/useTransportStore/useTransportStore', () => ({
  useTransportStore: useTransportStoreMock,
}));

describe('useVehicleRegistry', () => {
  beforeEach(() => {
    sumbitPost.mockReset();
    showAlert.mockClear();
    push.mockClear();
    resetCurrentAssignment.mockClear();
    resetAll.mockClear();
    queryAllState.place = 'departure';
    queryAllState.id = '123';
    useTransportStoreState.currentAssignment = null;
    vehicleImagesStoreState.signature = 'signature-data';
  });

  it('provides departure titles when place query is not arrive', () => {
    const { result } = renderHook(() => useVehicleRegistry());
    expect(result.current.title).toBe('Registro Vehicular de Salida');
    expect(result.current.submitLabel).toBe('Registrar Salida');
    expect(result.current.formIsCompleted).toBe(true);
  });

  it('switches to arrive copy when query indicates arrive', () => {
    queryAllState.place = 'arrive';
    const { result } = renderHook(() => useVehicleRegistry());
    expect(result.current.title).toBe('Registro Vehicular de Entrada');
    expect(result.current.submitLabel).toBe('Registrar Entrada');
  });

  it('advances and returns to form view using handlers', () => {
    const { result } = renderHook(() => useVehicleRegistry());
    expect(result.current.currentView).toBe('form');

    act(() => {
      result.current.handleNext();
    });
    expect(result.current.currentView).toBe('pictures');

    act(() => {
      result.current.handleBack();
    });
    expect(result.current.currentView).toBe('form');
  });

  it('submits data successfully, shows feedback and redirects', async () => {
    sumbitPost.mockResolvedValueOnce(undefined);
    vi.useFakeTimers();
    const { result } = renderHook(() => useVehicleRegistry());

    try {
      await act(async () => {
        await result.current.handleSubmit({ driver: '1' });
      });

      expect(sumbitPost).toHaveBeenCalled();
      expect(showAlert).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success' })
      );

      vi.runAllTimers();
      expect(push).toHaveBeenCalledWith('/main-page/generalservices/vehicleregist/vehicleregistrylist/');
    } finally {
      vi.useRealTimers();
    }
  });

  it('shows warning alert when submission fails', async () => {
    sumbitPost.mockRejectedValueOnce(new Error('boom'));
    const { result } = renderHook(() => useVehicleRegistry());

    await act(async () => {
      await result.current.handleSubmit({});
    });

    expect(showAlert).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'warning' })
    );
  });

  it('resets assignment when query id is undefined literal', () => {
    queryAllState.id = 'undefined';
    renderHook(() => useVehicleRegistry());
    expect(resetCurrentAssignment).toHaveBeenCalled();
    expect(resetAll).toHaveBeenCalled();
  });
});
