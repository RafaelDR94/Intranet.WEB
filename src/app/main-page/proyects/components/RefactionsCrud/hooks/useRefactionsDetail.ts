'use client';

import { useEffect, useMemo } from 'react';

import type { LabelType } from '@/app/components/Label/types';
import useProyectInventoryStore from '@/app/stores/useProyectInventoryStore/useProyectInventoryStore';
import { shallow } from 'zustand/shallow';

import { refactionsDefinition } from '../../crudDefinitions';
import { useCrudModule } from '../../crudShared';
import type { CrudRecord, CrudScope } from '../../types';

const statusToLabelType = (status?: string): LabelType => {
  const normalized = (status ?? '').trim().toLowerCase();

  if (normalized === 'disponible') return 'valido';
  if (normalized === 'en uso') return 'pendiente';
  return 'invalido';
};

export const useRefactionsDetail = (scope: CrudScope) => {
  const { spareParts, suppliers, loadingSpareParts, fetchSpareParts, fetchSuppliers } = useProyectInventoryStore(
    (state) => ({
      spareParts: state.spareParts,
      suppliers: state.suppliers,
      loadingSpareParts: state.loadingSpareParts,
      fetchSpareParts: state.fetchSpareParts,
      fetchSuppliers: state.fetchSuppliers,
    }),
    shallow,
  );

  useEffect(() => {
    void fetchSpareParts(true);
    void fetchSuppliers(true);
  }, [fetchSpareParts, fetchSuppliers]);

  const rowsOverride = useMemo<CrudRecord[]>(
    () =>
      spareParts.map((sparePart) => ({
        id: sparePart.id,
        primary: sparePart.name,
        secondary: sparePart.characteristic,
        tertiary: sparePart.brand,
        status: sparePart.isActive === false ? 'Inactivo' : 'Disponible',
        description: sparePart.characteristic,
        stock: String(sparePart.stock),
        model: sparePart.model,
        serialOrPart: sparePart.serialNumber,
        provider: sparePart.provider,
        website: sparePart.website,
        phone: sparePart.phoneNumber,
      })),
    [spareParts],
  );

  const crud = useCrudModule(refactionsDefinition, scope, rowsOverride, {
    isResolvingRecord: loadingSpareParts,
  });

  const providers = useMemo(() => {
    const currentSparePart = spareParts.find((sparePart) => sparePart.id === crud.currentRecord?.id);
    if (!currentSparePart) return [];

    const supplierIds = currentSparePart.idSuppliers ?? [];

    if (supplierIds.length === 0) return [];

    return supplierIds
      .map((supplierId) => suppliers.find((supplier) => supplier.id === supplierId))
      .filter((supplier): supplier is (typeof suppliers)[number] => Boolean(supplier))
      .map((supplier) => ({
        id: supplier.id,
        name: supplier.nombreProveedor,
        website: supplier.paginaWeb,
        phone: supplier.telefono,
      }));
  }, [crud.currentRecord, spareParts, suppliers]);

  return {
    title: refactionsDefinition.config.detailTitle,
    refaction: crud.currentRecord,
    providers,
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
