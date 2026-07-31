"use client";

import { DataTable } from "@/app/components/DataTable/DataTable";
import { PopUp } from "@/app/components/PopUp/PopUp";

import DeactivatedDeviceDetail from "./components/DeactivatedDeviceDetail";
import useDevicesDeactivated from "./hooks/useDevicesDeactivated";
import type { DeactivatedDeviceRow } from "./types";

const DevicesDeactivated = () => {
  const {
    closeDetails,
    columns,
    handleCloseReactivationPopup,
    handleConfirmReactivation,
    rows,
    searchableKeys,
    selectedDevice,
    reactivationDevice,
    handleRefresh,
  } = useDevicesDeactivated();

  return (
    <>
      <DataTable<DeactivatedDeviceRow>
        tables={[
          {
            title: "Inventario dispositivos desactivados",
            columns,
            data: rows,
            enableCollaps: false,
            enableSelection: false,
          },
        ]}
        textSize={{ mobile: "text-d3", desktop: "text-c2" }}
        enableInternalSearch
        searchableKeys={searchableKeys}
        showCalendar
        dateKey="created_at"
        showFilter
        showRefresh
        showDownloadTable
        onRefreshPage={handleRefresh}
        filterTitle="Filtros"
        dataTableTitle="Inventario dispositivos desactivados"
        showButton={false}
        rowsPerPage={10}
      />
      <DeactivatedDeviceDetail
        open={Boolean(selectedDevice)}
        device={selectedDevice}
        onClose={closeDetails}
      />
      <PopUp
        open={Boolean(reactivationDevice)}
        onClose={handleCloseReactivationPopup}
        title="Reactivar dispositivo"
        content="¿Estas seguro de reactivar este dispositivo? Al reactivar el dispositivo podra verlo en la seccion de dispositivos para su nueva asignacion"
        showSecondaryButton
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={handleCloseReactivationPopup}
        showPrimaryButton
        primaryButtonText="Reactivar"
        onPrimaryButtonClick={handleConfirmReactivation}
      />
    </>
  );
};

export default DevicesDeactivated;
