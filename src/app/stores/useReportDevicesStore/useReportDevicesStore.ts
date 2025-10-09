'use client';

import { devtools } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';

import type { ReportDevicesState } from './types';
import {
  fetchDevices as fetchDevicesRequest,
  fetchDevicesByLocation as fetchDevicesByLocationRequest,
  createDevice as createDeviceRequest,
  updateDevice as updateDeviceRequest,
  deleteDevice as deleteDeviceRequest,
} from './utilities';

export const useReportDevicesStore = createWithEqualityFn<ReportDevicesState>()(
  devtools((set, get) => ({
    devices: [],
    locationDevices: [],
    lastLocationId: null,
    currentDevice: null,

    loading: false,
    loadingByLocation: false,
    creating: false,
    updating: false,
    removing: false,

    successGet: false,
    successGetByLocation: false,
    successPost: false,
    successPut: false,
    successDelete: false,

    error: undefined,

    fetchDevices: async (force = false) => fetchDevicesRequest(set, get, force),
    fetchDevicesByLocation: async (locationId, force = false) =>
      fetchDevicesByLocationRequest(locationId, set, get, force),
    createDevice: (payload) => createDeviceRequest(set, get, payload),
    updateDevice: (payload) => updateDeviceRequest(set, get, payload),
    deleteDevice: (id) => deleteDeviceRequest(set, get, id),

    setCurrentDevice: (device) => set({ currentDevice: device ?? null }),
    clearCurrentDevice: () => set({ currentDevice: null }),

    reset: () =>
      set({
        devices: [],
        locationDevices: [],
        lastLocationId: null,
        currentDevice: null,
        loading: false,
        loadingByLocation: false,
        creating: false,
        updating: false,
        removing: false,
        successGet: false,
        successGetByLocation: false,
        successPost: false,
        successPut: false,
        successDelete: false,
        error: undefined,
      }),

    resetFlags: () =>
      set({
        loading: false,
        loadingByLocation: false,
        creating: false,
        updating: false,
        removing: false,
        successGet: false,
        successGetByLocation: false,
        successPost: false,
        successPut: false,
        successDelete: false,
        error: undefined,
      }),
  })),
);

export default useReportDevicesStore;
