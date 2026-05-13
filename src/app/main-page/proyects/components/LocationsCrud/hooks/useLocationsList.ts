'use client';

import { useEffect, useState } from 'react';

import { locationsConfig, locationsDefinition } from '../../crudDefinitions';
import { useCrudModule } from '../../crudShared';
import type { CrudRecord, CrudScope } from '../../types';
import { useLocationsData } from './useLocationsData';
import useProyectLocationStore from '@/app/stores/useProyectLocationStore/useProyectLocationStore';

export const useLocationsList = (scope: CrudScope) => {
  const data = useLocationsData(scope);
  const crud = useCrudModule(locationsDefinition, scope, data.rows, {
    isResolvingRecord: data.loading,
  });
  const [rowPendingDeletion, setRowPendingDeletion] = useState<CrudRecord | null>(null);

  useEffect(() => {
    if (!data.error) return;
    crud.hideAlert();
    crud.showAlert({
      type: 'error',
      variant: 'subtle',
      title: 'No fue posible cargar ubicaciones',
      description: data.error,
      showPrimaryButton: false,
      showSecondaryButton: false,
    });
    data.resetFlags();
  }, [crud, data.error, data.resetFlags]);

  const handleConfirmDelete = async () => {
    if (!rowPendingDeletion) return;
    crud.hideAlert();
    crud.showSpinner({ message: 'Eliminando ubicacion...' });

    const success = await data.deleteLocation(rowPendingDeletion.id);

    crud.hideSpinner();
    setRowPendingDeletion(null);

    if (!success) {
      crud.showAlert({
        type: 'error',
        variant: 'subtle',
        title: 'No fue posible eliminar la ubicacion',
        description: useProyectLocationStore.getState().error ?? 'Ocurrio un error inesperado.',
        showPrimaryButton: false,
        showSecondaryButton: false,
      });
      data.resetFlags();
      return;
    }

    crud.showAlert({
      type: 'success',
      variant: 'subtle',
      title: 'Ubicacion eliminada',
      description: `Se elimino ${rowPendingDeletion.primary} correctamente.`,
      showPrimaryButton: false,
      showSecondaryButton: false,
    });
  };

  return {
    title: crud.title,
    rows: data.rows,
    actionLabel: locationsConfig.createLabel,
    popupOpen: Boolean(rowPendingDeletion),
    popupTitle: rowPendingDeletion
      ? `Eliminar ${rowPendingDeletion.primary}`
      : 'Eliminar ubicacion',
    popupContent: 'Esta acción eliminará la ubicación seleccionada.',
    onCreate: crud.goCreate,
    onDetail: crud.goEdit,
    onCloseDelete: () => setRowPendingDeletion(null),
    onRequestDelete: setRowPendingDeletion,
    onConfirmDelete: handleConfirmDelete,
    searchableKeys: ['secondary', 'primary', 'tertiary'] as (keyof CrudRecord)[],
  };
};
