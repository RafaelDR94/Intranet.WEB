'use client';

import { useMemo } from 'react';

import { DataTable } from '@/app/components/DataTable/DataTable';
import type { ColumnDefinition } from '@/app/components/DataTable/types';
import ActionMenuCell from '@/app/components/ActionMenuCell/ActionMenuCell';

import useRefactionsList, { RefactionRow } from './hooks/useRefactionsList';
import type { Props } from './types';

const RefactionsList: React.FC<Props> = ({ onCreate, onEdit }) => {
  const { rows, pageSize, deleteRow, confirmDeleteUI } = useRefactionsList();

  const columns = useMemo<ColumnDefinition<RefactionRow>[]>(
    () => [
      { key: 'description', label: 'DESCRIPCIÓN', render: (row) => row.description || 'N/A' },
      { key: 'brand', label: 'MARCA', render: (row) => row.brand || 'N/A' },
      { key: 'model', label: 'MODELO', render: (row) => row.model || 'N/A' },
      { key: 'serialnumber', label: 'NÚMERO DE SERIE', render: (row) => row.serialnumber || 'N/A' },
      { key: 'partnumber', label: 'NÚMERO DE PARTE', render: (row) => row.partnumber || 'N/A' },
      {
        key: 'actions' as any,
        label: '',
        cellClass: 'w-16 text-right',
        render: (row) => (
          <div className="flex justify-end pr-2">
            <ActionMenuCell
              row={row}
              onEdit={(target) => onEdit(String(target.id))}
              onDelete={deleteRow}
              permissions={{ details: false, update: true, delete: true }}
            />
          </div>
        ),
      },
    ],
    [deleteRow, onEdit]
  );

  return (
    <>
      <div className="flex flex-col gap-6">
        <DataTable<RefactionRow>
          actionLabel="Agregar refaccion"
          showCalendar={false}
          showFilter={false}
          showDownloadTable={false}
          showButton
          onTableActionClick={onCreate}
          enableInternalSearch
          searchableKeys={[
            'description',
            'brand',
            'model',
            'serialnumber',
            'partnumber',
          ]}
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
