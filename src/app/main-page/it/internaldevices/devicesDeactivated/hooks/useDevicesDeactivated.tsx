"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";

import ActionMenuCell from "@/app/components/ActionMenuCell/ActionMenuCell";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import type { InternalDevice } from "@/app/mappings/internaldevices/internaldevices.types";
import { useInternalDevicesStore } from "@/app/stores/useInternalDevicesStore/useInternalDevicesStore";

import type { DeactivatedDeviceRow } from "../types";

/**
 * Handles deactivated devices loading, table projection, and detail actions.
 */
const useDevicesDeactivated = () => {
  const { currentPagePermissions } = useAuth();
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const [selectedDevice, setSelectedDevice] = useState<InternalDevice | null>(
    null,
  );
  const [reactivationDevice, setReactivationDevice] =
    useState<DeactivatedDeviceRow | null>(null);

  const {
    deactivatedDevices,
    fetchDeactivatedDevices,
    activateDevice,
    loading,
    activatingDevice,
    error,
    successActivateDevice,
    resetFlags,
  } = useInternalDevicesStore(
    (state) => ({
      deactivatedDevices: state.deactivatedDevices,
      fetchDeactivatedDevices: state.fetchDeactivatedDevices,
      activateDevice: state.activateDevice,
      loading: state.loadingDeactivatedDevices,
      activatingDevice: state.activatingDevice,
      error: state.error,
      successActivateDevice: state.successActivateDevice,
      resetFlags: state.resetFlags,
    }),
    shallow,
  );

  useEffect(() => {
    void fetchDeactivatedDevices();
  }, [fetchDeactivatedDevices]);

  useEffect(() => {
    if (loading || activatingDevice) {
      showSpinner({
        message: activatingDevice
          ? "Reactivando dispositivo..."
          : "Cargando dispositivos desactivados...",
      });
      return;
    }

    hideSpinner();

    if (error) {
      showAlert({
        type: "error",
        title: "Ocurrio un error",
        description: error,
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
    }

    if (successActivateDevice) {
      showAlert({
        type: "info",
        title: "Dispositivo reactivado",
        description: "El dispositivo fue reactivado correctamente.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
      setSelectedDevice(null);
      setReactivationDevice(null);
      void fetchDeactivatedDevices(true);
    }

    if (error || successActivateDevice) {
      resetFlags();
    }
  }, [
    activatingDevice,
    error,
    fetchDeactivatedDevices,
    hideSpinner,
    loading,
    resetFlags,
    showAlert,
    showSpinner,
    successActivateDevice,
  ]);

  const rows = useMemo<DeactivatedDeviceRow[]>(
    () =>
      deactivatedDevices.map((device, index) => ({
        id: device.device_id || String(index + 1),
        display_id: String(index + 11).padStart(3, "0"),
        device: device.device_type?.name ?? "-",
        brand: device.device_brand?.name ?? "-",
        model: device.model || "-",
        serial_number: device.serial_number || "-",
        name: device.name || "-",
        conditions: device.device_status?.description || "-",
        created_at: device.created_at,
      })),
    [deactivatedDevices],
  );

  const handleOpenDetails = useCallback(
    (row: DeactivatedDeviceRow) => {
      if (!currentPagePermissions?.viewDeactivatedDeviceDetails) return;
      const device = deactivatedDevices.find(
        (item) => item.device_id === row.id,
      );
      setSelectedDevice(device ?? null);
    },
    [currentPagePermissions?.viewDeactivatedDeviceDetails, deactivatedDevices],
  );

  const handleReactivate = useCallback((row: DeactivatedDeviceRow) => {
    if (!currentPagePermissions?.reactivateDevice) return;
    setReactivationDevice(row);
  }, [currentPagePermissions?.reactivateDevice]);

  const handleCloseReactivationPopup = useCallback(() => {
    setReactivationDevice(null);
  }, []);

  const handleConfirmReactivation = useCallback(() => {
    if (!currentPagePermissions?.reactivateDevice) return;
    if (!reactivationDevice) return;
    void activateDevice(reactivationDevice.id);
  }, [activateDevice, currentPagePermissions?.reactivateDevice, reactivationDevice]);

  const columns = useMemo<ColumnDefinition<DeactivatedDeviceRow>[]>(
    () => [
      {
        key: "display_id",
        label: "ID",
        cellClass: "w-[6%] px-2",
        headerClass: "w-[6%] px-2",
      },
      {
        key: "device",
        label: "DISPOSITIVO",
        cellClass: "w-[10%] px-2",
        headerClass: "w-[10%] px-2",
      },
      {
        key: "brand",
        label: "MARCA",
        cellClass: "w-[10%] px-2",
        headerClass: "w-[10%] px-2",
      },
      {
        key: "model",
        label: "MODELO",
        cellClass: "w-[12%] px-2",
        headerClass: "w-[12%] px-2",
      },
      {
        key: "serial_number",
        label: "No. SERIE",
        cellClass: "w-[14%] px-2",
        headerClass: "w-[14%] px-2",
      },
      {
        key: "name",
        label: "NOMBRE",
        cellClass: "w-[12%] px-2",
        headerClass: "w-[12%] px-2",
      },
      {
        key: "conditions",
        label: "CONDICIONES",
        cellClass: "w-[30%] px-2",
        headerClass: "w-[30%] px-2",
        render: (row) => (
          <span className="block max-w-[320px] truncate">{row.conditions}</span>
        ),
      },
      {
        key: "actions",
        label: "",
        cellClass: "w-[4%] px-2 text-center text-green-80",
        headerClass: "w-[4%] px-2",
        render: (row) => (
          <ActionMenuCell
            row={row}
            editLabel="Ver detalle"
            onDetails={handleOpenDetails}
            onReactivate={handleReactivate}
            reactivateLabel="Reactivar"
            permissions={{ details: Boolean(currentPagePermissions?.viewDeactivatedDeviceDetails), renew: Boolean(currentPagePermissions?.reactivateDevice) }}
          />
        ),
      },
    ],
    [currentPagePermissions?.reactivateDevice, currentPagePermissions?.viewDeactivatedDeviceDetails, handleOpenDetails, handleReactivate],
  );

  const searchableKeys = useMemo<(keyof DeactivatedDeviceRow)[]>(
    () => ["device", "brand", "model", "serial_number", "name", "conditions"],
    [],
  );

  const handleRefresh = useCallback(() => {
    void fetchDeactivatedDevices(true);
  }, [fetchDeactivatedDevices]);

  const closeDetails = useCallback(() => {
    setSelectedDevice(null);
  }, []);

  return {
    closeDetails,
    columns,
    handleCloseReactivationPopup,
    handleConfirmReactivation,
    rows,
    searchableKeys,
    selectedDevice,
    reactivationDevice,
    handleRefresh,
  };
};

export default useDevicesDeactivated;
