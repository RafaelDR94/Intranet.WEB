import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useSignatures, { fetchVehicleSignature } from './useSignatures';

const {
  firebasestorage,
  useFirebaseMock,
  transportStoreState,
  useTransportStoreMock,
  mediaStoreState,
  useVehicleMediaStoreMock,
  setSignature,
  setLoading,
  setError,
} = vi.hoisted(() => {
  const storage = {
    storage: {},
    downloadFile: vi.fn(async () => 'https://example/signature.png'),
  };

  const useFirebase = vi.fn(() => ({ firebasestorage: storage }));

  const transportState = {
    currentAssignment: {
      vehicleassignments_id: 'A1',
      signature_employee: null,
      name: 'Alice',
      arrival_date: '2024-01-01',
    },
  };
  const useTransportStore = vi.fn(() => transportState);

  const mediaState = {
    mediaByAssignment: {} as any,
    setSignature: vi.fn(),
    setLoading: vi.fn(),
    setError: vi.fn(),
  };
  const hook = vi.fn((selector: any) => selector(mediaState));
  Object.assign(hook, { getState: () => mediaState });

  return {
    firebasestorage: storage,
    useFirebaseMock: useFirebase,
    transportStoreState: transportState,
    useTransportStoreMock: useTransportStore,
    mediaStoreState: mediaState,
    useVehicleMediaStoreMock: hook,
    setSignature: mediaState.setSignature,
    setLoading: mediaState.setLoading,
    setError: mediaState.setError,
  };
});

vi.mock('@/app/context/FirebaseContext/FirebaseContext', () => ({
  useFirebase: useFirebaseMock,
}));

vi.mock('@/app/stores/useTransportStore/useTransportStore', () => ({
  useTransportStore: useTransportStoreMock,
}));

vi.mock('@/app/stores/useVehicleMediaStore/useVehicleMediaStore', () => ({
  __esModule: true,
  default: useVehicleMediaStoreMock,
}));

describe('useSignatures', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mediaStoreState.mediaByAssignment = {};
    transportStoreState.currentAssignment = {
      vehicleassignments_id: 'A1',
      signature_employee: null,
      name: 'Alice',
      arrival_date: '2024-01-01',
    };
  });

  it('downloads signature when not cached', async () => {
    const { result } = renderHook(() => useSignatures());
    await act(async () => {
      await result.current.refresh();
    });

    expect(firebasestorage.downloadFile).toHaveBeenCalled();
    expect(setSignature).toHaveBeenCalledWith('A1', 'https://example/signature.png');
    expect(setLoading).toHaveBeenLastCalledWith('A1', 'signature', false);
  });

  it('uses embedded signature when available', () => {
    transportStoreState.currentAssignment.signature_employee = 'https://embedded/signature.png';
    renderHook(() => useSignatures());
    expect(setSignature).toHaveBeenCalledWith(
      'A1',
      'https://embedded/signature.png'
    );
    expect(firebasestorage.downloadFile).not.toHaveBeenCalled();
  });

  it('builds error message when download fails', async () => {
    firebasestorage.downloadFile.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useSignatures());

    await act(async () => {
      await result.current.refresh();
    });

    expect(setError).toHaveBeenCalledWith('A1', 'signature', 'fail');
  });

  it('fetchVehicleSignature returns null when storage missing', async () => {
    const url = await fetchVehicleSignature(null, 'A1', 'departure');
    expect(url).toBeNull();
  });
});
