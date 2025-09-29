'use client';
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import { PopUp } from '@/app/components/PopUp/PopUp';
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';
import useReportBuilderStore from '@/app/stores/useReportBuilderStore/useReportBuilderStore';
import useReportDevicesStore from '@/app/stores/useReportDevicesStore/useReportDevicesStore';
import { DeviceExternalView } from '@/app/mappings/devices/devices.types';
import { normalizeId, buildDeviceLabel } from '../../../utilities/DevicesUtilities';
import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery';
const PAGE_SIZE = 4;


const useDevicesList = () => {
  const isMobile = useIsMobile();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState<DeviceExternalView | null>(null);

  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert, hideAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;

  const { selecteddevices, location, updateReportDevices, report } = useReportBuilderStore(
    (s) => ({ location: s.report.location, updateReportDevices: s.updateReportDevices, selecteddevices: s.report.reportDeviceView, report: s.report }),
    shallow
  );
  const locationId = location?.id ? String(location.id) : '';
  const init = useRef(false);
  const {
    devices,
    fetchDevices,
    deleteDevice,
    loadingByLocation,
    removing,
    successDelete,
    error,
    resetFlags,
  } = useReportDevicesStore(
    (s) => ({
      devices: s.devices,
      fetchDevices: s.fetchDevices,
      deleteDevice: s.deleteDevice,
      loadingByLocation: s.loading,
      removing: s.removing,
      successDelete: s.successDelete,
      error: s.error,
      resetFlags: s.resetFlags,
    }),
    shallow
  );

  // fetch
  useEffect(() => {
    // updateReportDevices([]);
    if (!locationId) return;
    void fetchDevices();
  }, [fetchDevices, locationId]);

  // map rows
  const rows: DeviceExternalView[] = useMemo(
    () =>
      devices
        .filter((d) => d?.idlocation === locationId && d?.is_active)
        .map((device, index) => ({
          ...device,
          id: normalizeId(device, index),
        })),
    [devices, locationId]
  );

  const initialSelectedIds = useMemo(() => {
    if (!Array.isArray(selecteddevices) || selecteddevices.length === 0) {
      return [] as string[];
    }

    const idMap = new Map(rows.map((row) => [String(row.id), String(row.id)]));
    const compositeMap = new Map(
      rows.map((row) => {
        const key = [row?.brand ?? '', row?.model ?? '', row?.serialnumber ?? '']
          .map((value) => String(value ?? '').trim().toLowerCase())
          .join('|');
        return [key, String(row.id)] as const;
      })
    );

    const selectedSet = new Set<string>();

    selecteddevices.forEach((entry) => {
      const device = (entry as any)?.device_external_view ?? entry;
      if (!device) return;

      const deviceLocation = device?.idlocation ?? (device as any)?.device_external_view?.idlocation;
      if (locationId && deviceLocation && String(deviceLocation) !== locationId) {
        return;
      }

      const rawId = device?.id ?? (device as any)?.device_external_view?.id;
      if (rawId != null) {
        const normalizedId = String(rawId);
        const match = idMap.get(normalizedId);
        if (match) {
          selectedSet.add(match);
          return;
        }
      }

      const fallbackKey = [device?.brand ?? '', device?.model ?? '', device?.serialnumber ?? '']
        .map((value) => String(value ?? '').trim().toLowerCase())
        .join('|');
      const fallbackId = compositeMap.get(fallbackKey);
      if (fallbackId) {
        selectedSet.add(fallbackId);
      }
    });

    return Array.from(selectedSet);
  }, [rows, selecteddevices, locationId]);

  // spinner
  useEffect(() => {
    const message = removing
      ? 'Eliminando dispositivo...'
      : loadingByLocation
        ? 'Cargando dispositivos...'
        : null;
    
    if (message) { showSpinner({ message }); return; }
    hideSpinner();
  }, [loadingByLocation, removing, showSpinner, hideSpinner]);

  useEffect(() => () => hideSpinner(), [hideSpinner]);

  // delete flows
  const askDelete = useCallback((d: DeviceExternalView) => {
    setToDelete(d);
    setConfirmDeleteOpen(true);
  }, []);
  const confirmDelete = useCallback(async () => {
    if (!toDelete?.id) return;
    await deleteDevice(String(toDelete.id));
  }, [deleteDevice, toDelete]);

  useEffect(() => {
    if (!successDelete && !error) return;
    if (successDelete) {
      showAlert({ type: 'warning', variant: 'filled', title: 'Equipo eliminado', description: `Se eliminó exitosamente el ${buildDeviceLabel(toDelete)}.`, autoCloseMs: 3000, showPrimaryButton: false, showSecondaryButton: false, onClose: hideAlert });
      setConfirmDeleteOpen(false);
      setToDelete(null);
    }
    if (error) {
      showAlert({ type: 'error', variant: 'filled', title: 'No fue posible eliminar', description: String(error), autoCloseMs: 4000, showPrimaryButton: false, showSecondaryButton: false, onClose: hideAlert });
    }
    resetFlags();
  }, [successDelete, error, toDelete, hideAlert, resetFlags, showAlert]);

  // selección
  const handleSelectedChange = useCallback((selected: DeviceExternalView[]) => {
    if (init.current) {
      const devices = selected.map((device, index) => ({
        id: normalizeId(device, index),
        device_external_view: device,
      }));
      updateReportDevices(devices);
    }
    init.current = true



  }, [updateReportDevices]);


  const confirmDeleteUI = (
    <PopUp
      open={confirmDeleteOpen}
      title="Eliminar equipo"
      content={`Esta acción confirmará la eliminación de "${buildDeviceLabel(toDelete)}".\nUna vez confirmado, no podrás revertir el cambio.`}
      onClose={() => setConfirmDeleteOpen(false)}
      onPrimaryButtonClick={confirmDelete}
      onSecondaryButtonClick={() => setConfirmDeleteOpen(false)}
      primaryButtonText={removing ? 'Eliminando...' : 'Eliminar'}
      secondaryButtonText="Cancelar"
      showPrimaryButton
      showSecondaryButton
    />
  );

  return {
    rows,
    onSelectedChange: handleSelectedChange,
    deleteRow: askDelete,
    confirmDeleteUI,
    locationSelected: !!locationId,
    pageSize: PAGE_SIZE,
    loading: loadingByLocation,
    initialSelectedIds,
    report,
    isMobile,
    devices
  };
}
export default useDevicesList;
