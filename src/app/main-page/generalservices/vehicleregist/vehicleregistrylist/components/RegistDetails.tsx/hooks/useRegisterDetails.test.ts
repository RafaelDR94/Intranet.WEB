import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useRegisterDetails from './useRegisterDetails';

const {
  transportStoreState,
  useTransportStoreMock,
  fetchAssignmentById,
  usePrincipalMock,
  makeDocument,
  makeResponsive,
  createPdf,
  showAlert,
  showSpinner,
  hideSpinner,
} = vi.hoisted(() => {
  const fetchAssignmentByIdFn = vi.fn();
  const state = {
    currentAssignment: {
      vehicleassignments_id: 'A1',
      vehicletrackinglist: [
        { vehicleEntryExit: false, date: '2024-01-01T08:00:00Z' },
        { vehicleEntryExit: true, date: '2024-01-01T20:00:00Z' },
      ],
      employee_id: 'E1',
      transport: { transport_id: 'T1' },
      destination: 'Oficina',
    },
    fetchAssignmentById: fetchAssignmentByIdFn,
    error: '',
    loadingdetails: false,
  };

  const hook = vi.fn((selector: any) => selector(state));

  const makeDocumentFn = vi.fn();
  const makeResponsiveFn = vi.fn();

  const createPdfFn = vi.fn();

  const showAlertFn = vi.fn();
  const showSpinnerFn = vi.fn();
  const hideSpinnerFn = vi.fn();

  const usePrincipal = vi.fn(() => ({
    usePrincipalAlert: { showAlert: showAlertFn },
    usePrincipalLoading: { showSpinner: showSpinnerFn, hideSpinner: hideSpinnerFn },
  }));

  return {
    transportStoreState: state,
    useTransportStoreMock: hook,
    fetchAssignmentById: fetchAssignmentByIdFn,
    usePrincipalMock: usePrincipal,
    makeDocument: makeDocumentFn,
    makeResponsive: makeResponsiveFn,
    createPdf: createPdfFn,
    showAlert: showAlertFn,
    showSpinner: showSpinnerFn,
    hideSpinner: hideSpinnerFn,
  };
});

vi.mock('@/app/stores/useTransportStore/useTransportStore', () => ({
  useTransportStore: useTransportStoreMock,
}));

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: usePrincipalMock,
}));

vi.mock('@/app/utilities/PDF/PDF', () => ({
  CreatePDF: (...args: any[]) => createPdf(...args),
}));

vi.mock('../../../../hooks/useVehicleDocuments', () => ({
  __esModule: true,
  default: () => ({
    canGenerate: true,
    makeDocument,
    makeResponsive,
  }),
}));

const originalCreateElement = document.createElement.bind(document);

