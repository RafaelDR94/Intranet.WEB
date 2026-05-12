'use client';

import type { LabelType } from '@/app/components/Label/types';

import { locationsDefinition } from '../../crudDefinitions';
import { useCrudModule } from '../../crudShared';
import type { CrudScope } from '../../types';
import { useLocationsData } from './useLocationsData';

const statusToLabelType = (status?: string): LabelType => {
  const normalized = (status ?? '').trim().toLowerCase();

  if (normalized === 'activa' || normalized === 'disponible') return 'valido';
  return 'actualizado';
};

export const useLocationsDetail = (scope: CrudScope) => {
  const data = useLocationsData(scope);
  const crud = useCrudModule(locationsDefinition, scope, data.rows, {
    isResolvingRecord: data.loading,
  });

  return {
    location: crud.currentRecord,
    statusLabelType: statusToLabelType(crud.currentRecord?.status),
    onClose: crud.goList,
    onEdit: () => {
      if (!crud.currentRecord) return;
      crud.goEdit(crud.currentRecord.id);
    },
  };
};
