'use client';

import { Checkbox } from '@/app/components/CheckBox/CheckBox';
import { DataTable } from '@/app/components/DataTable/DataTable';
import useDevicesList from './hooks/useDevicesList';
import { DeviceExternalView } from '@/app/mappings/devices/devices.types';
import { Props } from './types';
import { ColumnDefinition } from '@/app/components/DataTable/types';
import ActionMenuCell from '@/app/components/ActionMenuCell/ActionMenuCell';
const DevicesList: React.FC<Props> = ({  onCreate, onEdit }) => {

  const {
    rows,
    locationSelected,
    selectedIds,
    toggleRowSelected,
    deleteRow,                 // elimina desde la lista (opcional)
    pageSize,
    loading,
    confirmDeleteUI,          // PopUp administrado internamente
  } = useDevicesList();

  const columns:ColumnDefinition<DeviceExternalView> []= [
    {
      key: 'selector',
      label: '',
      cellClass: 'w-16',
      render: (row: DeviceExternalView) => (
        <Checkbox
          checked={selectedIds.has(row?.id)}
          onChange={(value) => toggleRowSelected(row, value)}
          dataTestId={`device-selector-${row?.id}`}
        />
      ),
      headerClass: 'w-16',
    },
    { key: 'brand', label: 'Marca', render: (row: DeviceExternalView) => row?.brand || 'N/A' },
    { key: 'model', label: 'Modelo', render: (row: DeviceExternalView) => row?.model || 'N/A' },
    { key: 'serialnumber', label: 'No. serie', render: (row: DeviceExternalView) => row?.serialnumber || 'N/A' },
    {
      key: 'actions',
      label: '',
      cellClass: 'w-16 text-right',
     render: (row) => (
          <div className={"flex justify-end pr-2"}>
            <ActionMenuCell row={row} onEdit={onEdit} onDelete={deleteRow} />
          </div>
        ),

    },
    
  ] as ColumnDefinition<DeviceExternalView> [];

  if (!locationSelected) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
        Selecciona una ubicación en el paso de Avance para consultar los dispositivos disponibles.
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <DataTable<DeviceExternalView>
          actionLabel="Nuevo Equipo"
          showCalendar={false}
          showFilter={false}
          showDownloadTable={false}
          showButton
          onTableActionClick={onCreate}
          enableInternalSearch
          searchableKeys={['brand', 'model', 'serialnumber']}
          rowsPerPage={pageSize}
          dataTableTitle="Equipos registrados"
          tables={[{ title: 'Seleccionar equipo', data: rows, columns, enableSelection: false, enableCollaps: false, defaultSortKey: 'brand' }]}
        />

        {rows.length === 0 && !loading && (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500">
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
