'use client';

import React, { useMemo } from 'react';

import { DataTable } from '@/app/components/DataTable/DataTable';
import type { ColumnDefinition } from '@/app/components/DataTable/types';
import ActionMenuCell from '@/app/components/ActionMenuCell/ActionMenuCell';

import useRefactionsList, { RefactionRow } from './hooks/useRefactionsList';
import type { Props } from './types';
import { Button } from '@/app/components/Button/Button';
const RefactionsList: React.FC<Props> = ({ onCreate, onEdit }) => {
  const {
    rows,
    pageSize,
    deleteRow,
    confirmDeleteUI,
    report,
    isMobile, // ⚙️ Asegúrate de que tu hook `useRefactionsList` devuelva este flag
  } = useRefactionsList();

  const columns: ColumnDefinition<RefactionRow>[] = useMemo(() => {
    if (isMobile) {
      // 📱 Vista móvil: columnas reducidas
      return [
        {
          key: 'description',
          label: 'Descripción',
          render: (row) => row.description || 'N/A',
          cellClass: 'w-2/5 text-left pr-2',
          headerClass: 'w-2/5 text-left pr-2',
        },
        {
          key: 'serialnumber',
          label: 'N° Serie',
          render: (row) => row.serialnumber || 'N/A',
          cellClass: 'w-2/5 text-left pr-2',
          headerClass: 'w-2/5 text-left pr-2',
        },
        {
          key: 'actions' as any,
          label: '',
          cellClass: 'w-1/5 text-right',
          headerClass: 'w-1/5 text-right ',
          render: (row) => (
            <div className="flex justify-end">
              {!report?.clientsign?.url && (
                <ActionMenuCell
                  row={row}
                  onEdit={(target) => onEdit(String(target.id))}
                  onDelete={deleteRow}
                  permissions={{ details: false, update: true, delete: true }}
                />
              )}
            </div>
          ),
        },
      ];
    }

    // 💻 Vista escritorio: todas las columnas
    return [
      { key: 'description', label: 'DESCRIPCIÓN', render: (row) => row.description || 'N/A' },
      { key: 'brand', label: 'MARCA', render: (row) => row.brand || 'N/A' },
      { key: 'model', label: 'MODELO', render: (row) => row.model || 'N/A' },
      { key: 'serialnumber', label: 'NÚMERO DE SERIE', render: (row) => row.serialnumber || 'N/A' },
      { key: 'partnumber', label: 'NÚMERO DE PARTE', render: (row) => row.partnumber || 'N/A' },
      {
        key: 'actions' as any,
        label: '',
        cellClass: 'w-16 text-right',
        headerClass: 'w-16 text-right',
        render: (row) => (
          <div className="flex justify-end pr-2">
            {!report?.clientsign?.url && (
              <ActionMenuCell
                row={row}
                onEdit={(target) => onEdit(String(target.id))}
                onDelete={deleteRow}
                permissions={{ details: false, update: true, delete: true }}
              />
            )}
          </div>
        ),
      },
    ];
  }, [isMobile, deleteRow, onEdit, report]);

  return (
    <>
      <div className="flex flex-col gap-6">
        <DataTable<RefactionRow>
           textSize={{ mobile: "text-c1" }}
          showCalendar={false}
          showFilter={false}
          showDownloadTable={false}
          showButton={false}
          onTableActionClick={onCreate}
          actionsRender={() => (!report?.clientsign?.url) ? <Button hideIcon className={"w-full"} onClick={onCreate}>Agregar refacción</Button> : <></>}
          enableInternalSearch
          searchableKeys={['description', 'brand', 'model', 'serialnumber', 'partnumber']}
          rowsPerPage={pageSize}
          dataTableTitle="Lista de Refacciones"
          tables={[
            {
              title: 'Lista de Refacciones',
              data: rows,
              columns,
              enableSelection: false,
              enableCollaps: false,
              defaultSortKey: 'description',
              defaultSortDirection: 'asc',
            },
          ]}
        />

        {rows.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500">
            Aún no has registrado refacciones para este reporte.
          </div>
        )}
      </div>

      {confirmDeleteUI}
    </>
  );
};

export default RefactionsList;
