"use client";

import { devtools } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

import type { InternalDevicesState } from "./types";
import {
  activateDeviceBrand,
  activateDeviceStatus,
  activateDeviceType,
  activateInternalDevice,
  createDeviceAssignment,
  createDeviceBrand,
  createDeviceReview,
  createDeviceStatus,
  createDeviceType,
  createInternalDevice,
  deleteDeviceAssignment,
  deleteDeviceBrand,
  deleteDeviceReview,
  deleteDeviceStatus,
  deleteDeviceType,
  deleteInternalDevice,
  fetchDeviceAssignmentById,
  fetchDeviceAssignments,
  fetchDeviceAssignmentHistoryByDeviceId,
  fetchDeviceBrandById,
  fetchDeviceBrands,
  fetchDeviceReviews,
  fetchDeviceReviewsByDeviceId,
  fetchDeviceStatusById,
  fetchDeviceStatuses,
  fetchDeviceTypeById,
  fetchDeviceTypes,
  fetchDeactivatedDevices,
  fetchDevicesAssigned,
  fetchDevicesByProyect,
  fetchInternalDeviceById,
  fetchInternalDevices,
  fetchUnassignedDevices,
  reviewInternalDevice,
  updateDeviceAssignment,
  updateDeviceBrand,
  updateDeviceReview,
  updateDeviceStatus,
  updateDeviceType,
  updateInternalDevice,
} from "./utilities";

const initialCollections: Pick<
  InternalDevicesState,
  | "devices"
  | "device"
  | "unassignedDevices"
  | "deactivatedDevices"
  | "devicesAssigned"
  | "devicesByProyect"
  | "assignedFilters"
  | "lastProyectId"
  | "deviceTypes"
  | "deviceType"
  | "deviceBrands"
  | "deviceBrand"
  | "deviceStatuses"
  | "deviceStatus"
  | "deviceReviews"
  | "deviceReviewsByDevice"
  | "lastReviewDeviceId"
  | "deviceAssignments"
  | "deviceAssignment"
  | "deviceAssignmentHistory"
  | "lastAssignmentHistoryDeviceId"
> = {
  devices: [],
  device: undefined,
  unassignedDevices: [],
  deactivatedDevices: [],
  devicesAssigned: [],
  devicesByProyect: [],
  assignedFilters: null,
  lastProyectId: null,
  deviceTypes: [],
  deviceType: undefined,
  deviceBrands: [],
  deviceBrand: undefined,
  deviceStatuses: [],
  deviceStatus: undefined,
  deviceReviews: [],
  deviceReviewsByDevice: [],
  lastReviewDeviceId: null,
  deviceAssignments: [],
  deviceAssignment: undefined,
  deviceAssignmentHistory: [],
  lastAssignmentHistoryDeviceId: null,
};

const initialFlags: Pick<
  InternalDevicesState,
  | "loadingDevices"
  | "loadingDevice"
  | "loadingUnassignedDevices"
  | "loadingDeactivatedDevices"
  | "loadingAssignedDevices"
  | "loadingDevicesByProyect"
  | "creatingDevice"
  | "updatingDevice"
  | "deletingDevice"
  | "activatingDevice"
  | "reviewingDevice"
  | "successGetDevices"
  | "successGetDevice"
  | "successGetUnassignedDevices"
  | "successGetDeactivatedDevices"
  | "successGetAssignedDevices"
  | "successGetDevicesByProyect"
  | "successCreateDevice"
  | "successUpdateDevice"
  | "successDeleteDevice"
  | "successActivateDevice"
  | "successReviewDevice"
  | "loadingDeviceTypes"
  | "loadingDeviceType"
  | "creatingDeviceType"
  | "updatingDeviceType"
  | "deletingDeviceType"
  | "activatingDeviceType"
  | "successGetDeviceTypes"
  | "successGetDeviceType"
  | "successCreateDeviceType"
  | "successUpdateDeviceType"
  | "successDeleteDeviceType"
  | "successActivateDeviceType"
  | "loadingDeviceBrands"
  | "loadingDeviceBrand"
  | "creatingDeviceBrand"
  | "updatingDeviceBrand"
  | "deletingDeviceBrand"
  | "activatingDeviceBrand"
  | "successGetDeviceBrands"
  | "successGetDeviceBrand"
  | "successCreateDeviceBrand"
  | "successUpdateDeviceBrand"
  | "successDeleteDeviceBrand"
  | "successActivateDeviceBrand"
  | "loadingDeviceStatuses"
  | "loadingDeviceStatus"
  | "creatingDeviceStatus"
  | "updatingDeviceStatus"
  | "deletingDeviceStatus"
  | "activatingDeviceStatus"
  | "successGetDeviceStatuses"
  | "successGetDeviceStatus"
  | "successCreateDeviceStatus"
  | "successUpdateDeviceStatus"
  | "successDeleteDeviceStatus"
  | "successActivateDeviceStatus"
  | "loadingDeviceReviews"
  | "loadingDeviceReviewsByDevice"
  | "creatingDeviceReview"
  | "updatingDeviceReview"
  | "deletingDeviceReview"
  | "successGetDeviceReviews"
  | "successGetDeviceReviewsByDevice"
  | "successCreateDeviceReview"
  | "successUpdateDeviceReview"
  | "successDeleteDeviceReview"
  | "loadingDeviceAssignments"
  | "loadingDeviceAssignment"
  | "loadingDeviceAssignmentHistory"
  | "creatingDeviceAssignment"
  | "updatingDeviceAssignment"
  | "deletingDeviceAssignment"
  | "successGetDeviceAssignments"
  | "successGetDeviceAssignment"
  | "successGetDeviceAssignmentHistory"
  | "successCreateDeviceAssignment"
  | "successUpdateDeviceAssignment"
  | "successDeleteDeviceAssignment"
  | "error"
  | "warning"
