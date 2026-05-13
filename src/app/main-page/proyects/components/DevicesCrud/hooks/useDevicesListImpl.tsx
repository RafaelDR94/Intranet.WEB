'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import ActionMenuCell from '@/app/components/ActionMenuCell/ActionMenuCell';
import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery';
import type {
  ColumnDefinition,
  DataTableFilterOption,
} from '@/app/components/DataTable/types';
import Label from '@/app/components/Label/Label';

import { devicesConfig, devicesDefinition } from '../../crudDefinitions';
import { useCrudModule } from '../../crudShared';
import type { CrudScope } from '../../types';
import { useDevicesData, type DeviceListType } from './useDevicesData';
import { useProyectInventoryStore } from '@/app/stores/useProyectInventoryStore/useProyectInventoryStore';
import useReportDevicesStore from '@/app/stores/useReportDevicesStore/useReportDevicesStore';

type DeviceListRow = {
  id: string;
  project: string;
  device: string;
  brand: string;
  model: string;
  location: string;
  status: string;
  actions?: string;
};

const DEFAULT_DEVICE_LIST_TYPE: DeviceListType = 'complete';

const DEVICE_TYPE_FILTER_OPTIONS: DataTableFilterOption<DeviceListRow, DeviceListType>[] = [
  {
    label: 'Registro completo',
    value: 'complete',
  },
  {
    label: 'Registro generico',
    value: 'generic',
  },
];

const getSingleValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const normalizeDeviceListType = (value?: string): DeviceListType =>
  value === 'generic' ? 'generic' : DEFAULT_DEVICE_LIST_TYPE;

const statusToLabelType = (status: string) => {
  const normalized = status.trim().toLowerCase();

  if (
    normalized === 'operativo' ||
    normalized === 'disponible' ||
    normalized === 'activo'
  ) {
    return 'valido' as const;
  }
  if (normalized === 'mantenimiento') return 'pendiente' as const;
  if (normalized === 'inactivo') return 'invalido' as const;
  return 'actualizado' as const;
};

