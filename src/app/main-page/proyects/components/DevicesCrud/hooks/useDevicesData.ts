'use client';

import { useEffect, useMemo } from 'react';
import { shallow } from 'zustand/shallow';

import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';
import useQuery from '@/app/hooks/useQuery/useQuery';
import type { DeviceExternalView } from '@/app/mappings/devices/devices.types';
import type { GenericEquipment } from '@/app/mappings/inventory/inventory.types';
import type { ReportDeviceView } from '@/app/mappings/reports/reports.types';
import { useProyectInventoryStore } from '@/app/stores/useProyectInventoryStore/useProyectInventoryStore';
import useProyectLocationStore from '@/app/stores/useProyectLocationStore/useProyectLocationStore';
import useReportDevicesStore from '@/app/stores/useReportDevicesStore/useReportDevicesStore';
import type { CrudRecord, CrudScope } from '../../types';

export type DeviceListType = 'complete' | 'generic';

const DEFAULT_DEVICE_LIST_TYPE: DeviceListType = 'complete';

const getSingleValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const normalizeDeviceListType = (value?: string): DeviceListType =>
  value === 'generic' ? 'generic' : DEFAULT_DEVICE_LIST_TYPE;

const resolveStatus = (isActive?: boolean) => (isActive === false ? 'Inactivo' : 'Activo');

export const buildCompleteDeviceRow = (record: ReportDeviceView): CrudRecord => {
  const device: DeviceExternalView = record.device_external_view;
  const title = [device?.brand, device?.model].filter(Boolean).join(' ').trim();
  const serial = String(device?.serialnumber ?? '').trim();
  const location = String(device?.locationname ?? '').trim();

  return {
    id: String(record?.id ?? device?.id ?? ''),
    idGenericEquipment: String(device?.idGenericEquipment ?? '').trim() || undefined,
    idLocation: String(device?.idlocation ?? '').trim() || undefined,
    primary: title || serial || 'Sin informacion',
    secondary: String(device?.brand ?? '').trim() || 'Sin informacion',
    tertiary: location || 'Sin informacion',
    status: resolveStatus(device?.is_active),
    description: serial ? `Serie: ${serial}` : 'Sin numero de serie',
    projectCode: String(device?.keyproyect ?? '').trim(),
    model: String(device?.model ?? '').trim(),
    serialOrPart: serial,
  };
};

export const buildGenericDeviceRow = (equipment: GenericEquipment): CrudRecord => ({
  id: String(equipment?.id ?? ''),
  primary: String(equipment?.typeOfEquipment ?? '').trim() || 'Sin informacion',
  secondary: String(equipment?.brand ?? '').trim() || 'Sin informacion',
  tertiary: 'Inventario general',
  status: resolveStatus(equipment?.isActive),
  description: String(equipment?.model ?? '').trim() || 'Sin informacion',
  model: String(equipment?.model ?? '').trim(),
});

export const useDevicesData = (scope: CrudScope) => {
  const { all } = useQuery();
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert, hideAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;

  const rawType = getSingleValue(all.type);
  const projectId = getSingleValue(all.id);
  const effectiveType: DeviceListType =
    scope === 'project' ? 'complete' : normalizeDeviceListType(rawType);

  const {
    allDevices,
    devicesByProyect,
    loadingAllDevices,
    loadingDevicesByProyect,
    locationError,
    fetchAllDevices,
    fetchDevicesByProyectId,
    resetLocationFlags,
  } = useProyectLocationStore(
    (state) => ({
      allDevices: state.allDevices,
      devicesByProyect: state.devicesByProyect,
      loadingAllDevices: state.loadingAllDevices,
      loadingDevicesByProyect: state.loadingDevicesByProyect,
      locationError: state.error,
      fetchAllDevices: state.fetchAllDevices,
      fetchDevicesByProyectId: state.fetchDevicesByProyectId,
      resetLocationFlags: state.resetFlags,
    }),
    shallow,
  );

  const {
    genericEquipments,
    inventoryLoading,
    inventoryError,
    fetchGenericEquipments,
    deleteGenericEquipment,
    resetInventoryFlags,
  } = useProyectInventoryStore(
    (state) => ({
      genericEquipments: state.genericEquipments,
      inventoryLoading: state.loading,
      inventoryError: state.error,
      fetchGenericEquipments: state.fetchGenericEquipments,
      deleteGenericEquipment: state.deleteGenericEquipment,
      resetInventoryFlags: state.resetFlags,
    }),
    shallow,
  );

  const { deleteDevice: deleteCompleteDevice, resetFlags: resetReportDevicesFlags } =
    useReportDevicesStore(
      (state) => ({
        deleteDevice: state.deleteDevice,
        resetFlags: state.resetFlags,
      }),
      shallow,
    );

  useEffect(() => {
    if (scope === 'project') {
      if (!projectId?.trim()) return;
      void fetchDevicesByProyectId(projectId);
      return;
    }

    if (effectiveType === 'generic') {
      void fetchGenericEquipments();
      return;
    }

    void fetchAllDevices();
  }, [
    effectiveType,
    fetchAllDevices,
    fetchDevicesByProyectId,
    fetchGenericEquipments,
    projectId,
    scope,
  ]);

  const loadingMessage = useMemo(() => {
    if (scope === 'project') return 'Cargando dispositivos del proyecto...';
    return effectiveType === 'generic'
      ? 'Cargando equipo generico...'
      : 'Cargando dispositivos...';
  }, [effectiveType, scope]);

  const isLoading =
    scope === 'project'
      ? loadingDevicesByProyect
      : effectiveType === 'generic'
        ? inventoryLoading
        : loadingAllDevices;

  useEffect(() => {
    if (isLoading) {
      showSpinner({ message: loadingMessage });
      return;
    }

    hideSpinner();
  }, [hideSpinner, isLoading, loadingMessage, showSpinner]);

  useEffect(() => {
    return () => {
      hideSpinner();
    };
  }, [hideSpinner]);

  useEffect(() => {
    const error = effectiveType === 'generic' ? inventoryError : locationError;
    if (!error) return;

    hideAlert();
    showAlert({
      type: 'error',
      variant: 'subtle',
      title: 'No fue posible cargar los dispositivos',
      description: error,
      showPrimaryButton: false,
      showSecondaryButton: false,
    });

    if (effectiveType === 'generic') {
      resetInventoryFlags();
      return;
    }

    resetLocationFlags();
  }, [
    effectiveType,
    hideAlert,
    inventoryError,
    locationError,
    resetInventoryFlags,
    resetLocationFlags,
    showAlert,
  ]);

  const sourceRows = useMemo(() => {
    if (scope === 'project') return devicesByProyect.map(buildCompleteDeviceRow);
    if (effectiveType === 'generic') return genericEquipments.map(buildGenericDeviceRow);
    return allDevices.map(buildCompleteDeviceRow);
  }, [allDevices, devicesByProyect, effectiveType, genericEquipments, scope]);

  const refreshRows = async () => {
    if (scope === 'project') {
      if (!projectId?.trim()) return;
      await fetchDevicesByProyectId(projectId, true);
      return;
    }

    if (effectiveType === 'generic') {
      await fetchGenericEquipments(true);
      return;
    }

    await fetchAllDevices(true);
  };

  return {
    rawType,
    effectiveType,
    showTypeFilter: scope === 'inventory',
    rows: sourceRows,
    projectId,
    isLoading,
    deleteGenericEquipment,
    deleteCompleteDevice,
    resetInventoryFlags,
    resetReportDevicesFlags,
    refreshRows,
  };
};