> = {
  loadingDevices: false,
  loadingDevice: false,
  loadingUnassignedDevices: false,
  loadingDeactivatedDevices: false,
  loadingAssignedDevices: false,
  loadingDevicesByProyect: false,
  creatingDevice: false,
  updatingDevice: false,
  deletingDevice: false,
  activatingDevice: false,
  reviewingDevice: false,
  successGetDevices: false,
  successGetDevice: false,
  successGetUnassignedDevices: false,
  successGetDeactivatedDevices: false,
  successGetAssignedDevices: false,
  successGetDevicesByProyect: false,
  successCreateDevice: false,
  successUpdateDevice: false,
  successDeleteDevice: false,
  successActivateDevice: false,
  successReviewDevice: false,
  loadingDeviceTypes: false,
  loadingDeviceType: false,
  creatingDeviceType: false,
  updatingDeviceType: false,
  deletingDeviceType: false,
  activatingDeviceType: false,
  successGetDeviceTypes: false,
  successGetDeviceType: false,
  successCreateDeviceType: false,
  successUpdateDeviceType: false,
  successDeleteDeviceType: false,
  successActivateDeviceType: false,
  loadingDeviceBrands: false,
  loadingDeviceBrand: false,
  creatingDeviceBrand: false,
  updatingDeviceBrand: false,
  deletingDeviceBrand: false,
  activatingDeviceBrand: false,
  successGetDeviceBrands: false,
  successGetDeviceBrand: false,
  successCreateDeviceBrand: false,
  successUpdateDeviceBrand: false,
  successDeleteDeviceBrand: false,
  successActivateDeviceBrand: false,
  loadingDeviceStatuses: false,
  loadingDeviceStatus: false,
  creatingDeviceStatus: false,
  updatingDeviceStatus: false,
  deletingDeviceStatus: false,
  activatingDeviceStatus: false,
  successGetDeviceStatuses: false,
  successGetDeviceStatus: false,
  successCreateDeviceStatus: false,
  successUpdateDeviceStatus: false,
  successDeleteDeviceStatus: false,
  successActivateDeviceStatus: false,
  loadingDeviceReviews: false,
  loadingDeviceReviewsByDevice: false,
  creatingDeviceReview: false,
  updatingDeviceReview: false,
  deletingDeviceReview: false,
  successGetDeviceReviews: false,
  successGetDeviceReviewsByDevice: false,
  successCreateDeviceReview: false,
  successUpdateDeviceReview: false,
  successDeleteDeviceReview: false,
  loadingDeviceAssignments: false,
  loadingDeviceAssignment: false,
  loadingDeviceAssignmentHistory: false,
  creatingDeviceAssignment: false,
  updatingDeviceAssignment: false,
  deletingDeviceAssignment: false,
  successGetDeviceAssignments: false,
  successGetDeviceAssignment: false,
  successGetDeviceAssignmentHistory: false,
  successCreateDeviceAssignment: false,
  successUpdateDeviceAssignment: false,
  successDeleteDeviceAssignment: false,
  error: undefined,
  warning: undefined,
};

