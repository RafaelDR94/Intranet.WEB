'use client';

import { createWithEqualityFn } from 'zustand/traditional';

import type { ProyectLocationState } from './types';
import {
  fetchAllReportsDevices,
  fetchDevicesByLocation,
  fetchLocationsByProyect,
} from './utilities';

export const useProyectLocationStore = createWithEqualityFn<ProyectLocationState>()((set, get) => ({
  locations: [],
  devices: [],
  allDevices: [],
  lastProyectId: null,
  lastLocationId: null,
  loadingLocations: false,
  loadingDevices: false,
  loadingAllDevices: false,
  error: undefined,

  fetchLocations: async (proyectId: string, force = false) =>
    fetchLocationsByProyect(proyectId, set, get, force),

  fetchDevicesByLocation: async (locationId: string, force = false) =>
    fetchDevicesByLocation(locationId, set, get, force),

  fetchAllDevices: async (force = false) => fetchAllReportsDevices(set, get, force),

  reset: () =>
    set({
      locations: [],
      devices: [],
      allDevices: [],
      lastProyectId: null,
      lastLocationId: null,
      loadingLocations: false,
      loadingDevices: false,
      loadingAllDevices: false,
      error: undefined,
    }),
  resetFlags: () =>
    set({
      loadingLocations: false,
      loadingDevices: false,
      loadingAllDevices: false,
      error: undefined,
    }),
}));

export default useProyectLocationStore;
