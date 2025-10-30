import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useInformation, {
  buildVehicleName,
  findDepartureAndArrival,
  formatFuelLevel,
  formatMileage,
  formatRemarks,
  TOOL_CHECKLIST,
  DOCUMENT_CHECKLIST,
} from './useInformation';

const {
  useTransportStoreMock,
  transportStoreState,
} = vi.hoisted(() => {
  const state = {
    currentAssignment: {
      destination: 'Oficina',
      name: 'Alice',
      transport: { brand: 'Nissan', model: 'Versa', UnitType: 'Sedan' },
      vehicletrackinglist: [
        {
          vehicleEntryExit: false,
          mileage: '1200',
          fuelLevel: '0.5',
          remarks: 'Todo bien',
          mechanicalOrhydraulicjack: true,
          keytoRemoveStuds: false,
          sparetire: true,
          circulationcard: true,
          fuelCard: false,
          tagOrpas: true,
          insurancePolicy: true,
          platesDelYtra: false,
        },
        {
          vehicleEntryExit: true,
          mileage: '1300',
          fuelLevel: '0.25',
          remarks: '',
        },
      ],
    },
  };

  const hook = vi.fn((selector?: any) =>
    typeof selector === 'function' ? selector(state) : state
  );
  return { useTransportStoreMock: hook, transportStoreState: state };
});

vi.mock('@/app/stores/useTransportStore/useTransportStore', () => ({
  useTransportStore: useTransportStoreMock,
}));

describe('useInformation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('formats general info and tracking details', () => {
    const { result } = renderHook(() => useInformation());
    expect(result.current.generalRows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: 'Destino', value: 'Oficina' }),
      ])
    );
    expect(result.current.departure?.fuelLevel).toBe('1/2');
    expect(result.current.arrival?.remarks).toBe('Sin observaciones');
    expect(result.current.checklistDefinitions.tools.options).toEqual(
      TOOL_CHECKLIST
    );
    expect(result.current.checklistDefinitions.documents.options).toEqual(
      DOCUMENT_CHECKLIST
    );
  });

  it('helpers format values correctly', () => {
    expect(formatFuelLevel('0.5')).toBe('1/2');
    expect(formatMileage('1300')).toContain('1,300');
    expect(formatRemarks('')).toBe('Sin observaciones');
    expect(buildVehicleName(undefined)).toBe('--');
    expect(buildVehicleName({ transport: { brand: 'VW' } } as any)).toBe('VW');
  });

  it('finds departure and arrival correctly', () => {
    const trackings = transportStoreState.currentAssignment.vehicletrackinglist as any;
    const { departure, arrival } = findDepartureAndArrival(trackings);
    expect(departure?.vehicleEntryExit).toBe(false);
    expect(arrival?.vehicleEntryExit).toBe(true);
  });
});
