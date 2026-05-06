'use client';

import useQuery from '@/app/hooks/useQuery/useQuery';
import type { CrudScope, CrudView } from '../../types';

const normalizeView = (value?: string): CrudView =>
  value === 'form' || value === 'detail' ? value : 'list';

export const useLocationsCrud = (scope: CrudScope) => {
  const { all } = useQuery();

  const rawView = Array.isArray(all.crudView) ? all.crudView[0] : all.crudView;

  return {
    scope,
    crudView: normalizeView(rawView),
  };
};
