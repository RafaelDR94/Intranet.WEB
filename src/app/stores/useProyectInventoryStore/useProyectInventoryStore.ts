'use client';

import { devtools } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';

import type { ProyectInventoryState } from './types';
import {
  createGenericEquipment as createGenericEquipmentRequest,
  createSupplier as createSupplierRequest,
  createGenericEquipmentSparePart as createGenericEquipmentSparePartRequest,
  createSparePart as createSparePartRequest,
  deleteGenericEquipment as deleteGenericEquipmentRequest,
  deleteSupplier as deleteSupplierRequest,
  deleteGenericEquipmentSparePart as deleteGenericEquipmentSparePartRequest,
  deleteSparePart as deleteSparePartRequest,
  fetchGenericEquipmentById as fetchGenericEquipmentByIdRequest,
  fetchSupplierById as fetchSupplierByIdRequest,
  fetchGenericEquipmentSpareParts as fetchGenericEquipmentSparePartsRequest,
  fetchGenericEquipments as fetchGenericEquipmentsRequest,
  fetchSuppliers as fetchSuppliersRequest,
  fetchSpareParts as fetchSparePartsRequest,
  fetchSparePartsByDeviceId as fetchSparePartsByDeviceIdRequest,
  fetchSparePartsByGenericEquipmentId as fetchSparePartsByGenericEquipmentIdRequest,
  fetchSparePartsByProyectId as fetchSparePartsByProyectIdRequest,
  updateGenericEquipment as updateGenericEquipmentRequest,
  updateSupplier as updateSupplierRequest,
  updateGenericEquipmentSparePart as updateGenericEquipmentSparePartRequest,
  updateSparePart as updateSparePartRequest,
} from './utilities';