export const useInternalDevicesStore =
  createWithEqualityFn<InternalDevicesState>()(
    devtools((set, get) => ({
      ...initialCollections,
      ...initialFlags,

      fetchDevices: (force = false) => fetchInternalDevices(set, get, force),
      fetchDeviceById: (id, force = false) =>
        fetchInternalDeviceById(id, set, get, force),
      fetchUnassignedDevices: (force = false) =>
        fetchUnassignedDevices(set, get, force),
      fetchDeactivatedDevices: (force = false) =>
        fetchDeactivatedDevices(set, get, force),
      fetchDevicesAssigned: (filters, force = false) =>
        fetchDevicesAssigned(filters, set, get, force),
      fetchDevicesByProyect: (proyectId, force = false) =>
        fetchDevicesByProyect(proyectId, set, get, force),
      createDevice: (payload) => createInternalDevice(set, get, payload),
      updateDevice: (payload) => updateInternalDevice(set, get, payload),
      deleteDevice: (id, lowMotive, idEmployee) =>
        deleteInternalDevice(set, get, id, lowMotive, idEmployee),
      activateDevice: (id) => activateInternalDevice(set, get, id),
      reviewDevice: (idDevice, reviewed) =>
        reviewInternalDevice(set, get, idDevice, reviewed),

      fetchDeviceTypes: (isActive, force = false) =>
        fetchDeviceTypes(isActive, set, get, force),
      fetchDeviceTypeById: (id, force = false) =>
        fetchDeviceTypeById(id, set, get, force),
      createDeviceType: (payload) => createDeviceType(set, get, payload),
      updateDeviceType: (payload) => updateDeviceType(set, get, payload),
      deleteDeviceType: (id) => deleteDeviceType(set, get, id),
      activateDeviceType: (id) => activateDeviceType(set, get, id),

      fetchDeviceBrands: (isActive, force = false) =>
        fetchDeviceBrands(isActive, set, get, force),
      fetchDeviceBrandById: (id, force = false) =>
        fetchDeviceBrandById(id, set, get, force),
      createDeviceBrand: (payload) => createDeviceBrand(set, get, payload),
      updateDeviceBrand: (payload) => updateDeviceBrand(set, get, payload),
      deleteDeviceBrand: (id) => deleteDeviceBrand(set, get, id),
      activateDeviceBrand: (id) => activateDeviceBrand(set, get, id),

      fetchDeviceStatuses: (isActive, force = false) =>
        fetchDeviceStatuses(isActive, set, get, force),
      fetchDeviceStatusById: (id, force = false) =>
        fetchDeviceStatusById(id, set, get, force),
      createDeviceStatus: (payload) => createDeviceStatus(set, get, payload),
      updateDeviceStatus: (payload) => updateDeviceStatus(set, get, payload),
      deleteDeviceStatus: (id) => deleteDeviceStatus(set, get, id),
      activateDeviceStatus: (id) => activateDeviceStatus(set, get, id),

      fetchDeviceReviews: (force = false) =>
        fetchDeviceReviews(set, get, force),
      fetchDeviceReviewsByDeviceId: (deviceId, force = false) =>
        fetchDeviceReviewsByDeviceId(deviceId, set, get, force),
      createDeviceReview: (payload) => createDeviceReview(set, get, payload),
      updateDeviceReview: (payload) => updateDeviceReview(set, get, payload),
      deleteDeviceReview: (id) => deleteDeviceReview(set, get, id),

      fetchDeviceAssignments: (force = false) =>
        fetchDeviceAssignments(set, get, force),
      fetchDeviceAssignmentById: (id, force = false) =>
        fetchDeviceAssignmentById(id, set, get, force),
      fetchDeviceAssignmentHistoryByDeviceId: (deviceId, force = false) =>
        fetchDeviceAssignmentHistoryByDeviceId(deviceId, set, get, force),
      createDeviceAssignment: (payload) =>
        createDeviceAssignment(set, get, payload),
      updateDeviceAssignment: (payload) =>
        updateDeviceAssignment(set, get, payload),
      deleteDeviceAssignment: (payload) =>
        deleteDeviceAssignment(set, get, payload),

      reset: () =>
        set({
          ...initialCollections,
          ...initialFlags,
        }),
      resetFlags: () =>
        set({
          ...initialFlags,
        }),
    })),
  );

export default useInternalDevicesStore;
