"use client"
'use client';

import React, { useMemo } from 'react';

import ActionMenuCell from '@/app/components/ActionMenuCell/ActionMenuCell';
import { Button } from '@/app/components/Button/Button';
import { DataTable } from '@/app/components/DataTable/DataTable';
import type { ColumnDefinition } from '@/app/components/DataTable/types';

import useRefactionsList, { RefactionRow } from './hooks/useRefactionsList';
import type { Props } from './types';

const RefactionsList: React.FC<Props> = ({ onCreate, onEdit }) => {
  const {
    rows,
    onSelectedChange,
    pageSize,
    deleteRow,
    confirmDeleteUI,
    initialSelectedIds,
    report,
    isMobile,
    loading,
    projectSelected,
  } = useRefactionsList();

  const columns: ColumnDefinition<RefactionRow>[] = useMemo(() => {
    if (isMobile) {
      return [
        {
          key: 'description',
          label: 'Descripción',
          render: (row) => row.description || 'N/A',
          cellClass: 'w-2/5 text-left pr-2',
          headerClass: 'w-2/5 text-left pr-2',
          showSortIndicator: false,
        },
        {
          key: 'serialnumber',
          label: 'N° Serie',
          render: (row) => row.serialnumber || 'N/A',
          cellClass: 'w-2/5 text-left pr-2',
          headerClass: 'w-2/5 text-left pr-2',
        },
        {
          key: 'actions' as never,
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

    return [
      { key: 'description', label: 'DESCRIPCIÓN', render: (row) => row.description || 'N/A', showSortIndicator: false },
      { key: 'brand', label: 'MARCA', render: (row) => row.brand || 'N/A' },
      { key: 'model', label: 'MODELO', render: (row) => row.model || 'N/A' },
      { key: 'serialnumber', label: 'NÚMERO DE SERIE', render: (row) => row.serialnumber || 'N/A' },
      { key: 'partnumber', label: 'NÚMERO DE PARTE', render: (row) => row.partnumber || 'N/A' },
      {
        key: 'actions' as never,
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
  }, [deleteRow, isMobile, onEdit, report]);

  if (!projectSelected) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
        No se encontró el proyecto del reporte para consultar las refacciones disponibles.
      </div>
    );
  }

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
          actionsRender={() =>
            !report?.clientsign?.url ? (
              <Button hideIcon className={"w-full"} onClick={onCreate}>
                Nueva refacción
              </Button>
            ) : <></>
          }
          enableInternalSearch
          searchableKeys={['description', 'brand', 'model', 'serialnumber', 'partnumber']}
          rowsPerPage={pageSize}
          dataTableTitle="Refacciones registradas"
          tables={[
            {
              title: 'Seleccionar refacción',
              data: rows,
              columns,
              enableSelection: true,
              disableSelection: Boolean(report?.clientsign?.url),
              enableCollaps: false,
              scrollMaxHeight: 320,
              defaultSortKey: 'description',
              defaultSortDirection: 'asc',
              initialSelectedRowIds: initialSelectedIds,
            },
          ]}
          onSelectedChange={(_, selected) => onSelectedChange(selected)}
        />

        {rows.length === 0 && !loading && (
          <div className="rounded-xl border border-slate-200 border-slate-500 bg-white-100 px-6 py-10 text-center text-sm text-slate-500">
            No se encontraron refacciones disponibles para este proyecto.
          </div>
        )}
      </div>

      {confirmDeleteUI}
    </>
  );
};

export default RefactionsList;
