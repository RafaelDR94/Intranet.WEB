'use client';

import ActionMenuCell from '@/app/components/ActionMenuCell/ActionMenuCell';
import { DataTable } from '@/app/components/DataTable/DataTable';
import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery';
import type { ColumnDefinition } from '@/app/components/DataTable/types';
import { PopUp } from '@/app/components/PopUp/PopUp';

import { useProvidersList } from '../hooks/useProvidersList';
import type { CrudRecord, CrudScope } from '../../types';
import { Button } from '@/app/components/Button/Button';

type ProvidersListProps = {
  scope: CrudScope;
};

const ProvidersList = ({ scope }: ProvidersListProps) => {
  const state = useProvidersList(scope);
  const isMobile = useIsMobile();

  const actionColumn: ColumnDefinition<CrudRecord> = {
    key: 'actions',
    label: '',
    cellClass: isMobile ? 'w-[16%] min-w-0 px-2' : 'w-[10%] min-w-0 px-2',
    headerClass: isMobile ? 'w-[16%] min-w-0 px-2' : 'w-[10%] min-w-0 px-2',
    render: (row) => (
      <ActionMenuCell
        row={row}
        editLabel="Ver mas"
        onDetails={() => state.onDetail(row.id)}
        onDelete={() => state.onRequestDelete(row)}
        permissions={{ details: true, delete: true }}
      />
    ),
  };

  const columns: ColumnDefinition<CrudRecord>[] = isMobile
    ? [
        {
          key: 'primary',
          label: 'PROVEEDOR',
          cellClass: 'w-[48%] min-w-0 px-2',
          headerClass: 'w-[48%] min-w-0 px-2',
        },
        {
          key: 'secondary',
          label: 'PAGINA WEB',
          cellClass: 'w-[36%] min-w-0 px-2',
          headerClass: 'w-[36%] min-w-0 px-2',
        },
        actionColumn,
      ]
    : [
        {
          key: 'primary',
          label: 'PROVEEDOR',
          cellClass: 'w-[30%] min-w-0 px-2',
          headerClass: 'w-[30%] min-w-0 px-2',
        },
        {
          key: 'secondary',
          label: 'PAGINA WEB',
          cellClass: 'w-[36%] min-w-0 px-2',
          headerClass: 'w-[36%] min-w-0 px-2',
        },
        {
          key: 'tertiary',
          label: 'TELEFONO',
          cellClass: 'w-[24%] min-w-0 px-2',
          headerClass: 'w-[24%] min-w-0 px-2',
        },
        actionColumn,
      ];

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

      <div data-tour="providers-crud-list">
        <DataTable
          showCalendar={false}
          showFilter={false}
          showButton={false}
          rightContent={
            <Button
              variant="solid"
              hideIcon
              size="medium"
              onClick={state.onCreate}
              data-tour="providers-crud-list-create"
              className={isMobile ? 'w-full mt-3' : ''}
            >
              Nuevo proveedor
            </Button>
          }
          enableInternalSearch
          searchableKeys={state.searchableKeys}
          textSize={{ mobile: 'text-d3', desktop: 'text-b3' }}
          searchDataTour="providers-crud-list-search"
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

export default ProvidersList;
