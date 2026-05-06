'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { shallow } from 'zustand/shallow';

import type { LabelType } from '@/app/components/Label/types';
import type { GenericEquipment, SparePart } from '@/app/mappings/inventory/inventory.types';
import { useProyectInventoryStore } from '@/app/stores/useProyectInventoryStore/useProyectInventoryStore';
import useProyectLocationStore from '@/app/stores/useProyectLocationStore/useProyectLocationStore';

import { devicesDefinition } from '../../crudDefinitions';
import { useCrudModule } from '../../crudShared';
import type { CrudScope } from '../../types';
import {
  buildCompleteDeviceRow,
  buildGenericDeviceRow,
  useDevicesData,
} from './useDevicesData';

const statusToLabelType = (status?: string): LabelType => {
  const normalized = (status ?? '').trim().toLowerCase();

  if (normalized === 'operativo' || normalized === 'disponible') return 'valido';
  if (normalized === 'mantenimiento') return 'pendiente';
  return 'actualizado';
};

export const useDevicesDetail = (scope: CrudScope) => {
  const data = useDevicesData(scope);
  const { currentDevice, loadingCurrentDevice, fetchDeviceById } = useProyectLocationStore(
    (state) => ({
      currentDevice: state.currentDevice,
      loadingCurrentDevice: state.loadingCurrentDevice,
      fetchDeviceById: state.fetchDeviceById,
    }),
    shallow,
  );
  const {
    currentGenericEquipment,
    loadingCurrent,
    sparePartsByDevice,
    sparePartsByGenericEquipment,
    loadingSparePartsByDevice,
    loadingSparePartsByGenericEquipment,
    sparePartsError,
    fetchGenericEquipmentById,
    fetchSparePartsByDeviceId,
    fetchSparePartsByGenericEquipmentId,
    resetInventoryFlags,
  } = useProyectInventoryStore(
    (state) => ({
      currentGenericEquipment: state.currentGenericEquipment,
      loadingCurrent: state.loadingCurrent,
      sparePartsByDevice: state.sparePartsByDevice,
      sparePartsByGenericEquipment: state.sparePartsByGenericEquipment,
      loadingSparePartsByDevice: state.loadingSparePartsByDevice,
      loadingSparePartsByGenericEquipment: state.loadingSparePartsByGenericEquipment,
      sparePartsError: state.error,
      fetchGenericEquipmentById: state.fetchGenericEquipmentById,
      fetchSparePartsByDeviceId: state.fetchSparePartsByDeviceId,
      fetchSparePartsByGenericEquipmentId: state.fetchSparePartsByGenericEquipmentId,
      resetInventoryFlags: state.resetFlags,
    }),
    shallow,
  );

  const crud = useCrudModule(devicesDefinition, scope, data.rows, {
    isResolvingRecord: data.isLoading || loadingCurrentDevice || loadingCurrent,
  });

  useEffect(() => {
    if (scope !== 'inventory') return;
    if (data.effectiveType !== 'complete') return;
    if (crud.crudView !== 'detail') return;
    if (!crud.crudItemId) return;
    if (crud.currentRecord) return;
    if (currentDevice?.id === crud.crudItemId) return;

    void fetchDeviceById(crud.crudItemId);
  }, [
    crud.crudItemId,
    crud.crudView,
    crud.currentRecord,
    currentDevice?.id,
    data.effectiveType,
    fetchDeviceById,
    scope,
  ]);

  useEffect(() => {
    if (scope !== 'inventory') return;
    if (data.effectiveType !== 'generic') return;
    if (crud.crudView !== 'detail') return;
    if (!crud.crudItemId) return;
    if (crud.currentRecord) return;
    if (currentGenericEquipment?.id === crud.crudItemId) return;

    void fetchGenericEquipmentById(crud.crudItemId);
  }, [
    crud.crudItemId,
    crud.crudView,
    crud.currentRecord,
    currentGenericEquipment?.id,
    data.effectiveType,
    fetchGenericEquipmentById,
    scope,
  ]);

  const resolvedDevice = useMemo(() => {
    if (crud.currentRecord) return crud.currentRecord;
    if (scope !== 'inventory') return null;
    if (!crud.crudItemId) return null;

    if (data.effectiveType === 'generic') {
      if (currentGenericEquipment?.id !== crud.crudItemId) return null;
      return buildGenericDeviceRow(currentGenericEquipment as GenericEquipment);
    }

    if (currentDevice?.id !== crud.crudItemId) return null;
    return buildCompleteDeviceRow(currentDevice);
  }, [
    crud.crudItemId,
    crud.currentRecord,
    currentDevice,
    currentGenericEquipment,
    data.effectiveType,
    scope,
  ]);

  const refactions = useMemo(
    () =>
      (
        data.effectiveType === 'generic'
          ? sparePartsByGenericEquipment
          : sparePartsByDevice
      ).map((part: SparePart) => ({
        id: part.id,
        name: part.name || 'Sin nombre',
        code: part.sku || 'Sin codigo',
        quantity: `${part.stock ?? 0} pieza${Number(part.stock ?? 0) === 1 ? '' : 's'}`,
      })),
    [data.effectiveType, sparePartsByDevice, sparePartsByGenericEquipment],
  );

  const fetchRefactions = useCallback(async () => {
    if (!resolvedDevice?.id) return;
    if (data.effectiveType === 'generic') {
      await fetchSparePartsByGenericEquipmentId(resolvedDevice.id);
      return;
    }
    await fetchSparePartsByDeviceId(resolvedDevice.id);
  }, [
    data.effectiveType,
    fetchSparePartsByDeviceId,
    fetchSparePartsByGenericEquipmentId,
    resolvedDevice?.id,
  ]);

  const onEdit = useCallback(() => {
    if (!resolvedDevice) return;
    crud.goEdit(resolvedDevice.id);
  }, [crud, resolvedDevice]);

  return {
    title: devicesDefinition.config.detailTitle,
    device: resolvedDevice,
    loading: data.isLoading || loadingCurrentDevice || loadingCurrent,
    loadingRefactions:
      data.effectiveType === 'generic'
        ? loadingSparePartsByGenericEquipment
        : loadingSparePartsByDevice,
    refactions,
    refactionsError: sparePartsError,
    fetchRefactions,
    resetRefactionsFlags: resetInventoryFlags,
    statusLabelType: statusToLabelType(resolvedDevice?.status),
    onClose: crud.goList,
    onEdit,
  };
};