export const useDevicesList = (scope: CrudScope) => {
  const data = useDevicesData(scope);
  const crud = useCrudModule(devicesDefinition, scope, data.rows, {
    skipRecordValidation: true,
  });
  const isMobile = useIsMobile();
  const [rowPendingDeletion, setRowPendingDeletion] = useState<DeviceListRow | null>(null);

  const rawType = getSingleValue(crud.all.type);
  const deviceListType = data.effectiveType;

  useEffect(() => {
    if (scope === 'project') {
      if (rawType === DEFAULT_DEVICE_LIST_TYPE) return;
      crud.updateCrudQuery({ type: DEFAULT_DEVICE_LIST_TYPE });
      return;
    }

    if (rawType) return;
    crud.updateCrudQuery({ type: DEFAULT_DEVICE_LIST_TYPE });
  }, [crud, rawType, scope]);

  const rows = useMemo<DeviceListRow[]>(
    () =>
      data.rows.map((row) => ({
        id: row.id,
        project: row.projectCode ?? 'Sin proyecto',
        device: row.primary,
        brand: row.secondary,
        model: row.model || row.description,
        location: row.tertiary,
        status: row.status,
      })),
    [data.rows],
  );

  const handleTypeChange = useCallback(
    (value: string) => {
      if (scope === 'project') return;
      const nextType = normalizeDeviceListType(value);
      crud.updateCrudQuery({ type: nextType });
    },
    [crud, scope],
  );

  const commonActionColumn = useCallback(
    (): ColumnDefinition<DeviceListRow> => ({
      key: 'actions',
      label: '',
      cellClass: 'w-[6%] min-w-0 px-2',
      headerClass: 'w-[6%] min-w-0 px-2',
      render: (row) => (
        <div data-tour="devices-crud-list-row-actions">
          <ActionMenuCell
            row={row}
            editLabel="Ver detalle"
            onDetails={() => crud.goDetail(row.id)}
            onDelete={() => setRowPendingDeletion(row)}
            permissions={{ details: true, delete: true }}
          />
        </div>
      ),
    }),
    [crud],
  );

  const completeColumnsDesktop = useMemo<ColumnDefinition<DeviceListRow>[]>(
    () => [
      {
        key: 'id',
        label: 'ID',
        cellClass: 'w-[7%] min-w-0 px-2',
        headerClass: 'w-[7%] min-w-0 px-2',
      },
      {
        key: 'project',
        label: 'PROYECTO',
        cellClass: 'w-[14%] min-w-0 px-2',
        headerClass: 'w-[14%] min-w-0 px-2',
      },
      {
        key: 'device',
        label: 'EQUIPO',
        cellClass: 'w-[18%] min-w-0 px-2',
        headerClass: 'w-[18%] min-w-0 px-2',
      },
      {
        key: 'brand',
        label: 'MARCA',
        cellClass: 'w-[13%] min-w-0 px-2',
        headerClass: 'w-[13%] min-w-0 px-2',
      },
      {
        key: 'model',
        label: 'MODELO',
        cellClass: 'w-[14%] min-w-0 px-2',
        headerClass: 'w-[14%] min-w-0 px-2',
      },
      {
        key: 'location',
        label: 'UBICACION',
        cellClass: 'w-[16%] min-w-0 px-2',
        headerClass: 'w-[16%] min-w-0 px-2',
      },
      {
        key: 'status',
        label: 'ESTATUS',
        cellClass: 'w-[12%] min-w-0 px-2',
        headerClass: 'w-[12%] min-w-0 px-2',
        render: (row) => <Label type={statusToLabelType(row.status)} text={row.status} />,
      },
      commonActionColumn(),
    ],
    [commonActionColumn],
  );

  const genericColumnsDesktop = useMemo<ColumnDefinition<DeviceListRow>[]>(
    () => [
      {
        key: 'id',
        label: 'ID',
        cellClass: 'w-[10%] min-w-0 px-2',
        headerClass: 'w-[10%] min-w-0 px-2',
      },
      {
        key: 'device',
        label: 'EQUIPO',
        cellClass: 'w-[30%] min-w-0 px-2',
        headerClass: 'w-[30%] min-w-0 px-2',
      },
      {
        key: 'brand',
        label: 'MARCA',
        cellClass: 'w-[24%] min-w-0 px-2',
        headerClass: 'w-[24%] min-w-0 px-2',
      },
      {
        key: 'model',
        label: 'MODELO',
        cellClass: 'w-[28%] min-w-0 px-2',
        headerClass: 'w-[28%] min-w-0 px-2',
      },
      commonActionColumn(),
    ],
    [commonActionColumn],
  );

  const columnsMobile = useMemo<ColumnDefinition<DeviceListRow>[]>(
    () => [
      {
        key: 'device',
        label: 'EQUIPO',
        cellClass: 'w-7/12 min-w-0 px-2',
        headerClass: 'w-7/12 min-w-0 px-2',
      },
      {
        key: 'brand',
        label: 'MARCA',
        cellClass: 'w-[24%] min-w-0 px-2',
        headerClass: 'w-[24%] min-w-0 px-2',
      },
      commonActionColumn(),
    ],
    [commonActionColumn],
  );

  const columns = useMemo(() => {
    if (isMobile) return columnsMobile;
    return deviceListType === 'generic' ? genericColumnsDesktop : completeColumnsDesktop;
  }, [columnsMobile, completeColumnsDesktop, deviceListType, genericColumnsDesktop, isMobile]);

  const handleConfirmDelete = async () => {
    if (!rowPendingDeletion) return;
    crud.hideAlert();
    crud.showSpinner({ message: 'Eliminando dispositivo...' });
    const success =
      deviceListType === 'generic'
        ? await data.deleteGenericEquipment(rowPendingDeletion.id)
        : await data.deleteCompleteDevice(rowPendingDeletion.id);

    if (success) {
      await data.refreshRows();
    }

    crud.hideSpinner();
    setRowPendingDeletion(null);

    if (!success) {
      const description =
        deviceListType === 'generic'
          ? useProyectInventoryStore.getState().error
          : useReportDevicesStore.getState().error;

      crud.showAlert({
        type: 'error',
        variant: 'subtle',
        title: 'No fue posible eliminar el dispositivo',
        description: description ?? 'Ocurrio un error inesperado.',
        showPrimaryButton: false,
        showSecondaryButton: false,
      });

      if (deviceListType === 'generic') {
        data.resetInventoryFlags();
      } else {
        data.resetReportDevicesFlags();
      }
      return;
    }

    crud.showAlert({
      type: 'success',
      variant: 'subtle',
      title: 'Dispositivo eliminado',
      description: `Se elimino ${rowPendingDeletion.device} correctamente.`,
      showPrimaryButton: false,
      showSecondaryButton: false,
    });

    if (deviceListType === 'generic') {
      data.resetInventoryFlags();
    } else {
      data.resetReportDevicesFlags();
    }
  };

  return {
    title: crud.title,
    rows,
    columns,
    searchableKeys:
      deviceListType === 'generic'
        ? (['id', 'device', 'brand', 'model'] as (keyof DeviceListRow)[])
        : (['id', 'project', 'device', 'brand', 'model', 'location', 'status'] as (keyof DeviceListRow)[]),
    actionLabel: devicesConfig.createLabel,
    filterOptions: DEVICE_TYPE_FILTER_OPTIONS,
    filterValue: deviceListType,
    filterTitle: 'Tipo de registro',
    showFilter: data.showTypeFilter,
    onFilterChange: handleTypeChange,
    popupOpen: Boolean(rowPendingDeletion),
    popupTitle: rowPendingDeletion
      ? `Eliminar ${rowPendingDeletion.device}`
      : 'Eliminar dispositivo',
    popupContent: 'Esta acción eliminará el dispositivo seleccionado.',
    onCreate: crud.goCreate,
    onConfirmDelete: handleConfirmDelete,
    onCloseDelete: () => setRowPendingDeletion(null),
  };
};
