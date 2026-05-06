'use client';

import type { LabelType } from '@/app/components/Label/types';

import { refactionsDefinition } from '../../crudDefinitions';
import { useCrudModule } from '../../crudShared';
import type { CrudScope } from '../../types';

const statusToLabelType = (status?: string): LabelType => {
  const normalized = (status ?? '').trim().toLowerCase();

  if (normalized === 'disponible') return 'valido';
  if (normalized === 'en uso') return 'pendiente';
  return 'invalido';
};

export const useRefactionsDetail = (scope: CrudScope) => {
  const crud = useCrudModule(refactionsDefinition, scope);

  return {
    title: refactionsDefinition.config.detailTitle,
    refaction: crud.currentRecord,
    statusLabelType: statusToLabelType(crud.currentRecord?.status),
    onClose: crud.goList,
    onEditInformation: () => {
      if (!crud.currentRecord) return;
      crud.goEdit(crud.currentRecord.id);
    },
    onEditProviders: () => {
      if (!crud.currentRecord) return;
      crud.updateCrudQuery({
        crudView: 'form',
        crudMode: 'edit',
        crudItemId: crud.currentRecord.id,
        onlyproveedor: 'true',
      });
    },
  };
};
