'use client';

import { useAuth } from '@/app/context/AuthContext/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';

import type { GenericEquipmentPost, GenericEquipmentPut } from '@/app/mappings/inventory/inventory.types';
import { useProyectInventoryStore } from '@/app/stores/useProyectInventoryStore/useProyectInventoryStore';
import { devicesDefinition } from '../../crudDefinitions';
import { useCrudModule } from '../../crudShared';
import type { CrudScope } from '../../types';
import { useDevicesData } from './useDevicesData';

type DeviceFormType = 'complete' | 'generic';

export type DevicesFormValues = {
  equipmentId: string;
  typeOfEquipment: string;
  brand: string;
  model: string;
  serial: string;
  location: string;
  description: string;
};

const EMPTY_VALUES: DevicesFormValues = {
  equipmentId: '',
  typeOfEquipment: '',
  brand: '',
  model: '',
  serial: '',
  location: '',
  description: '',
};

const getSingleValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const normalizeFormType = (value?: string): DeviceFormType =>
  value === 'generic' ? 'generic' : 'complete';

const sanitize = (value: unknown) => String(value ?? '').trim();

export const useDevicesForm = (scope: CrudScope) => {
  const data = useDevicesData(scope);
  const crud = useCrudModule(devicesDefinition, scope, data.rows, {
    isResolvingRecord: data.isLoading,
  });
  const { user } = useAuth();
  const {
    genericEquipments,
    currentGenericEquipment,
    loading,
    loadingCurrent,
    creating,
    updating,
    error,
    fetchGenericEquipments,
    fetchGenericEquipmentById,
    createGenericEquipment,
    updateGenericEquipment,
    resetFlags,
  } = useProyectInventoryStore(
    (state) => ({
      genericEquipments: state.genericEquipments,
      currentGenericEquipment: state.currentGenericEquipment,
      loading: state.loading,
      loadingCurrent: state.loadingCurrent,
      creating: state.creating,
      updating: state.updating,
      error: state.error,
      fetchGenericEquipments: state.fetchGenericEquipments,
      fetchGenericEquipmentById: state.fetchGenericEquipmentById,
      createGenericEquipment: state.createGenericEquipment,
      updateGenericEquipment: state.updateGenericEquipment,
      resetFlags: state.resetFlags,
    }),
    shallow,
  );

  const formType =
    scope === 'project' ? 'complete' : normalizeFormType(getSingleValue(crud.all.type));
  const [values, setValues] = useState<DevicesFormValues>(EMPTY_VALUES);
  const [showErrors, setShowErrors] = useState(false);

  const equipmentOptions = useMemo(
    () =>
      genericEquipments
        .filter((equipment) => equipment.isActive !== false)
        .map((equipment) => ({
          value: equipment.id,
          label: equipment.typeOfEquipment,
        })),
    [genericEquipments],
  );

  const title = useMemo(() => {
    if (formType === 'generic') {
      return crud.crudMode === 'edit'
        ? 'Actualizar equipo genérico'
        : 'Nuevo equipo genérico';
    }

    return crud.crudMode === 'edit'
      ? devicesDefinition.config.updateLabel
      : devicesDefinition.config.createLabel;
  }, [crud.crudMode, formType]);

  const primaryLabel = title;

  useEffect(() => {
    void fetchGenericEquipments();
  }, [fetchGenericEquipments]);

  useEffect(() => {
    if (formType !== 'generic' || crud.crudMode !== 'edit' || !crud.crudItemId) return;
    if (currentGenericEquipment?.id === crud.crudItemId) return;
    void fetchGenericEquipmentById(crud.crudItemId, true);
  }, [
    crud.crudItemId,
    crud.crudMode,
    currentGenericEquipment?.id,
    fetchGenericEquipmentById,
    formType,
  ]);

  useEffect(() => {
    if (error) {
      crud.hideAlert();
      crud.showAlert({
        type: 'error',
        variant: 'subtle',
        title: 'No fue posible cargar la información del formulario',
        description: error,
        showPrimaryButton: false,
        showSecondaryButton: false,
      });
      resetFlags();
    }
  }, [crud, error, resetFlags]);

  useEffect(() => {
    setShowErrors(false);

    if (formType === 'generic') {
      if (
        crud.crudMode === 'edit' &&
        currentGenericEquipment &&
        currentGenericEquipment.id === crud.crudItemId
      ) {
        setValues({
          equipmentId: currentGenericEquipment.id,
          typeOfEquipment: currentGenericEquipment.typeOfEquipment,
          brand: currentGenericEquipment.brand,
          model: currentGenericEquipment.model,
          serial: '',
          location: '',
          description: '',
        });
        return;
      }

      setValues({
        ...EMPTY_VALUES,
        typeOfEquipment: crud.currentRecord?.primary ?? '',
        brand:
          crud.currentRecord?.secondary && crud.currentRecord.secondary !== crud.currentRecord.tertiary
            ? crud.currentRecord.secondary
            : '',
      });
      return;
    }

    const matchedEquipment = genericEquipments.find(
      (equipment) => equipment.typeOfEquipment === (crud.currentRecord?.primary ?? ''),
    );

    setValues({
      equipmentId: matchedEquipment?.id ?? '',
      typeOfEquipment: matchedEquipment?.typeOfEquipment ?? crud.currentRecord?.primary ?? '',
      brand: matchedEquipment?.brand ?? '',
      model: matchedEquipment?.model ?? '',
      serial: crud.currentRecord?.secondary ?? '',
      location: crud.currentRecord?.tertiary ?? '',
      description: crud.currentRecord?.description ?? '',
    });
  }, [crud.crudMode, crud.currentRecord, currentGenericEquipment, formType, genericEquipments]);

  const completeDisabled =
    equipmentOptions.length === 0 || loading || loadingCurrent || creating || updating;

  const canSubmit = useMemo(() => {
    if (formType === 'generic') {
      return (
        sanitize(values.typeOfEquipment).length > 0 &&
        sanitize(values.brand).length > 0 &&
        sanitize(values.model).length > 0
      );
    }

    return (
      sanitize(values.equipmentId).length > 0 &&
      sanitize(values.brand).length > 0 &&
      sanitize(values.model).length > 0 &&
      sanitize(values.serial).length > 0 &&
      sanitize(values.location).length > 0 &&
      sanitize(values.description).length > 0
    );
  }, [formType, values]);

  const updateValue = (name: keyof DevicesFormValues, value: string) => {
    setValues((current) => {
      if (name !== 'equipmentId') {
        return {
          ...current,
          [name]: value,
        };
      }

      const equipment = genericEquipments.find((item) => item.id === value);

      return {
        ...current,
        equipmentId: value,
        typeOfEquipment: equipment?.typeOfEquipment ?? '',
        brand: equipment?.brand ?? '',
        model: equipment?.model ?? '',
      };
    });
  };

  const handleSubmit = async () => {
    setShowErrors(true);
    if (!canSubmit) return;

    crud.hideAlert();

    if (formType === 'generic') {
      const payloadBase: GenericEquipmentPost = {
        typeOfEquipment: sanitize(values.typeOfEquipment),
        brand: sanitize(values.brand),
        model: sanitize(values.model),
      };

      crud.showSpinner({
        message:
          crud.crudMode === 'edit'
            ? 'Actualizando equipo genérico...'
            : 'Registrando equipo genérico...',
      });

      let result = null;

      if (crud.crudMode === 'edit' && crud.crudItemId) {
        const createdBy =
          user?.userName?.trim() || user?.fullName?.trim() || user?.email?.trim() || 'sistema';

        result = await updateGenericEquipment({
          ...payloadBase,
          id: crud.crudItemId,
          createdBy,
        } as GenericEquipmentPut);
      } else {
        result = await createGenericEquipment(payloadBase);
      }

      crud.hideSpinner();

      if (!result) {
        crud.showAlert({
          type: 'error',
          variant: 'subtle',
          title: 'No fue posible guardar el equipo genérico',
          description:
            useProyectInventoryStore.getState().error ??
            'Ocurrió un error al guardar la información.',
          showPrimaryButton: false,
          showSecondaryButton: false,
        });
        resetFlags();
        return;
      }

      crud.showAlert({
        type: 'success',
        variant: 'subtle',
        title:
          crud.crudMode === 'edit'
            ? 'Equipo genérico actualizado'
            : 'Equipo genérico registrado',
        description: 'La información se guardó correctamente.',
        showPrimaryButton: false,
        showSecondaryButton: false,
      });
      resetFlags();
      crud.goList();
      return;
    }

    crud.showSpinner({
      message:
        crud.crudMode === 'edit'
          ? 'Actualizando dispositivo...'
          : 'Registrando dispositivo...',
    });

    await Promise.resolve();

    crud.hideSpinner();
    crud.showAlert({
      type: 'success',
      variant: 'subtle',
      title: crud.crudMode === 'edit' ? 'Dispositivo actualizado' : 'Dispositivo registrado',
      description: 'La acción fue ejecutada como parte de la infraestructura base del CRUD.',
      showPrimaryButton: false,
      showSecondaryButton: false,
    });
    crud.goList();
  };

  return {
    formType,
    title,
    primaryLabel,
    values,
    equipmentOptions,
    loadingFormInfo: loading || (formType === 'generic' && crud.crudMode === 'edit' && loadingCurrent),
    submitting: creating || updating,
    completeDisabled,
    showErrors,
    canSubmit,
    onCancel: crud.goList,
    onSubmit: handleSubmit,
    onChange: updateValue,
  };
};
