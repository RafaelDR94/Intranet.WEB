'use client';

import { providersDefinition } from '../../crudDefinitions';
import { useCrudModule } from '../../crudShared';
import type { CrudScope } from '../../types';
import { useProvidersData } from './useProvidersData';

export const useProvidersDetail = (scope: CrudScope) => {
  const data = useProvidersData();
  const crud = useCrudModule(providersDefinition, scope, data.rows, {
    isResolvingRecord: data.loading,
  });

  return {
    provider: crud.currentRecord,
    onClose: crud.goList,
    onEdit: () => {
      if (!crud.currentRecord) return;
      crud.goEdit(crud.currentRecord.id);
    },
  };
};
