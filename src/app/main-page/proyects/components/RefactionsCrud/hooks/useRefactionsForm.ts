'use client';

import { useEffect, useMemo } from 'react';


import { shallow } from 'zustand/shallow';

import type { FieldModel } from '@/app/components/DynamicForm/types';
import useProyectInventoryStore from '@/app/stores/useProyectInventoryStore/useProyectInventoryStore';

import { refactionsDefinition } from '../../crudDefinitions';
import { useCrudModule } from '../../crudShared';
import type { CrudRecord, CrudScope } from '../../types';

const getSingleValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const PROVIDER_FIELD_NAMES = new Set(['provider', 'website', 'phone']);

export type RefactionProviderFormValue = {
  id: string;
  supplierId: string;
  provider: string;
  website: string;
  phone: string;
};

export type RefactionEquipmentFormValue = {
  id: string;
  equipmentId: string;
  brand: string;
  model: string;
};

const DEFAULT_EQUIPMENT_ROW: RefactionEquipmentFormValue = {
  id: 'equipment-1',
  equipmentId: '',
  brand: '',
  model: '',
};

export const useRefactionsForm = (scope: CrudScope) => {
  const {
    spareParts,
    loadingSpareParts,
    fetchSpareParts,
    genericEquipments,
    fetchGenericEquipments,
    fetchGenericEquipmentsByProyectId,
    suppliers,
    fetchSuppliers,
    createSparePart,
    updateSparePart,
    creating,
    updating,
    error,
    resetFlags,
  } = useProyectInventoryStore(
    (state) => ({
      spareParts: state.spareParts,
      loadingSpareParts: state.loadingSpareParts,
      fetchSpareParts: state.fetchSpareParts,
      genericEquipments: state.genericEquipments,
      fetchGenericEquipments: state.fetchGenericEquipments,
      fetchGenericEquipmentsByProyectId: state.fetchGenericEquipmentsByProyectId,
      suppliers: state.suppliers,
      fetchSuppliers: state.fetchSuppliers,
      createSparePart: state.createSparePart,
      updateSparePart: state.updateSparePart,
      creating: state.creating,
      updating: state.updating,
      error: state.error,
      resetFlags: state.resetFlags,
    }),
    shallow,
  );

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
  const projectIdFromQuery = useMemo(
    () =>
      String(
        getSingleValue(crud.all.id) ??
          getSingleValue(crud.all.idProyect) ??
          getSingleValue(crud.all.idproyect) ??
          getSingleValue(crud.all.projectId) ??
          getSingleValue(crud.all.proyectId) ??
          '',
      ).trim(),
    [crud.all.id, crud.all.idProyect, crud.all.idproyect, crud.all.projectId, crud.all.proyectId],
  );

  useEffect(() => {
    void fetchSpareParts(true);

    if (projectIdFromQuery) {
      void fetchGenericEquipmentsByProyectId(projectIdFromQuery, true);
    } else {
      void fetchGenericEquipments();
    }

    void fetchSuppliers();
  }, [
    fetchGenericEquipments,
    fetchGenericEquipmentsByProyectId,
    fetchSpareParts,
    fetchSuppliers,
    projectIdFromQuery,
  ]);
  const onlyProveedor = getSingleValue(crud.all.onlyproveedor) === 'true';

  const initialProviders = useMemo<RefactionProviderFormValue[]>(
    () => {
      const currentSparePart = spareParts.find((sparePart) => sparePart.id === crud.currentRecord?.id);

      const embeddedSuppliers = currentSparePart?.suppliers ?? [];
      if (embeddedSuppliers.length > 0) {
        return embeddedSuppliers.map((supplier, index) => ({
          id: `provider-${index + 1}`,
          supplierId: supplier.id,
          provider: supplier.nombreProveedor,
          website: supplier.paginaWeb,
          phone: supplier.telefono,
        }));
      }

      const supplierIds = currentSparePart?.idSuppliers ?? [];
      const providersFromIds = supplierIds
        .map((supplierId, index) => {
          const supplier = suppliers.find((item) => item.id === supplierId);
          if (!supplier) return null;

          return {
            id: `provider-${index + 1}`,
            supplierId: supplier.id,
            provider: supplier.nombreProveedor,
            website: supplier.paginaWeb,
            phone: supplier.telefono,
          };
        })
        .filter((provider): provider is RefactionProviderFormValue => Boolean(provider));

      if (providersFromIds.length > 0) return providersFromIds;

      return [
        {
          id: 'provider-1',
          supplierId:
            suppliers.find((supplier) => supplier.nombreProveedor === (crud.currentRecord?.provider ?? ''))
              ?.id ?? '',
          provider: crud.currentRecord?.provider ?? '',
          website: crud.currentRecord?.website ?? '',
          phone: crud.currentRecord?.phone ?? '',
        },
      ];
    },
    [
      crud.currentRecord?.id,
      crud.currentRecord?.phone,
      crud.currentRecord?.provider,
      crud.currentRecord?.website,
      spareParts,
      suppliers,
    ],
  );

  const initialEquipments = useMemo<RefactionEquipmentFormValue[]>(() => {
    const currentSparePart = spareParts.find((sparePart) => sparePart.id === crud.currentRecord?.id);
    const embeddedEquipments = currentSparePart?.genericEquipments ?? [];

    if (embeddedEquipments.length > 0) {
      return embeddedEquipments.map((equipment, index) => ({
        id: `equipment-${index + 1}`,
        equipmentId: equipment.id,
        brand: equipment.brand,
        model: equipment.model,
      }));
    }

    const equipmentIds = currentSparePart?.idGenericEquipments ?? [];
    const equipmentsFromIds = equipmentIds
      .map((equipmentId, index) => {
        const equipment = genericEquipments.find((item) => item.id === equipmentId);
        if (!equipment) return null;

        return {
          id: `equipment-${index + 1}`,
          equipmentId: equipment.id,
          brand: equipment.brand,
          model: equipment.model,
        };
      })
      .filter((equipment): equipment is RefactionEquipmentFormValue => Boolean(equipment));

    if (equipmentsFromIds.length > 0) return equipmentsFromIds;

    return [DEFAULT_EQUIPMENT_ROW];
  }, [crud.currentRecord?.id, genericEquipments, spareParts]);

  const fields: FieldModel[] = refactionsDefinition
    .fields(scope, crud.crudMode, crud.currentRecord)
    .filter((field) => !PROVIDER_FIELD_NAMES.has(field.name))
    .map((field) => {
      const isProviderField = PROVIDER_FIELD_NAMES.has(field.name);
      const disabled = onlyProveedor ? !isProviderField : field.disabled;


      return {
        ...field,
        disabled,
        rows: field.name === 'description' ? 1 : field.rows,
        helperClassName: 'hidden',

      };
    });

  const title =
    crud.crudMode === 'edit'
      ? 'Detalle refaccion'
      : refactionsDefinition.config.createLabel;

  const handleSubmit = async (
    values: Record<string, unknown>,
    providers: RefactionProviderFormValue[],
    equipments: RefactionEquipmentFormValue[],
  ) => {
    const selectedEquipmentIds = equipments
      .map((equipment) => equipment.equipmentId.trim())
      .filter(
        (equipmentId, index, array) =>
          equipmentId.length > 0 && array.indexOf(equipmentId) === index,
      );

    if (selectedEquipmentIds.length === 0) {
      crud.showAlert({
        type: 'warning',
        variant: 'subtle',
        title: 'Equipo requerido',
        description: 'Selecciona al menos un equipo relacionado para guardar la refaccion.',
        showPrimaryButton: false,
        showSecondaryButton: false,
      });
      return;
    }

    const selectedSupplierIds = providers
      .map((provider) => provider.supplierId.trim())
      .filter((supplierId, index, array) => supplierId.length > 0 && array.indexOf(supplierId) === index);
    const supplierInfo = suppliers.find((supplier) => supplier.id === selectedSupplierIds[0]);
    const sku = String(values.sku ?? crud.currentRecord?.id ?? '').trim();
    const stock = Number(values.stock ?? crud.currentRecord?.stock ?? 0);
    const name = String(values.name ?? crud.currentRecord?.primary ?? '').trim();
    const brand = String(values.brand ?? crud.currentRecord?.tertiary ?? '').trim();
    const model = String(values.model ?? crud.currentRecord?.model ?? '').trim();
    const serialNumber = String(values.serialOrPart ?? crud.currentRecord?.serialOrPart ?? '').trim();
    const description = String(values.description ?? crud.currentRecord?.description ?? '').trim();
    const characteristic = description;
    const website = supplierInfo?.paginaWeb ?? providers[0]?.website ?? '';
    const phoneNumber = supplierInfo?.telefono ?? providers[0]?.phone ?? '';

    crud.hideAlert();
    crud.showSpinner({
      message:
        crud.crudMode === 'edit'
          ? 'Actualizando refaccion...'
          : 'Registrando refaccion...',
    });

    const saved =
      crud.crudMode === 'edit' && crud.currentRecord
        ? await updateSparePart({
            id: crud.currentRecord.id,
            sku,
            stock: Number.isFinite(stock) ? stock : 0,
            name,
            brand,
            model,
            serialNumber,
            characteristic,
            website,
            phoneNumber,
            idSuppliers: selectedSupplierIds,
            idGenericEquipments: selectedEquipmentIds,
          })
        : await createSparePart({
            sku,
            stock: Number.isFinite(stock) ? stock : 0,
            name,
            brand,
            model,
            serialNumber,
            characteristic,
            website,
            phoneNumber,
            idSuppliers: selectedSupplierIds,
            idGenericEquipments: selectedEquipmentIds,
          });

    crud.hideSpinner();

    if (!saved) {
      crud.showAlert({
        type: 'error',
        variant: 'subtle',
        title:
          crud.crudMode === 'edit'
            ? 'No fue posible actualizar la refaccion'
            : 'No fue posible registrar la refaccion',
        description: error ?? 'Ocurrio un error al guardar la refaccion.',
        showPrimaryButton: false,
        showSecondaryButton: false,
      });
      return;
    }

    crud.showAlert({
      type: 'success',
      variant: 'subtle',
      title: crud.crudMode === 'edit' ? 'Refaccion actualizada' : 'Refaccion registrada',
      description:
        crud.crudMode === 'edit'
          ? 'La refaccion se actualizo correctamente.'
          : 'La refaccion se registro correctamente.',
      showPrimaryButton: false,
      showSecondaryButton: false,
    });
    await fetchSpareParts(true, true);
    resetFlags();
    crud.goList();
  };

  return {
    title,
    primaryLabel: 'Guardar Información',
    fields,
    initialProviders,
    initialEquipments,
    suppliers,
    genericEquipments,
    onlyProveedor,
    loading: creating || updating,
    loadingFormInfo: loadingSpareParts,
    responsiveLayout: refactionsDefinition.responsiveLayout,
    onSubmit: handleSubmit,
    onCancel: crud.goList,
    dataTestId: 'refactions-crud-form',
    mergeChildrenInSingleCard: true,

  };
};
