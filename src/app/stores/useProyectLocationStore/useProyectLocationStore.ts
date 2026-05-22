'use client';

import { createWithEqualityFn } from 'zustand/traditional';

import type { ProyectLocationState } from './types';
import {
  createLocation,
  deleteLocation,
  fetchAllLocations,
  fetchAllReportsDevices,
  fetchDeviceById,
  fetchDevicesByLocation,
  fetchDevicesByProyectId,
  fetchLocationsByProyect,
  updateLocation,
} from './utilities';

export const useProyectLocationStore = createWithEqualityFn<ProyectLocationState>()((set, get) => ({
  locations: [],
  devices: [],
  allDevices: [],
  devicesByProyect: [],
  currentDevice: null,
  lastProyectId: null,
  lastLocationId: null,
  lastDevicesByProyectId: null,
  lastCurrentDeviceId: null,
  loadingLocations: false,
  loadingDevices: false,
  loadingAllDevices: false,
  loadingDevicesByProyect: false,
  loadingCurrentDevice: false,
  error: undefined,

  fetchLocations: async (proyectId: string, force = false) =>
    fetchLocationsByProyect(proyectId, set, get, force),
  fetchAllLocations: async (force = false) => fetchAllLocations(set, get, force),
  createLocation: async (payload) => createLocation(set, get, payload),
  updateLocation: async (payload) => updateLocation(set, get, payload),
  deleteLocation: async (id) => deleteLocation(set, get, id),

  fetchDevicesByLocation: async (locationId: string, force = false) =>
    fetchDevicesByLocation(locationId, set, get, force),

  fetchDevicesByProyectId: async (proyectId: string, force = false) =>
    fetchDevicesByProyectId(proyectId, set, get, force),

  fetchDeviceById: async (deviceId: string, force = false) =>
    fetchDeviceById(deviceId, set, get, force),

  fetchAllDevices: async (force = false) => fetchAllReportsDevices(set, get, force),

  reset: () =>
    set({
      locations: [],
      devices: [],
      allDevices: [],
      devicesByProyect: [],
      currentDevice: null,
      lastProyectId: null,
      lastLocationId: null,
      lastDevicesByProyectId: null,
      lastCurrentDeviceId: null,
      loadingLocations: false,
      loadingDevices: false,
      loadingAllDevices: false,
      loadingDevicesByProyect: false,
      loadingCurrentDevice: false,
      error: undefined,
    }),
  resetFlags: () =>
    set({
      loadingLocations: false,
      loadingDevices: false,
      loadingAllDevices: false,
      loadingDevicesByProyect: false,
      loadingCurrentDevice: false,
      error: undefined,
    }),
}));

export default useProyectLocationStore;
