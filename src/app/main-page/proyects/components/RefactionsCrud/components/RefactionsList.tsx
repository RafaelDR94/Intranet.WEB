'use client';

import { useEffect, useMemo, useState } from 'react';

import ActionMenuCell from '@/app/components/ActionMenuCell/ActionMenuCell';
import { DataTable } from '@/app/components/DataTable/DataTable';
import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery';
import type { ColumnDefinition } from '@/app/components/DataTable/types';
import Label from '@/app/components/Label/Label';
import { PopUp } from '@/app/components/PopUp/PopUp';

import { refactionsDefinition } from '../../crudDefinitions';
import { useCrudModule } from '../../crudShared';
import type { CrudRecord, CrudScope } from '../../types';
import { Button } from '@/app/components/Button/Button';

import { shallow } from 'zustand/shallow';

import useProyectInventoryStore from '@/app/stores/useProyectInventoryStore/useProyectInventoryStore';
import useQuery from '@/app/hooks/useQuery/useQuery';

type RefactionsListProps = {
  scope: CrudScope;
};

type RefactionListRow = {
  id: string;
  primary: string;
  equipment: string;
  brand: string;
  model: string;
  serialOrPart: string;
  stock: number | string;
  provider: string;
  status: string;
  actions: string;
};

const statusToLabelType = (status: string) => {
  const normalized = status.trim().toLowerCase();

  if (normalized === 'disponible') return 'valido' as const;
  if (normalized === 'en uso') return 'pendiente' as const;
  return 'invalido' as const;
};

const toSingleQueryValue = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? value[0] ?? '' : value ?? '';

const RefactionsList = ({ scope }: RefactionsListProps) => {
  const isMobile = useIsMobile();
  const [rowPendingDeletion, setRowPendingDeletion] = useState<RefactionListRow | null>(null);
  const { all } = useQuery();
  const projectId = toSingleQueryValue(all.id);

  const {
    spareParts,
    sparePartsByProyect,
    loadingSpareParts,
    loadingSparePartsByProyect,
    fetchSpareParts,
    fetchSparePartsByProyectId,
    deleteSparePart,
    resetFlags,
  } = useProyectInventoryStore(
    (state) => ({
      spareParts: state.spareParts,
      sparePartsByProyect: state.sparePartsByProyect,
      loadingSpareParts: state.loadingSpareParts,
      loadingSparePartsByProyect: state.loadingSparePartsByProyect,
      fetchSpareParts: state.fetchSpareParts,
      fetchSparePartsByProyectId: state.fetchSparePartsByProyectId,
      deleteSparePart: state.deleteSparePart,
      resetFlags: state.resetFlags,
    }),
    shallow,
  );

  useEffect(() => {
    if (scope === 'project') {
      if (!projectId) return;
      void fetchSparePartsByProyectId(projectId, true);
      return;
    }

    void fetchSpareParts(true);
  }, [fetchSpareParts, fetchSparePartsByProyectId, projectId, scope]);

  const dataSource = scope === 'project' ? sparePartsByProyect : spareParts;
  const isLoading =
    scope === 'project' ? loadingSparePartsByProyect : loadingSpareParts;

  const rows = useMemo<RefactionListRow[]>(
    () =>
      dataSource.map((sparePart) => ({
        id: sparePart.id,
        primary: sparePart.name,
        equipment: sparePart.characteristic,
        brand: sparePart.brand,
        model: sparePart.model,
        serialOrPart: sparePart.serialNumber,
        stock: sparePart.stock,
        provider: sparePart.provider,
        status: sparePart.isActive === false ? 'Inactivo' : 'Disponible',
        actions: '',
      })),
    [dataSource],
  );

  const rowsOverride = useMemo<CrudRecord[]>(
    () =>
      rows.map((row) => ({
        id: row.id,
        primary: row.primary,
        secondary: row.equipment,
        tertiary: row.brand,
        status: row.status,
        description: row.equipment,
        stock: String(row.stock),
        model: row.model,
        serialOrPart: row.serialOrPart,
        provider: row.provider,
        website: '',
        phone: '',
      })),
    [rows],
  );

  const crud = useCrudModule(refactionsDefinition, scope, rowsOverride, {
    isResolvingRecord: loadingSpareParts,
  });

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
        key: 'primary',
        label: 'NOMBRE',
        cellClass: 'w-7/12 min-w-0 px-2',
        headerClass: 'w-7/12 min-w-0 px-2',
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

  const handleConfirmDelete = async () => {
    if (!rowPendingDeletion) return;

    crud.hideAlert();
    crud.showSpinner({ message: 'Eliminando refaccion...' });
    const success = await deleteSparePart(rowPendingDeletion.id);

    if (success) {
      if (scope === 'project' && projectId) {
        await fetchSparePartsByProyectId(projectId, true);
      } else {
        await fetchSpareParts(true, true);
      }
    }

    crud.hideSpinner();
    setRowPendingDeletion(null);

    if (!success) {
      crud.showAlert({
        type: 'error',
        variant: 'subtle',
        title: 'No fue posible eliminar la refaccion',
        description:
          useProyectInventoryStore.getState().error ?? 'Ocurrio un error inesperado.',
        showPrimaryButton: false,
        showSecondaryButton: false,
      });
      resetFlags();
      return;
    }

    crud.showAlert({
      type: 'success',
      variant: 'subtle',
      title: 'Refaccion eliminada',
      description: `Se elimino ${rowPendingDeletion.primary} correctamente.`,
      showPrimaryButton: false,
      showSecondaryButton: false,
    });
    resetFlags();
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
        content="Esta acción eliminará la refaccion seleccionada."
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
          showButton={false}
          enableInternalSearch
          rightContent={
            <Button
              variant="solid"
              hideIcon
              size="medium"
              onClick={crud.goCreate}
              data-tour="refactions-crud-list-create"
              className={isMobile ? 'w-full mt-3' : ''}
            >
              Nueva refacción
            </Button>
          }
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
          tables={[
            {
              data: rows,
              columns: isMobile ? columnsMobile : columnsDesktop,
              title: isLoading ? 'Cargando refacciones...' : crud.title,
              enableCollaps: false,
            },
          ]}
        />
      </div>
    </>
  );
};

export default RefactionsList;
