'use client';

import { useMemo } from 'react';

import { Copy, Ellipsis, Link2 } from 'lucide-react';

import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery';
import { DataTable } from '@/app/components/DataTable/DataTable';
import type { ColumnDefinition } from '@/app/components/DataTable/types';
import { PopUp } from '@/app/components/PopUp/PopUp';

import { useLocationsList } from '../hooks/useLocationsList';
import type { CrudRecord, CrudScope } from '../../types';

type LocationsListProps = {
  scope: CrudScope;
};

const LocationsList = ({ scope }: LocationsListProps) => {
  const state = useLocationsList(scope);
  const isMobile = useIsMobile();

  const handleCopy = async (value?: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
  };

  const actionColumn = useMemo<ColumnDefinition<CrudRecord>>(
    () => ({
      key: 'actions',
      label: 'ENLACE',
      cellClass: 'w-[12%] min-w-0 px-2',
      headerClass: 'w-[12%] min-w-0 px-2',
      render: (row) => (
        <div className="flex items-center justify-end gap-3 text-blue-60">
          <a
            href={row.mapLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-6 w-6 items-center justify-center"
            aria-label={`Abrir enlace de ${row.primary}`}
          >
            <Link2 className="h-5 w-5" strokeWidth={1.75} />
          </a>
          <button
            type="button"
            onClick={() => void handleCopy(row.mapLink)}
            className="inline-flex h-6 w-6 items-center justify-center"
            aria-label={`Copiar enlace de ${row.primary}`}
          >
            <Copy className="h-5 w-5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => state.onDetail(row.id)}
            className="inline-flex h-6 w-6 items-center justify-center"
            aria-label={`Ver detalle de ${row.primary}`}
          >
            <Ellipsis className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
      ),
    }),
    [state],
  );

  const columns = useMemo<ColumnDefinition<CrudRecord>[]>(
    () =>
      isMobile
        ? [
            {
              key: 'secondary',
              label: 'PROYECTO',
              cellClass: 'w-[40%] min-w-0 px-2',
              headerClass: 'w-[40%] min-w-0 px-2',
            },
            {
              key: 'primary',
              label: 'NOMBRE',
              cellClass: 'w-[44%] min-w-0 px-2',
              headerClass: 'w-[44%] min-w-0 px-2',
            },
            {
              ...actionColumn,
              label: '',
              cellClass: 'w-[16%] min-w-0 px-2',
              headerClass: 'w-[16%] min-w-0 px-2',
            },
          ]
        : [
            {
              key: 'secondary',
              label: 'PROYECTO',
              cellClass: 'w-[21%] min-w-0 px-2',
              headerClass: 'w-[21%] min-w-0 px-2',
            },
            {
              key: 'primary',
              label: 'NOMBRE',
              cellClass: 'w-[22%] min-w-0 px-2',
              headerClass: 'w-[22%] min-w-0 px-2',
            },
            {
              key: 'tertiary',
              label: 'DIRECCION',
              cellClass: 'w-[45%] min-w-0 px-2',
              headerClass: 'w-[45%] min-w-0 px-2',
            },
            actionColumn,
          ],
    [actionColumn, isMobile],
  );

  return (
    <>
      <PopUp
        open={state.popupOpen}
        onClose={state.onCloseDelete}
        title={state.popupTitle}
        content={state.popupContent}
        showPrimaryButton
        showSecondaryButton
        primaryButtonText="Eliminar"
        secondaryButtonText="Cancelar"
        onPrimaryButtonClick={state.onConfirmDelete}
        onSecondaryButtonClick={state.onCloseDelete}
      />

      <div data-tour="locations-crud-list">
        <DataTable
          showCalendar={false}
          showFilter={false}
          showButton
          actionLabel={state.actionLabel}
          onTableActionClick={state.onCreate}
          enableInternalSearch
          searchableKeys={state.searchableKeys}
          textSize={{ mobile: 'text-d3', desktop: 'text-b3' }}
          searchDataTour="locations-crud-list-search"
          actionButtonDataTour="locations-crud-list-create"
          tables={[
            {
              data: state.rows,
              columns,
              title: state.title,
            },
          ]}
        />
      </div>
    </>
  );
};

export default LocationsList;
