import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createVehiclePicturesHook,
  fetchVehiclePictures,
  PicturesModel,
} from './useVehiclePictures';

const {
  firebasestorage,
  useFirebaseMock,
  useTransportStoreMock,
  mediaStoreState,
  useVehicleMediaStoreMock,
  setPictures,
  setLoading,
  setError,
} = vi.hoisted(() => {
  const storage = {
    storage: {},
    downloadFile: vi.fn(async (path: string) => `data:${path}`),
  };

  const useFirebase = vi.fn(() => ({ firebasestorage: storage }));

  const transport = {
    currentAssignment: { vehicleassignments_id: 'A1' },
  };

  const useTransportStore = vi.fn(() => transport);

  const state = {
    mediaByAssignment: {} as Record<
      string,
      {
        pictures?: Record<'arrive' | 'departure', any[] | undefined>;
        loading?: Record<'arrive' | 'departure' | 'signature', boolean>;
        errors?: Record<'arrive' | 'departure' | 'signature', string | undefined>;
      }
    >,
    setPictures: vi.fn(),
    setLoading: vi.fn(),
    setError: vi.fn(),
  };

  const hook = vi.fn((selector?: any) =>
    typeof selector === 'function' ? selector(state) : state
  );

  return {
    firebasestorage: storage,
    useFirebaseMock: useFirebase,
    useTransportStoreMock: useTransportStore,
    mediaStoreState: state,
    useVehicleMediaStoreMock: hook,
    setPictures: state.setPictures,
    setLoading: state.setLoading,
    setError: state.setError,
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
  default: Object.assign(useVehicleMediaStoreMock, {
    getState: () => mediaStoreState,
  }),
}));

describe('useVehiclePictures factory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mediaStoreState.mediaByAssignment = {};
  });

  it('fetches pictures from firebase when not cached', async () => {
    const useDeparturePictures = createVehiclePicturesHook('departure');
    const { result } = renderHook(() => useDeparturePictures());

    expect(setLoading).toHaveBeenCalledWith('A1', 'departure', true);

    await act(async () => {
      await result.current.refresh();
    });

    expect(setPictures).toHaveBeenCalledWith(
      'A1',
      'departure',
      expect.arrayContaining([
        expect.objectContaining({ title: PicturesModel[0].title }),
      ])
    );
    expect(setError).toHaveBeenCalledWith('A1', 'departure', undefined);
  });

  it('returns cached items when available', async () => {
    mediaStoreState.mediaByAssignment = {
      A1: {
        pictures: {
          departure: [{ title: 'Mock', image: 'img' }],
        },
        loading: { departure: false },
        errors: {},
      },
    };

    const usePictures = createVehiclePicturesHook('departure');
    const { result } = renderHook(() => usePictures());
    expect(result.current.items).toEqual([{ title: 'Mock', image: 'img' }]);
    expect(setLoading).not.toHaveBeenCalled();
  });

  it('maps download errors to friendly messages', async () => {
    firebasestorage.downloadFile.mockRejectedValueOnce(new Error('fail'));
    const items = await fetchVehiclePictures(firebasestorage, 'A1', 'departure');
    expect(items).toHaveLength(PicturesModel.length);
    expect(items.every((item) => 'image' in item)).toBe(true);
  });
});