describe('useRegisterDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    transportStoreState.currentAssignment = {
      vehicleassignments_id: 'A1',
      vehicletrackinglist: [
        { vehicleEntryExit: false, date: '2024-01-01T08:00:00Z' },
        { vehicleEntryExit: true, date: '2024-01-01T20:00:00Z' },
      ],
      employee_id: 'E1',
      transport: { transport_id: 'T1' },
    } as any;
    createPdf.mockImplementation(async (_data: unknown, resolve: (url: string) => void) => {
      resolve('blob:pdf');
    });
    document.createElement = vi.fn(((tag: string) => {
      const element = originalCreateElement(tag);
      if (tag === 'a') {
        Object.defineProperty(element, 'click', {
          configurable: true,
          value: vi.fn(),
        });
      }
      return element;
    }) as typeof document.createElement);
  });

  afterAll(() => {
    document.createElement = originalCreateElement;
  });

  it('exposes assignment data and handles pdf generation for departure', async () => {
    makeDocument.mockResolvedValueOnce({});
    const { result } = renderHook(() => useRegisterDetails());

    await act(async () => {
      await result.current.handleDownloadDocument('departure');
    });

    expect(makeDocument).toHaveBeenCalledWith(false);
    expect(createPdf).toHaveBeenCalled();
    expect(showAlert).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'info' })
    );
    expect(hideSpinner).toHaveBeenCalled();
  });

  it('shows warning when arrival data missing', async () => {
    transportStoreState.currentAssignment = {
      vehicleassignments_id: 'A1',
      vehicletrackinglist: [{ vehicleEntryExit: false, date: '2024-01-01T08:00:00Z' }],
    } as any;

    const { result } = renderHook(() => useRegisterDetails());
    await act(async () => {
      await result.current.handleDownloadDocument('arrival');
    });

    expect(showAlert).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'warning' })
    );
    expect(makeDocument).not.toHaveBeenCalledWith(true);
  });

  it('generates responsive document when data is complete', async () => {
    makeResponsive.mockResolvedValueOnce({});
    const { result } = renderHook(() => useRegisterDetails());

    await act(async () => {
      await result.current.handleDownloadResponsive();
    });

    expect(makeResponsive).toHaveBeenCalledWith(
      expect.objectContaining({
        employeeId: 'E1',
        vehicleId: 'T1',
        period: expect.objectContaining({
          startIso: '2024-01-01T08:00:00Z',
          endIso: '2024-01-01T20:00:00Z',
        }),
      }),
    );
    expect(createPdf).toHaveBeenCalled();
    expect(showAlert).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'info' })
    );
  });

  it('generates one responsive per accepted driver segment', async () => {
    transportStoreState.currentAssignment = {
      vehicleassignments_id: 'A1',
      departure_date: '2024-01-01T08:00:00Z',
      arrival_date: '2024-01-01T20:00:00Z',
      vehicletrackinglist: [
        { vehicleEntryExit: false, date: '2024-01-01T08:00:00Z' },
        { vehicleEntryExit: true, date: '2024-01-01T20:00:00Z' },
      ],
      employee_id: 'E1',
      transport: { transport_id: 'T1' },
      vehicle_reassignment: [
        {
          id: 'R1',
          id_vehicle_assignment: 'A1',
          id_previous_employee: null,
          previous_employee_name: null,
          id_new_employee: 'E1',
          new_employee_name: 'Driver 1',
          id_status: 'S-A',
          status: 'Aceptado',
          comment: null,
          date_created: '2024-01-01T08:00:00Z',
        },
        {
          id: 'R2',
          id_vehicle_assignment: 'A1',
          id_previous_employee: 'E1',
          previous_employee_name: 'Driver 1',
          id_new_employee: 'E2',
          new_employee_name: 'Driver 2',
          id_status: 'S-A',
          status: 'Aceptado',
          comment: null,
          date_created: '2024-01-01T12:00:00Z',
        },
      ],
    } as any;

    makeResponsive.mockResolvedValue({});

    const { result } = renderHook(() => useRegisterDetails());

    await act(async () => {
      await result.current.handleDownloadResponsive();
    });

    expect(makeResponsive).toHaveBeenCalledTimes(2);
    expect(makeResponsive).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        employeeId: 'E1',
        signatureUrl: '',
        period: expect.objectContaining({
          startIso: '2024-01-01T08:00:00Z',
          endIso: '2024-01-01T12:00:00Z',
        }),
      }),
    );
    expect(makeResponsive).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        employeeId: 'E2',
        signatureUrl: '',
        period: expect.objectContaining({
          startIso: '2024-01-01T12:00:00Z',
          endIso: '2024-01-01T20:00:00Z',
        }),
      }),
    );
    expect(createPdf).toHaveBeenCalledTimes(2);
  });

  it('fetches assignment details when tracking missing', () => {
    transportStoreState.currentAssignment = {
      vehicleassignments_id: 'A2',
      vehicletrackinglist: [],
    } as any;

    renderHook(() => useRegisterDetails());
    expect(fetchAssignmentById).toHaveBeenCalledWith('A2', true);
  });
});
