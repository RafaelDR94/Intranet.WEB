'use client';

import { useState } from 'react';

import { locationsConfig, locationsDefinition } from '../../crudDefinitions';
import { useCrudModule } from '../../crudShared';
import type { CrudRecord, CrudScope } from '../../types';

export const useLocationsList = (scope: CrudScope) => {
  const crud = useCrudModule(locationsDefinition, scope);
  const [rowPendingDeletion, setRowPendingDeletion] = useState<CrudRecord | null>(null);

  const handleConfirmDelete = async () => {
    if (!rowPendingDeletion) return;
    crud.hideAlert();
    crud.showSpinner({ message: 'Eliminando ubicacion...' });
    await Promise.resolve();
    crud.hideSpinner();
    setRowPendingDeletion(null);
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
    rows: locationsDefinition.rows,
    actionLabel: locationsConfig.createLabel,
    popupOpen: Boolean(rowPendingDeletion),
    popupTitle: rowPendingDeletion
      ? `Eliminar ${rowPendingDeletion.primary}`
      : 'Eliminar ubicacion',
    popupContent: 'Esta accion solo representa el flujo visual del CRUD compartido.',
    onCreate: crud.goCreate,
    onDetail: crud.goDetail,
    onCloseDelete: () => setRowPendingDeletion(null),
    onRequestDelete: setRowPendingDeletion,
    onConfirmDelete: handleConfirmDelete,
    searchableKeys: ['secondary', 'primary', 'tertiary'] as (keyof CrudRecord)[],
  };
};
