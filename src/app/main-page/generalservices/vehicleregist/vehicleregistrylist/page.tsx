'use client';

import { useMemo } from 'react';

import { DataTable } from '@/app/components/DataTable/DataTable';
import type { ColumnDefinition } from '@/app/components/DataTable/types';
import useVehicleRegistryList from './hooks/useVehicleRegistryList';
import type { VehicleRegistryRow } from './types';
import Label from '@/app/components/Label/Label';
import { Button } from '@/app/components/Button/Button';
import RegistDetails from './components/RegistDetails.tsx/RegistDetails';
const VehicleRegistryList = () => {
  const {
    inTransitRows,
    otherRows,
    loading,
    handleRefresh,
    handleCreate,
    handleArrive,
    searchableKeys,
    handleCloseDetails,
    openDetailsPanel,
    handleOpenDetails
  } = useVehicleRegistryList();

  const transitcolumns = useMemo<ColumnDefinition<VehicleRegistryRow>[]>(
    () => [
      { key: 'departureDate', label: 'SALIDA', headerClass: "w-1/12", cellClass: "w-1/12" },
      { key: 'departureTime', label: 'HORA SALIDA', headerClass: "w-1/12", cellClass: "w-1/12" },
      { key: 'vehicle', label: 'VEHICULO', headerClass: "w-3/12", cellClass: "w-3/12" },
      { key: 'plates', label: 'PLACA', headerClass: "w-1/10", cellClass: "w-1/10" },
      { key: 'driver', label: 'CONDUCTOR', headerClass: "w-4/12", cellClass: "w-4/12" },
      {
        key: "status",
        label: "ESTATUS",
        headerClass: "w-1/13", cellClass: "w-1/12",
        render: (row) => (
          <Label
            type={"invalido"}
            text={row.status}
          />
        ),
      },
      { key: 'departureSort', label: 'ORDER', invisible: true },

      {
        key: 'regist' as unknown as keyof VehicleRegistryRow,
        headerClass: "w-1/14", cellClass: "w-1/14",
        label: 'REGISTRAR',
        render: (row) => (
          <Button
            size="small"
            variant="solid"
            hideIcon
            onClick={() => {
              handleArrive(row.assignment);
            }}
          >
            Llegada
          </Button>
        ),
      },

      {
        key: 'more' as unknown as keyof VehicleRegistryRow,
        label: '',
        headerClass: "w-1/14", cellClass: "w-1/14",
        render: (row) => (

          <Button
            size="small"
            variant="ghost"
            hideIcon
            onClick={() => {
              handleOpenDetails(row.assignment);
            }}
          >
            Ver Más
          </Button>


        ),
      },
    ],
    []
  );

  const columns = useMemo<ColumnDefinition<VehicleRegistryRow>[]>(
    () => [
      { key: 'departureDate', label: 'SALIDA', headerClass: "w-1/12", cellClass: "w-1/12" },
      { key: 'departureTime', label: 'HORA SALIDA', headerClass: "w-1/12", cellClass: "w-1/12" },
      { key: 'arrivalDate', label: 'LLEGADA', headerClass: "w-1/12", cellClass: "w-1/12" },
      { key: 'arrivalTime', label: 'HORA LLEGADA', headerClass: "w-1/12", cellClass: "w-1/12" },
      { key: 'vehicle', label: 'VEHICULO', headerClass: "w-4/12", cellClass: "w-4/12" },
      { key: 'plates', label: 'PLACA', headerClass: "w-1/10", cellClass: "w-1/10" },
      { key: 'driver', label: 'CONDUCTOR', headerClass: "w-3/12", cellClass: "w-3/12" },
      {
        key: "status",
        label: "ESTATUS",
        headerClass: "w-1/13", cellClass: "w-1/13",
        render: (row) => (
          <Label
            type={"valido"}
            text={row.status}
          />
        ),
      },
      { key: 'departureSort', label: 'ORDER', invisible: true },
      {
        key: 'more' as unknown as keyof VehicleRegistryRow,
        label: '',
        headerClass: "w-1/14", cellClass: "w-1/14",
        render: (row) => (

          <Button
            size="small"
            variant="ghost"
            hideIcon
            onClick={() => {
              handleOpenDetails(row.assignment);
            }}
          >
            Ver Más
          </Button>


        ),
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-10">
      <DataTable<VehicleRegistryRow>
        tables={[
          {
            title: 'Registro Vehicular en Transito',
            columns: transitcolumns,
            data: inTransitRows,
            enableCollaps: true,
            enableSelection: false,
            defaultSortKey: 'departureSort',
            defaultSortDirection: 'desc',
          },
        ]}
        enableInternalSearch
        searchableKeys={searchableKeys}
        showCalendar={false}
        showFilter={false}
        showButton={false}
        showRefresh
        onRefreshPage={handleRefresh}
        rowsPerPage={5}
        dataTableTitle="Registro Vehicular en Transito"
      />

      <DataTable<VehicleRegistryRow>
        tables={[
          {
            title: 'Registro Vehicular',
            columns,
            data: otherRows,
            enableCollaps: true,
            enableSelection: false,
            defaultSortKey: 'departureSort',
            defaultSortDirection: 'desc',
          },
        ]}
        enableInternalSearch
        searchableKeys={searchableKeys}
        showCalendar={false}
        showFilter={false}
        showRefresh
        onRefreshPage={handleRefresh}
        actionLabel="Nuevo Registro"
        onTableActionClick={handleCreate}
        rowsPerPage={5}
        dataTableTitle="Registro Vehicular"
      />
      <RegistDetails onClose={() => { handleCloseDetails() }} open={openDetailsPanel} />

      {loading && inTransitRows.length === 0 && otherRows.length === 0 ? (
        <span className="text-sm text-gray-500">Cargando registros...</span>
      ) : null}
    </div>
  );
};

export default VehicleRegistryList;
