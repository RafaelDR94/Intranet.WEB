'use client';

import { useMemo, useState } from 'react';

import ActionMenuCell from '@/app/components/ActionMenuCell/ActionMenuCell';
import { DataTable } from '@/app/components/DataTable/DataTable';
import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery';
import type { ColumnDefinition } from '@/app/components/DataTable/types';
import Label from '@/app/components/Label/Label';
import { PopUp } from '@/app/components/PopUp/PopUp';

import { refactionsConfig, refactionsDefinition } from '../../crudDefinitions';
import { useCrudModule } from '../../crudShared';
import type { CrudScope } from '../../types';

type RefactionsListProps = {
  scope: CrudScope;
};

type RefactionListRow = (typeof refactionsDefinition.rows)[number] & {
  equipment: string;
  brand: string;
};

const statusToLabelType = (status: string) => {
  const normalized = status.trim().toLowerCase();

  if (normalized === 'disponible') return 'valido' as const;
  if (normalized === 'en uso') return 'pendiente' as const;
  return 'invalido' as const;
};

const RefactionsList = ({ scope }: RefactionsListProps) => {
  const crud = useCrudModule(refactionsDefinition, scope);
  const isMobile = useIsMobile();
  const [rowPendingDeletion, setRowPendingDeletion] = useState<RefactionListRow | null>(null);

  const rows = useMemo<RefactionListRow[]>(
    () =>
      refactionsDefinition.rows.map((row) => ({
        ...row,
        equipment: row.secondary,
        brand: row.tertiary,
      })),
    [],
  );

  const actionColumn = useMemo<ColumnDefinition<RefactionListRow>>(
    () => ({
      key: 'actions',
      label: '',
      cellClass: 'w-[6%] min-w-0 px-2',
      headerClass: 'w-[6%] min-w-0 px-2',
      render: (row) => (
        <ActionMenuCell
          row={row}
          editLabel="Ver mas"
          onDetails={() => crud.goDetail(row.id)}
          onDelete={() => setRowPendingDeletion(row)}
          permissions={{ details: true, delete: true }}
        />
      ),
    }),
    [crud],
  );

  const columnsDesktop = useMemo<ColumnDefinition<RefactionListRow>[]>(
    () => [
      {
        key: 'id',
        label: 'ID',
        cellClass: 'w-[7%] min-w-0 px-2',
        headerClass: 'w-[7%] min-w-0 px-2',
      },
      {
        key: 'primary',
        label: 'NOMBRE',
        cellClass: 'w-[14%] min-w-0 px-2',
        headerClass: 'w-[14%] min-w-0 px-2',
      },
      {
        key: 'equipment',
        label: 'EQUIPO',
        cellClass: 'w-[15%] min-w-0 px-2',
        headerClass: 'w-[15%] min-w-0 px-2',
      },
      {
        key: 'brand',
        label: 'MARCA',
        cellClass: 'w-[11%] min-w-0 px-2',
        headerClass: 'w-[11%] min-w-0 px-2',
      },
      {
        key: 'model',
        label: 'MODELO',
        cellClass: 'w-[11%] min-w-0 px-2',
        headerClass: 'w-[11%] min-w-0 px-2',
      },
      {
        key: 'serialOrPart',
        label: 'No. SERIE',
        cellClass: 'w-[12%] min-w-0 px-2',
        headerClass: 'w-[12%] min-w-0 px-2',
      },
      {
        key: 'stock',
        label: 'STOCK',
        cellClass: 'w-[6%] min-w-0 px-2',
        headerClass: 'w-[6%] min-w-0 px-2',
      },
      {
        key: 'provider',
        label: 'PROVEEDOR',
        cellClass: 'w-[12%] min-w-0 px-2',
        headerClass: 'w-[12%] min-w-0 px-2',
      },
      {
        key: 'status',
        label: 'ESTATUS',
        cellClass: 'w-[10%] min-w-0 px-2',
        headerClass: 'w-[10%] min-w-0 px-2',
        render: (row) => <Label type={statusToLabelType(row.status)} text={row.status} />,
      },
      actionColumn,
    ],
    [actionColumn],
  );

  const columnsMobile = useMemo<ColumnDefinition<RefactionListRow>[]>(
    () => [
      {
        key: 'id',
        label: 'ID',
        cellClass: 'w-2/12 min-w-0 px-2',
        headerClass: 'w-2/12 min-w-0 px-2',
      },
      {
        key: 'primary',
        label: 'NOMBRE',
        cellClass: 'w-7/12 min-w-0 px-2',
        headerClass: 'w-7/12 min-w-0 px-2',
      },
      actionColumn,
    ],
    [actionColumn],
  );

  const handleConfirmDelete = async () => {
    if (!rowPendingDeletion) return;

    crud.hideAlert();
    crud.showSpinner({ message: 'Eliminando refaccion...' });
    await Promise.resolve();
    crud.hideSpinner();
    setRowPendingDeletion(null);
    crud.showAlert({
      type: 'success',
      variant: 'subtle',
      title: 'Refaccion eliminada',
      description: `Se elimino ${rowPendingDeletion.primary} correctamente.`,
      showPrimaryButton: false,
      showSecondaryButton: false,
    });
  };

  return (
    <>
      <PopUp
        open={Boolean(rowPendingDeletion)}
        onClose={() => setRowPendingDeletion(null)}
        title={
          rowPendingDeletion
            ? `Eliminar ${rowPendingDeletion.primary}`
            : 'Eliminar refaccion'
        }
        content="Esta accion solo representa el flujo visual del CRUD compartido."
        showPrimaryButton
        showSecondaryButton
        primaryButtonText="Eliminar"
        secondaryButtonText="Cancelar"
        onPrimaryButtonClick={handleConfirmDelete}
        onSecondaryButtonClick={() => setRowPendingDeletion(null)}
      />

      <div data-tour="refactions-crud-list">
        <DataTable
          showCalendar={false}
          showFilter={false}
          showButton
          actionLabel={refactionsConfig.createLabel}
          onTableActionClick={crud.goCreate}
          enableInternalSearch
          searchableKeys={[
            'id',
            'primary',
            'equipment',
            'brand',
            'model',
            'serialOrPart',
            'provider',
            'status',
          ]}
          textSize={{ mobile: 'text-d3', desktop: 'text-b3' }}
          searchDataTour="refactions-crud-list-search"
          actionButtonDataTour="refactions-crud-list-create"
          tables={[
            {
              data: rows,
              columns: isMobile ? columnsMobile : columnsDesktop,
              title: crud.title,
            },
          ]}
        />
      </div>
    </>
  );
};

export default RefactionsList;
