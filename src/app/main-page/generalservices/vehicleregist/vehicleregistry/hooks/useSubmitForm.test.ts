import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useSubmitForm from './useSubmitForm';

const { uploadFile } = vi.hoisted(() => ({
  uploadFile: vi.fn(() => Promise.resolve()),
}));

vi.mock('@/app/context/FirebaseContext/FirebaseContext', () => ({
  useFirebase: () => ({
    firebasestorage: { uploadFile },
  }),
}));

const {
  vehicleImagesState,
  useVehicleRegistryImagesStoreMock,
} = vi.hoisted(() => {
  const state = {
    signature: '',
    signatureResponsibleId: '',
    slots: [
      { id: 'front', title: 'Frontal', imageSrc: 'data:image-front', file: null },
      { id: 'license', title: 'Licencia de conducir', imageSrc: 'data:image-license', file: null },
    ],
  };

  const hook = Object.assign(
    (selector?: (store: typeof state) => unknown) =>
      selector ? selector(state) : state,
    {
      getState: () => state,
    }
  );

  return {
    vehicleImagesState: state,
    useVehicleRegistryImagesStoreMock: hook,
  };
});

vi.mock('@/app/stores/useVehicleRegistryImagesStore/useVehicleRegistryImagesStore', () => ({
  useVehicleRegistryImagesStore: useVehicleRegistryImagesStoreMock,
}));

const { base64ToBlob } = vi.hoisted(() => ({
  base64ToBlob: vi.fn(() => 'blob'),
}));

vi.mock('@/app/utilities/PicturesHelper/PictureHelper', () => ({
  base64ToBlob,
}));

const {
  transportStoreState,
  useTransportStoreMock,
  createAssignment,
  createVehicleTracking,
  resetFlags,
} = vi.hoisted(() => {
  const createAssignmentFn = vi.fn();
  const createVehicleTrackingFn = vi.fn();
  const resetFlagsFn = vi.fn();
  const state = {
    createAssignment: createAssignmentFn,
    createVehicleTracking: createVehicleTrackingFn,
    currentAssignment: null as null | { vehicleassignments_id: string },
    error: '',
    resetFlags: resetFlagsFn,
  };
  const hook = (selector: any) => selector(state);
  return {
    transportStoreState: state,
    useTransportStoreMock: hook,
    createAssignment: createAssignmentFn,
    createVehicleTracking: createVehicleTrackingFn,
    resetFlags: resetFlagsFn,
  };
});

vi.mock('@/app/stores/useTransportStore/useTransportStore', () => ({
  useTransportStore: useTransportStoreMock,
}));

const { showAlert, showSpinner, hideSpinner } = vi.hoisted(() => ({
  showAlert: vi.fn(),
  showSpinner: vi.fn(),
  hideSpinner: vi.fn(),
}));

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalAlert: { showAlert },
    usePrincipalLoading: { showSpinner, hideSpinner },
  }),
}));

const buildValues = () => ({
  driver: 'driver-1',
  vehicle: 'vehicle-1',
  destination: 'Destino',
  documentsChecklist: ['card', 'fuel_card'],
  toolsChecklist: ['jack', 'spare_tire'],
  fuelLevel: '3.5',
  mileage: 123,
  date: '2024-01-01T00:00',
});

describe('useSubmitForm', () => {
  beforeEach(() => {
    uploadFile.mockClear();
    createAssignment.mockReset();
    createVehicleTracking.mockReset();
    base64ToBlob.mockClear();
    showAlert.mockClear();
    showSpinner.mockClear();
    hideSpinner.mockClear();
    transportStoreState.currentAssignment = null;
    transportStoreState.error = '';
    vehicleImagesState.signature = '';
    vehicleImagesState.slots[0].imageSrc = 'data:image-front';
    vehicleImagesState.slots[1].imageSrc = 'data:image-license';
  });

  it('submits tracking for an existing assignment without creating a new one', async () => {
    transportStoreState.currentAssignment = { vehicleassignments_id: 'ASSIGN-1' };
    createVehicleTracking.mockResolvedValueOnce({ id: 'tracking' });

    const { result } = renderHook(() => useSubmitForm());

    await act(async () => {
      await result.current.sumbitPost({
        ...buildValues(),
        documentsChecklist: ['card'],
        toolsChecklist: ['jack'],
      });
    });

    expect(createAssignment).not.toHaveBeenCalled();
    expect(createVehicleTracking).toHaveBeenCalledWith(
      expect.objectContaining({
        idVehicleAssigment: 'ASSIGN-1',
        vehicleEntryExit: true,
      })
    );
    expect(uploadFile).toHaveBeenCalledTimes(1);
    expect(hideSpinner).toHaveBeenCalled();
  });

  it('creates assignment, uploads signature and tracking when no assignment exists', async () => {
    transportStoreState.currentAssignment = null;
    vehicleImagesState.signature = 'data:image/png;base64,SIGN';
    createAssignment.mockResolvedValueOnce({ vehicleassignments_id: 'ASSIGN-2' });
    createVehicleTracking.mockResolvedValueOnce({ id: 'tracking' });

    const { result } = renderHook(() => useSubmitForm());

    await act(async () => {
      await result.current.sumbitPost(buildValues());
    });

    expect(createAssignment).toHaveBeenCalledWith(
      expect.objectContaining({
        employee_id: 'driver-1',
        transport_id: 'vehicle-1',
      })
    );
    expect(base64ToBlob).toHaveBeenCalledWith('data:image/png;base64,SIGN');
    expect(uploadFile).toHaveBeenCalled();
    expect(createVehicleTracking).toHaveBeenCalledWith(
      expect.objectContaining({
        idVehicleAssigment: 'ASSIGN-2',
        vehicleEntryExit: false,
      })
    );
  });

  it('shows error alert when store reports an error', () => {
    transportStoreState.error = 'No se pudo registrar';
    renderHook(() => useSubmitForm());

    expect(showAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        description: 'No se pudo registrar',
      })
    );
  });
});
