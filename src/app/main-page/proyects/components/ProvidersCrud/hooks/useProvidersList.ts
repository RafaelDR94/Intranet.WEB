'use client';

import { useEffect, useState } from 'react';

import { providersConfig, providersDefinition } from '../../crudDefinitions';
import { useCrudModule } from '../../crudShared';
import type { CrudRecord, CrudScope } from '../../types';
import { useProvidersData } from './useProvidersData';
import { useProyectInventoryStore } from '@/app/stores/useProyectInventoryStore/useProyectInventoryStore';

export const useProvidersList = (scope: CrudScope) => {
  const data = useProvidersData();
  const crud = useCrudModule(providersDefinition, scope, data.rows, {
    isResolvingRecord: data.loading,
  });
  const [rowPendingDeletion, setRowPendingDeletion] = useState<CrudRecord | null>(null);

  useEffect(() => {
    if (!data.error) return;
    crud.hideAlert();
    crud.showAlert({
      type: 'error',
      variant: 'subtle',
      title: 'No fue posible cargar proveedores',
      description: data.error,
      showPrimaryButton: false,
      showSecondaryButton: false,
    });
    data.resetFlags();
  }, [crud, data.error, data.resetFlags]);

  const handleConfirmDelete = async () => {
    if (!rowPendingDeletion) return;
    crud.hideAlert();
    crud.showSpinner({ message: 'Eliminando proveedor...' });

    const success = await data.deleteSupplier(rowPendingDeletion.id);

    crud.hideSpinner();
    setRowPendingDeletion(null);

    if (!success) {
      crud.showAlert({
        type: 'error',
        variant: 'subtle',
        title: 'No fue posible eliminar el proveedor',
        description: useProyectInventoryStore.getState().error ?? 'Ocurrio un error inesperado.',
        showPrimaryButton: false,
        showSecondaryButton: false,
      });
      data.resetFlags();
      return;
    }

    crud.showAlert({
      type: 'success',
      variant: 'subtle',
      title: 'Proveedor eliminado',
      description: `Se elimino ${rowPendingDeletion.primary} correctamente.`,
      showPrimaryButton: false,
      showSecondaryButton: false,
    });
    data.resetFlags();
  };

  return {
    title: crud.title,
    rows: data.rows,
    actionLabel: providersConfig.createLabel,
    popupOpen: Boolean(rowPendingDeletion),
    popupTitle: rowPendingDeletion
      ? `Eliminar ${rowPendingDeletion.primary}`
      : 'Eliminar proveedor',
    popupContent: 'Esta accion eliminara el proveedor seleccionado.',
    onCreate: crud.goCreate,
    onDetail: crud.goEdit,
    onCloseDelete: () => setRowPendingDeletion(null),
    onRequestDelete: setRowPendingDeletion,
    onConfirmDelete: handleConfirmDelete,
    searchableKeys: ['primary', 'secondary', 'tertiary'] as (keyof CrudRecord)[],
  };
};
