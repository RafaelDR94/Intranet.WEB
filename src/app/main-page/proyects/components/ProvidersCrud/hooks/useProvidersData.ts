'use client';

import { useEffect, useMemo } from 'react';
import { shallow } from 'zustand/shallow';

import { useProyectInventoryStore } from '@/app/stores/useProyectInventoryStore/useProyectInventoryStore';
import type { Supplier } from '@/app/mappings/inventory/inventory.types';
import type { CrudRecord } from '../../types';

export const supplierToCrudRecord = (supplier: Supplier): CrudRecord => ({
  id: supplier.id,
  primary: supplier.nombreProveedor,
  secondary: supplier.paginaWeb,
  tertiary: supplier.telefono,
  status: 'Activo',
  description: `Proveedor ${supplier.nombreProveedor}`,
});

export const useProvidersData = () => {
  const {
    suppliers,
    loadingSuppliers,
    creating,
    updating,
    removing,
    error,
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    resetFlags,
  } = useProyectInventoryStore(
    (state) => ({
      suppliers: state.suppliers,
      loadingSuppliers: state.loadingSuppliers,
      creating: state.creating,
      updating: state.updating,
      removing: state.removing,
      error: state.error,
      fetchSuppliers: state.fetchSuppliers,
      createSupplier: state.createSupplier,
      updateSupplier: state.updateSupplier,
      deleteSupplier: state.deleteSupplier,
      resetFlags: state.resetFlags,
    }),
    shallow,
  );

  useEffect(() => {
    void fetchSuppliers();
  }, [fetchSuppliers]);

  const rows = useMemo(() => suppliers.map(supplierToCrudRecord), [suppliers]);

  return {
    rows,
    loading: loadingSuppliers || creating || updating || removing,
    error,
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    resetFlags,
  };
};
