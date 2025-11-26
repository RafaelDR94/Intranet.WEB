'use client';

import { devtools } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';

import type { TransportStoreState } from './types';
import {
  createAssignment as createAssignmentRequest,
  createTransport as createTransportRequest,
  createExternalTransport as createExternalTransportRequest,
  createVehicleTracking as createVehicleTrackingRequest,
  deleteAssignment as deleteAssignmentRequest,
  deleteTransport as deleteTransportRequest,
  deleteVehicleTracking as deleteVehicleTrackingRequest,
  fetchAssignmentById as fetchAssignmentByIdRequest,
  fetchAssignments as fetchAssignmentsRequest,
  fetchTransportById as fetchTransportByIdRequest,
  fetchTransports as fetchTransportsRequest,
  fetchTransportsByEnterprise as fetchTransportsByEnterpriseRequest,
  fetchVehicleTrackingById as fetchVehicleTrackingByIdRequest,
  fetchVehicleTrackings as fetchVehicleTrackingsRequest,
  updateAssignment as updateAssignmentRequest,
  updateTransport as updateTransportRequest,
  updateVehicleTracking as updateVehicleTrackingRequest,
} from './utilities';

export const useTransportStore = createWithEqualityFn<TransportStoreState>()(
  devtools((set, get) => ({
    transports: [],
    transport: undefined,

    assignments: [],
    currentAssignment: undefined,

    vehicleTrackings: [],
    vehicleTracking: undefined,

    loadingTransports: false,
    loadingAssignments: false,
    loadingVehicleTracking: false,
    creatingTransport: false,
    updatingTransport: false,
    deletingTransport: false,
    creatingAssignment: false,
    updatingAssignment: false,
    deletingAssignment: false,
    creatingVehicleTracking: false,
    updatingVehicleTracking: false,
    deletingVehicleTracking: false,

    successGetTransports: false,
    successGetTransport: false,
    successCreateTransport: false,
    successUpdateTransport: false,
    successDeleteTransport: false,

    successGetAssignments: false,
    successGetAssignment: false,
    successCreateAssignment: false,
    successUpdateAssignment: false,
    successDeleteAssignment: false,

    successGetVehicleTrackings: false,
    successGetVehicleTracking: false,
    successCreateVehicleTracking: false,
    successUpdateVehicleTracking: false,
    successDeleteVehicleTracking: false,

    error: undefined,
    warning: undefined,

    fetchTransports: (force = false) => fetchTransportsRequest(set, get, force),
    fetchTransportById: (id, force = false) => fetchTransportByIdRequest(id, set, get, force),
    fetchTransportsByEnterprise: (enterpriseId, force = false) =>
      fetchTransportsByEnterpriseRequest(enterpriseId, set, get, force),
    createTransport: (payload) => createTransportRequest(set, get, payload),
    createExternalTransport: (payload) =>
      createExternalTransportRequest(set, get, payload),
    updateTransport: (payload) => updateTransportRequest(set, get, payload),
    deleteTransport: (id) => deleteTransportRequest(set, get, id),

    fetchAssignments: (force = false) => fetchAssignmentsRequest(set, get, force),
    fetchAssignmentById: (id, force = false) => fetchAssignmentByIdRequest(id, set, get, force),
    createAssignment: (payload) => createAssignmentRequest(set, get, payload),
    updateAssignment: (payload) => updateAssignmentRequest(set, get, payload),
    deleteAssignment: (id) => deleteAssignmentRequest(set, get, id),

    fetchVehicleTrackings: (force = false) => fetchVehicleTrackingsRequest(set, get, force),
    fetchVehicleTrackingById: (id, force = false) => fetchVehicleTrackingByIdRequest(id, set, get, force),
    createVehicleTracking: (payload) => createVehicleTrackingRequest(set, get, payload),
    updateVehicleTracking: (payload) => updateVehicleTrackingRequest(set, get, payload),
    deleteVehicleTracking: (id) => deleteVehicleTrackingRequest(set, get, id),

    setCurrentAssignment: (assignment) => set({ currentAssignment: assignment }),

    reset: () =>
      set({
        transports: [],
        transport: undefined,
        assignments: [],
        currentAssignment: undefined,
        vehicleTrackings: [],
        vehicleTracking: undefined,
        loadingTransports: false,
        loadingAssignments: false,
        loadingVehicleTracking: false,
        creatingTransport: false,
        updatingTransport: false,
        deletingTransport: false,
        creatingAssignment: false,
        updatingAssignment: false,
        deletingAssignment: false,
        creatingVehicleTracking: false,
        updatingVehicleTracking: false,
        deletingVehicleTracking: false,
        successGetTransports: false,
        successGetTransport: false,
        successCreateTransport: false,
        successUpdateTransport: false,
        successDeleteTransport: false,
        successGetAssignments: false,
        successGetAssignment: false,
        successCreateAssignment: false,
        successUpdateAssignment: false,
        successDeleteAssignment: false,
        successGetVehicleTrackings: false,
        successGetVehicleTracking: false,
        successCreateVehicleTracking: false,
        successUpdateVehicleTracking: false,
        successDeleteVehicleTracking: false,
        error: undefined,
        warning: undefined,
      }),
    resetCurrentAssignment: () =>
      set({
        currentAssignment: undefined,
      }),

    resetFlags: () =>
      set({
        loadingTransports: false,
        loadingAssignments: false,
        loadingVehicleTracking: false,
        creatingTransport: false,
        updatingTransport: false,
        deletingTransport: false,
        creatingAssignment: false,
        updatingAssignment: false,
        deletingAssignment: false,
        creatingVehicleTracking: false,
        updatingVehicleTracking: false,
        deletingVehicleTracking: false,
        successGetTransports: false,
        successGetTransport: false,
        successCreateTransport: false,
        successUpdateTransport: false,
        successDeleteTransport: false,
        successGetAssignments: false,
        successGetAssignment: false,
        successCreateAssignment: false,
        successUpdateAssignment: false,
        successDeleteAssignment: false,
        successGetVehicleTrackings: false,
        successGetVehicleTracking: false,
        successCreateVehicleTracking: false,
        successUpdateVehicleTracking: false,
        successDeleteVehicleTracking: false,
        error: undefined,
        warning: undefined,
      }),
  }))
);
