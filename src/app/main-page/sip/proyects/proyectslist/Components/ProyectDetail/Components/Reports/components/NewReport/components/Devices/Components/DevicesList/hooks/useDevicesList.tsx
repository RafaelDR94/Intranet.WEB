'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { PopUp } from '@/app/components/PopUp/PopUp';
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';
import useReportBuilderStore from '@/app/stores/useReportBuilderStore/useReportBuilderStore';
import useReportDevicesStore from '@/app/stores/useReportDevicesStore/useReportDevicesStore';
import { DeviceExternalView } from '@/app/mappings/devices/devices.types';
import { normalizeId, buildDeviceLabel } from '../../../utilities/DevicesUtilities';

const PAGE_SIZE = 4;


const useDevicesList = () => {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState<DeviceExternalView | null>(null);

  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert, hideAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;

  const { selecteddevices,location, updateReportDevices ,} = useReportBuilderStore(
    (s) => ({ location: s.report.location, updateReportDevices: s.updateReportDevices,selecteddevices:s.report.reportDeviceView }),
    shallow
  );
  const locationId = location?.id ? String(location.id) : '';
  console.log("selecteddevices",selecteddevices);

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
    console.log("Se estan actualizando aqui");
    const devices = selected.map((device, index) => ({
      id: normalizeId(device, index),
      device_external_view: device,
    }));
    updateReportDevices(devices);
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
  };
}
export default useDevicesList;