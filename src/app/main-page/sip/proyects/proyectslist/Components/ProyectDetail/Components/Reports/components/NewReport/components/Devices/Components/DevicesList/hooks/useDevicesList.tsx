'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { PopUp } from '@/app/components/PopUp/PopUp';
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';
import useReportBuilderStore from '@/app/stores/useReportBuilderStore/useReportBuilderStore';
import useReportDevicesStore from '@/app/stores/useReportDevicesStore/useReportDevicesStore';
import type { ReportDeviceView } from '@/app/mappings/reports/reports.types';
import { DeviceExternalView } from '@/app/mappings/devices/devices.types';
import { resolveExternalView, normalizeId, buildDeviceLabel } from '../../../utilities/DevicesUtilities';

const PAGE_SIZE = 4;


const useDevicesList = () => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState<DeviceExternalView | null>(null);

  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert, hideAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;

  const { location, updateReportDevices } = useReportBuilderStore(
    (s) => ({ location: s.report.location, updateReportDevices: s.updateReportDevices }),
    shallow
  );
  const locationId = location?.id ? String(location.id) : '';

  const {
    locationDevices,
    fetchDevicesByLocation,
    fetchDevices,
    deleteDevice,
    loadingByLocation,
    removing,
    successDelete,
    error,
    resetFlags,
  } = useReportDevicesStore(
    (s) => ({
      locationDevices: s.devices,
      fetchDevicesByLocation: s.fetchDevicesByLocation,
      fetchDevices: s.fetchDevices,
      deleteDevice: s.deleteDevice,
      loadingByLocation: s.loadingByLocation,
      removing: s.removing,
      successDelete: s.successDelete,
      error: s.error,
      resetFlags: s.resetFlags,
    }),
    shallow
  );

  // fetch
  useEffect(() => {
    if (!locationId) {
      setSelectedIds(new Set());
      updateReportDevices([]);
      return;
    }
    // void fetchDevicesByLocation(locationId);
    void fetchDevices();
  }, [fetchDevicesByLocation, locationId, updateReportDevices]);

  // map rows
  const rows: DeviceExternalView[] = useMemo(
    () =>
      locationDevices.filter((d) => {
      if( d.idlocation == locationId && d.is_active) return d;
      }),
    [locationDevices]
  );

  console.log("locationDevices",locationDevices);


  // sync selección -> report
  // useEffect(() => {
  //   const list = rows.filter((r) => selectedIds.has(r.id)).map((r) => r);
  //   updateReportDevices(list);
  // }, [rows, selectedIds, updateReportDevices]);

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
    const ok = await deleteDevice(String(toDelete.id));
    if (ok) setSelectedIds((prev) => { const next = new Set(prev); next.delete(String(toDelete.id)); return next; });
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
  const toggleRowSelected = useCallback((row: DeviceExternalView, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(row.id);
      else next.delete(row.id);
      return next;
    });
  }, []);

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
    selectedIds,
    toggleRowSelected,
    deleteRow: askDelete,
    confirmDeleteUI,
    locationSelected: !!locationId,
    pageSize: PAGE_SIZE,
    loading: loadingByLocation,
  };
}
export default useDevicesList;