export const useProyectInventoryStore =
  createWithEqualityFn<ProyectInventoryState>()(
    devtools((set, get) => ({
      genericEquipments: [],
      spareParts: [],
      sparePartsByProyect: [],
      sparePartsByDevice: [],
      sparePartsByGenericEquipment: [],
      genericEquipmentSpareParts: [],
      suppliers: [],
      currentSupplier: null,
      currentGenericEquipment: null,
      lastSparePartsIsActive: null,
      lastSparePartsByProyectId: null,
      lastSparePartsByDeviceId: null,
      lastSparePartsByGenericEquipmentId: null,
      lastGenericEquipmentSparePartsIsActive: null,
      lastGenericEquipmentId: null,
      lastSupplierId: null,

      loading: false,
      loadingCurrent: false,
      loadingSpareParts: false,
      loadingSparePartsByProyect: false,
      loadingSparePartsByDevice: false,
      loadingSparePartsByGenericEquipment: false,
      loadingGenericEquipmentSpareParts: false,
      loadingSuppliers: false,
      loadingCurrentSupplier: false,
      creating: false,
      updating: false,
      removing: false,

      successGet: false,
      successGetCurrent: false,
      successGetSpareParts: false,
      successGetSparePartsByProyect: false,
      successGetSparePartsByDevice: false,
      successGetSparePartsByGenericEquipment: false,
      successGetGenericEquipmentSpareParts: false,
      successGetSuppliers: false,
      successGetCurrentSupplier: false,
      successPost: false,
      successPut: false,
      successDelete: false,

      error: undefined,

      fetchGenericEquipments: (force = false) =>
        fetchGenericEquipmentsRequest(set, get, force),
      fetchGenericEquipmentById: (id, force = false) =>
        fetchGenericEquipmentByIdRequest(id, set, get, force),
      fetchSpareParts: (isActive = true, force = false) =>
        fetchSparePartsRequest(isActive, set, get, force),
      fetchSparePartsByProyectId: (idProyect, force = false) =>
        fetchSparePartsByProyectIdRequest(idProyect, set, get, force),
      fetchSparePartsByDeviceId: (idDevice, force = false) =>
        fetchSparePartsByDeviceIdRequest(idDevice, set, get, force),
      fetchSparePartsByGenericEquipmentId: (
        idGenericEquipment,
        force = false
      ) =>
        fetchSparePartsByGenericEquipmentIdRequest(
          idGenericEquipment,
          set,
          get,
          force
        ),
      fetchGenericEquipmentSpareParts: (isActive = true, force = false) =>
        fetchGenericEquipmentSparePartsRequest(isActive, set, get, force),
      fetchSuppliers: (force = false) => fetchSuppliersRequest(set, get, force),
      fetchSupplierById: (id, force = false) =>
        fetchSupplierByIdRequest(id, set, get, force),

      createGenericEquipment: (payload) =>
        createGenericEquipmentRequest(set, get, payload),
      updateGenericEquipment: (payload) =>
        updateGenericEquipmentRequest(set, get, payload),
      deleteGenericEquipment: (id) =>
        deleteGenericEquipmentRequest(set, get, id),

      createSparePart: (payload) => createSparePartRequest(set, get, payload),
      updateSparePart: (payload) => updateSparePartRequest(set, get, payload),
      deleteSparePart: (id) => deleteSparePartRequest(set, get, id),

      createGenericEquipmentSparePart: (payload) =>
        createGenericEquipmentSparePartRequest(set, get, payload),
      updateGenericEquipmentSparePart: (payload) =>
        updateGenericEquipmentSparePartRequest(set, get, payload),
      deleteGenericEquipmentSparePart: (id) =>
        deleteGenericEquipmentSparePartRequest(set, get, id),
      createSupplier: (payload) => createSupplierRequest(set, get, payload),
      updateSupplier: (payload) => updateSupplierRequest(set, get, payload),
      deleteSupplier: (id) => deleteSupplierRequest(set, get, id),

      setCurrentGenericEquipment: (equipment) =>
        set({ currentGenericEquipment: equipment ?? null }),
      clearCurrentGenericEquipment: () =>
        set({ currentGenericEquipment: null, lastGenericEquipmentId: null }),

      reset: () =>
        set({
          genericEquipments: [],
          spareParts: [],
          sparePartsByProyect: [],
          sparePartsByDevice: [],
          sparePartsByGenericEquipment: [],
          genericEquipmentSpareParts: [],
          suppliers: [],
          currentSupplier: null,
          currentGenericEquipment: null,
          lastSparePartsIsActive: null,
          lastSparePartsByProyectId: null,
          lastSparePartsByDeviceId: null,
          lastSparePartsByGenericEquipmentId: null,
          lastGenericEquipmentSparePartsIsActive: null,
          lastGenericEquipmentId: null,
          lastSupplierId: null,
          loading: false,
          loadingCurrent: false,
          loadingSpareParts: false,
          loadingSparePartsByProyect: false,
          loadingSparePartsByDevice: false,
          loadingSparePartsByGenericEquipment: false,
          loadingGenericEquipmentSpareParts: false,
          loadingSuppliers: false,
          loadingCurrentSupplier: false,
          creating: false,
          updating: false,
          removing: false,
          successGet: false,
          successGetCurrent: false,
          successGetSpareParts: false,
          successGetSparePartsByProyect: false,
          successGetSparePartsByDevice: false,
          successGetSparePartsByGenericEquipment: false,
          successGetGenericEquipmentSpareParts: false,
          successGetSuppliers: false,
          successGetCurrentSupplier: false,
          successPost: false,
          successPut: false,
          successDelete: false,
          error: undefined,
        }),

      resetFlags: () =>
        set({
          loading: false,
          loadingCurrent: false,
          loadingSpareParts: false,
          loadingSparePartsByProyect: false,
          loadingSparePartsByDevice: false,
          loadingSparePartsByGenericEquipment: false,
          loadingGenericEquipmentSpareParts: false,
          loadingSuppliers: false,
          loadingCurrentSupplier: false,
          creating: false,
          updating: false,
          removing: false,
          successGet: false,
          successGetCurrent: false,
          successGetSpareParts: false,
          successGetSparePartsByProyect: false,
          successGetSparePartsByDevice: false,
          successGetSparePartsByGenericEquipment: false,
          successGetGenericEquipmentSpareParts: false,
          successGetSuppliers: false,
          successGetCurrentSupplier: false,
          successPost: false,
          successPut: false,
          successDelete: false,
          error: undefined,
        }),
    }))
  );

export default useProyectInventoryStore;
