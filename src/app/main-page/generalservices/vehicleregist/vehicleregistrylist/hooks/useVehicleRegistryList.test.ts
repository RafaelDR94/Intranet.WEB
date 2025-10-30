import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useVehicleRegistryList from './useVehicleRegistryList';

const {
  useTransportStoreMock,
  transportStoreState,
  fetchAssignments,
  setCurrentAssignment,
  resetCurrentAssignment,
  reset,
  resetFlags,
  usePrincipal,
  routerPush,
} = vi.hoisted(() => {
  const fetchAssignmentsFn = vi.fn();
  const setCurrentAssignmentFn = vi.fn();
  const resetCurrentAssignmentFn = vi.fn();
  const resetFn = vi.fn();
  const resetFlagsFn = vi.fn();

  const state = {
    assignments: [
      {
        vehicleassignments_id: 'A1',
        departure_date: '2024-01-02T10:30:00Z',
        status: { status: 'En Transito' },
        transport: { brand: 'Nissan', model: 'Versa', UnitType: 'Sedan', plates: 'ABC' },
        name: 'Alice',
        destination: 'Oficina',
      },
      {
        vehicleassignments_id: 'A2',
        departure_date: '2024-01-01T09:00:00Z',
        arrival_date: '2024-01-01T18:00:00Z',
        status: { status: 'Finalizado' },
        transport: { brand: 'VW', model: 'Vento', UnitType: '', plates: 'XYZ' },
        name: 'Bob',
        destination: 'Bodega',
      },
    ],
    fetchAssignments: fetchAssignmentsFn,
    loadingAssignments: false,
    successGetAssignments: true,
    setCurrentAssignment: setCurrentAssignmentFn,
    resetCurrentAssignment: resetCurrentAssignmentFn,
    reset: resetFn,
    error: null as string | null,
    resetFlags: resetFlagsFn,
  };

  const hook = vi.fn((selector: any) => selector(state));

  const usePrincipalMock = vi.fn(() => ({
    usePrincipalLoading: {
      showSpinner: vi.fn(),
      hideSpinner: vi.fn(),
    },
    usePrincipalAlert: {
      showAlert: vi.fn(),
    },
  }));

  const pushFn = vi.fn();

  return {
    useTransportStoreMock: hook,
    transportStoreState: state,
    fetchAssignments: fetchAssignmentsFn,
    setCurrentAssignment: setCurrentAssignmentFn,
    resetCurrentAssignment: resetCurrentAssignmentFn,
    reset: resetFn,
    resetFlags: resetFlagsFn,
    usePrincipal: usePrincipalMock,
    routerPush: pushFn,
  };
});

vi.mock('@/app/stores/useTransportStore/useTransportStore', () => ({
  useTransportStore: useTransportStoreMock,
}));

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: routerPush }),
}));

describe('useVehicleRegistryList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    transportStoreState.assignments = [...transportStoreState.assignments];
    transportStoreState.error = null;
  });

  it('fetches assignments on mount and splits rows', () => {
    const { result } = renderHook(() => useVehicleRegistryList());

    expect(fetchAssignments).toHaveBeenCalledWith(true);
    expect(result.current.inTransitRows).toHaveLength(1);
    expect(result.current.otherRows).toHaveLength(1);
    expect(result.current.searchableKeys).toContain('driver');
  });

  it('handles arrival navigation and panel state', () => {
    const { result } = renderHook(() => useVehicleRegistryList());
    const assignment = transportStoreState.assignments[0] as any;

    act(() => {
      result.current.handleArrive(assignment);
    });
    expect(resetCurrentAssignment).toHaveBeenCalled();
    expect(setCurrentAssignment).toHaveBeenCalledWith(assignment);
    expect(routerPush).toHaveBeenCalledWith(
      `/main-page/generalservices/vehicleregist/vehicleregistry?id=${assignment.vehicleassignments_id}`
    );

    act(() => {
      result.current.handleOpenDetails(assignment);
    });
    expect(setCurrentAssignment).toHaveBeenCalledWith(assignment);

    act(() => {
      result.current.handleCloseDetails();
    });
    expect(resetCurrentAssignment).toHaveBeenCalledTimes(2);
  });

  it('refreshes assignments via reset', () => {
    const { result } = renderHook(() => useVehicleRegistryList());
    act(() => {
      result.current.handleRefresh();
    });
    expect(reset).toHaveBeenCalled();
    expect(fetchAssignments).toHaveBeenCalledTimes(2);
  });
});
