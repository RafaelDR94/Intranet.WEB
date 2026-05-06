'use client';

import { useCallback, useEffect, useMemo } from 'react';

import useQuery from '@/app/hooks/useQuery/useQuery';
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';
import type {
  CrudMode,
  CrudModuleDefinition,
  CrudRecord,
  CrudScope,
  CrudView,
} from './types';

const getSingleValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const normalizeView = (value?: string): CrudView =>
  value === 'form' || value === 'detail' ? value : 'list';

const normalizeMode = (value?: string): CrudMode =>
  value === 'edit' ? 'edit' : 'create';

export const useCrudModule = (
  definition: CrudModuleDefinition,
  scope: CrudScope,
  rowsOverride?: CrudRecord[],
  options?: { isResolvingRecord?: boolean; skipRecordValidation?: boolean },
) => {
  const { all, pathname, updateQuery } = useQuery();
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert, hideAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner, withLoading } = usePrincipalLoading;

  const projectId = getSingleValue(all.id);
  const projectLabel = getSingleValue(all.label);
  const crudView = normalizeView(getSingleValue(all.crudView));
  const crudMode = normalizeMode(getSingleValue(all.crudMode));
  const crudItemId = getSingleValue(all.crudItemId);
  const resolvedRows = rowsOverride ?? definition.rows;

  const currentRecord = useMemo<CrudRecord | null>(
    () =>
      resolvedRows.find((row) => String(row.id) === String(crudItemId ?? '')) ?? null,
    [crudItemId, resolvedRows],
  );

  const title =
    scope === 'inventory'
      ? definition.config.inventoryTitle
      : definition.config.projectTitle;

  const updateCrudQuery = useCallback(
    (updates: Record<string, string | null | undefined>) => {
      updateQuery(updates);
    },
    [updateQuery],
  );

  const goList = useCallback(() => {
    updateCrudQuery({
      crudView: null,
      crudMode: null,
      crudItemId: null,
      onlyproveedor: null,
    });
  }, [updateCrudQuery]);

  const goCreate = useCallback(() => {
    updateCrudQuery({
      crudView: 'form',
      crudMode: 'create',
      crudItemId: null,
      onlyproveedor: null,
    });
  }, [updateCrudQuery]);

  const goEdit = useCallback(
    (recordId: string) => {
      updateCrudQuery({
        crudView: 'form',
        crudMode: 'edit',
        crudItemId: recordId,
        onlyproveedor: null,
      });
    },
    [updateCrudQuery],
  );

  const goDetail = useCallback(
    (recordId: string) => {
      updateCrudQuery({
        crudView: 'detail',
        crudMode: null,
        crudItemId: recordId,
        onlyproveedor: null,
      });
    },
    [updateCrudQuery],
  );

  useEffect(() => {
    if (options?.skipRecordValidation) return;
    if (crudView === 'list') return;
    if (!crudItemId && crudView === 'detail') {
      hideAlert();
      showAlert({
        type: 'warning',
        variant: 'subtle',
        title: 'Elemento no seleccionado',
        description: 'No se encontro un registro para mostrar en detalle.',
        showPrimaryButton: false,
        showSecondaryButton: false,
      });
      goList();
      return;
    }

    if (crudItemId && !currentRecord) {
      if (options?.isResolvingRecord) return;
      hideAlert();
      showAlert({
        type: 'warning',
        variant: 'subtle',
        title: 'Registro no encontrado',
        description: 'El elemento solicitado ya no esta disponible.',
        showPrimaryButton: false,
        showSecondaryButton: false,
      });
      goList();
    }
  }, [
    crudItemId,
    crudView,
    currentRecord,
    goList,
    hideAlert,
    options?.isResolvingRecord,
    options?.skipRecordValidation,
    showAlert,
  ]);

  return {
    all,
    pathname,
    updateQuery,
    updateCrudQuery,
    showAlert,
    hideAlert,
    showSpinner,
    hideSpinner,
    withLoading,
    projectId,
    projectLabel,
    crudView,
    crudMode,
    crudItemId,
    currentRecord,
    title,
    scope,
    goList,
    goCreate,
    goEdit,
    goDetail,
  };
};
