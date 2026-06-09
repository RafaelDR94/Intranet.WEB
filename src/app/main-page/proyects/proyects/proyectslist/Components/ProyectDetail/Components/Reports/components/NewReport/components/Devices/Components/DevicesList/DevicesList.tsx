"use client"


import React, { useMemo } from 'react';
import { DataTable } from '@/app/components/DataTable/DataTable';
import useDevicesList from './hooks/useDevicesList';
import { DeviceExternalView } from '@/app/mappings/devices/devices.types';
import { Props } from './types';
import { ColumnDefinition } from '@/app/components/DataTable/types';
import ActionMenuCell from '@/app/components/ActionMenuCell/ActionMenuCell';
import { Button } from '@/app/components/Button/Button';

const DevicesList: React.FC<Props> = ({ onCreate, onEdit }) => {

  const {
    rows,
    locationSelected,
    onSelectedChange,
    deleteRow,                 // elimina desde la lista (opcional)
    pageSize,
    loading,
    confirmDeleteUI,          // PopUp administrado internamente
    initialSelectedIds,
    report,
    isMobile,
  } = useDevicesList();

  const columns: ColumnDefinition<DeviceExternalView>[] = useMemo(() => {
    if (isMobile) {
      // 🟢 Solo columnas visibles en móviles
      return [
        {
          key: 'brand',
          label: 'Marca',
          render: (row) => row?.brand || 'N/A',
          cellClass: 'w-2/5 text-left pr-2',
          headerClass: 'w-2/5 text-left pr-2',
        },
        {
          key: 'serialnumber',
          label: 'No. serie',
          render: (row) => row?.serialnumber || 'N/A',
          cellClass: 'w-2/5 text-left pr-2',
          headerClass: 'w-2/5 text-left pr-2',
        },
        {
          key: 'actions',
          label: '',
          cellClass: 'w-1/5 text-right',
          headerClass: 'w-1/5 text-right ',
          render: (row) => (
            <div className="flex justify-end ">
              {!report?.clientsign?.url && (
                <ActionMenuCell
                  row={row}
                  onEdit={(row) => onEdit(row.id)}
                  onDelete={deleteRow}
                />
              )}
            </div>
          ),
        },
      ] as ColumnDefinition<DeviceExternalView>[];
    }

    // 💻 Vista escritorio: todas las columnas
    return [
      {
        key: 'brand',
        label: 'Marca',
        render: (row) => row?.brand || 'N/A',
        cellClass: 'w-20 text-left pr-2',
        headerClass: 'w-20 text-left pr-2',
      },
      {
        key: 'model',
        label: 'Modelo',
        render: (row) => row?.model || 'N/A',
        cellClass: 'w-30 text-left pr-2',
        headerClass: 'w-30 text-left pr-2',
      },
      {
        key: 'serialnumber',
        label: 'No. serie',
        render: (row) => row?.serialnumber || 'N/A',
        cellClass: 'w-20 text-left pr-2',
        headerClass: 'w-20 text-left pr-2',
      },
      {
        key: 'actions',
        label: '',
        render: (row) => (
          <div className="flex justify-end pr-2">
            {!report?.clientsign?.url && (
              <ActionMenuCell
                row={row}
                onEdit={(row) => onEdit(row.id)}
                onDelete={deleteRow}
              />
            )}
          </div>
        ),
      },
    ] as ColumnDefinition<DeviceExternalView>[];
  }, [isMobile, deleteRow, onEdit, report]);


  if (!locationSelected) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
        Para ver los dispositivos disponibles, primero debes seleccionar una ubicación en &quot;Avance&quot; (el primer paso de este reporte).
      </div>
    );
  }


  if (initialSelectedIds) return (
    <>
      <div className="flex flex-col gap-6">
        <DataTable<DeviceExternalView>
          textSize={{ mobile: "text-c1" }}
          showCalendar={false}
          showFilter={false}
          showDownloadTable={false}
          showButton={false}
          onTableActionClick={onCreate}
          actionsRender={() => (!report?.clientsign?.url) ? <Button hideIcon className={"w-full"} onClick={onCreate}>Nuevo Equipo</Button> : <></>}
          enableInternalSearch
          searchableKeys={['brand', 'model', 'serialnumber']}
          rowsPerPage={pageSize}
          dataTableTitle="Equipos registrados"
          tables={[{ title: 'Seleccionar equipo', data: rows, columns, enableSelection: true, disableSelection: Boolean(report?.clientsign?.url), enableCollaps: false, defaultSortKey: 'brand', initialSelectedRowIds: initialSelectedIds }]}
          onSelectedChange={(_, selected) => onSelectedChange(selected)}
        />

        {rows.length === 0 && !loading && (
          <div className="rounded-xl border border-slate-200 bg-white-100 px-6 py-10 text-center text-sm text-slate-500">
            No se encontraron dispositivos para la ubicación seleccionada.
          </div>
        )}
      </div>

      {/* PopUp de confirmación para eliminar manejado INTERNAMENTE */}
      {confirmDeleteUI}
    </>
  );
};

export default DevicesList;
