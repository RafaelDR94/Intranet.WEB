'use client';

import { useAuth } from '@/app/context/AuthContext/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';

import type { GenericEquipmentPost, GenericEquipmentPut } from '@/app/mappings/inventory/inventory.types';
import { useProyectInventoryStore } from '@/app/stores/useProyectInventoryStore/useProyectInventoryStore';
import useProyectLocationStore from '@/app/stores/useProyectLocationStore/useProyectLocationStore';
import { useReportDevicesStore } from '@/app/stores/useReportDevicesStore/useReportDevicesStore';
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
  status: string;
  description: string;
};

export type AssignedRefactionRow = {
  sparePartId: string;
  sku: string;
  name: string;
  brand: string;
  model: string;
};

type NewRefactionFormValues = {
  sku: string;
  stock: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  status: string;
  characteristic: string;
  provider: string;
  website: string;
  phoneNumber: string;
};

const EMPTY_VALUES: DevicesFormValues = {
  equipmentId: '',
  typeOfEquipment: '',
  brand: '',
  model: '',
  serial: '',
  location: '',
  status: '',
  description: '',
};

const getSingleValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const normalizeFormType = (value?: string): DeviceFormType =>
  value === 'generic' ? 'generic' : 'complete';

const sanitize = (value: unknown) => String(value ?? '').trim();
const normalizeCompleteStatusToOption = (value?: string) => {
  const normalized = sanitize(value).toLowerCase();
  if (normalized === 'activo') return 'Operativo';
  if (normalized === 'inactivo') return 'Inactivo';
  return sanitize(value);
};
const EMPTY_REFACTION_FORM: NewRefactionFormValues = {
  sku: '',
  stock: '0',
  name: '',
  brand: '',
  model: '',
  serialNumber: '',
  status: '',
  characteristic: '',
  provider: '',
  website: '',
  phoneNumber: '',
};

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
    fetchSpareParts,
    fetchSparePartsByGenericEquipmentId,
    sparePartsByGenericEquipment,
    fetchGenericEquipmentSpareParts,
    createGenericEquipmentSparePart,
    updateGenericEquipmentSparePart,
    createSparePart,
    spareParts,
    genericEquipmentSpareParts,
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
      fetchSpareParts: state.fetchSpareParts,
      fetchSparePartsByGenericEquipmentId: state.fetchSparePartsByGenericEquipmentId,
      sparePartsByGenericEquipment: state.sparePartsByGenericEquipment,
      fetchGenericEquipmentSpareParts: state.fetchGenericEquipmentSpareParts,
      createGenericEquipmentSparePart: state.createGenericEquipmentSparePart,
      updateGenericEquipmentSparePart: state.updateGenericEquipmentSparePart,
      createSparePart: state.createSparePart,
      spareParts: state.spareParts,
      genericEquipmentSpareParts: state.genericEquipmentSpareParts,
      resetFlags: state.resetFlags,
    }),
    shallow,
  );

  const { locations, fetchLocations, fetchAllLocations } = useProyectLocationStore(
    (state) => ({
      locations: state.locations,
      fetchLocations: state.fetchLocations,
      fetchAllLocations: state.fetchAllLocations,
    }),
    shallow,
  );

  const {
    createDeviceExternal,
    updateDeviceExternal,
    creatingDeviceExternal,
    updatingDeviceExternal,
    deviceExternalError,
  } = useReportDevicesStore(
    (state) => ({
      createDeviceExternal: state.createDevice,
      updateDeviceExternal: state.updateDevice,
      creatingDeviceExternal: state.creating,
      updatingDeviceExternal: state.updating,
      deviceExternalError: state.error,
    }),
    shallow,
  );

  const formType =
    scope === 'project' ? 'complete' : normalizeFormType(getSingleValue(crud.all.type));
  const resolvedProjectId = useMemo(
    () =>
      sanitize(
        getSingleValue(crud.all.id) ??
          getSingleValue(crud.all.idProyect) ??
          getSingleValue(crud.all.idproyect) ??
          getSingleValue(crud.all.projectId) ??
          getSingleValue(crud.all.proyectId) ??
          '',
      ),
    [crud.all.id, crud.all.idProyect, crud.all.idproyect, crud.all.projectId, crud.all.proyectId],
  );
  const [values, setValues] = useState<DevicesFormValues>(EMPTY_VALUES);
  const [showErrors, setShowErrors] = useState(false);
  const [selectedDraftRefactionIds, setSelectedDraftRefactionIds] = useState<string[]>([]);
  const [assignedRefactionIds, setAssignedRefactionIds] = useState<string[]>([]);
  const [showAddRefactionForm, setShowAddRefactionForm] = useState(false);
  const [newRefactionValues, setNewRefactionValues] =
    useState<NewRefactionFormValues>(EMPTY_REFACTION_FORM);
  const resolvedProjectIdFromLocation = useMemo(() => {
    if (!values.location) return '';
    const selectedLocation = locations.find((location) => location.id === values.location);
    const projectRef = Array.isArray(selectedLocation?.proyect)
      ? selectedLocation?.proyect?.[0]
      : undefined;
    return sanitize((projectRef as { id?: string } | undefined)?.id ?? '');
  }, [locations, values.location]);

  const equipmentOptions = useMemo(
    () =>
      genericEquipments
        .filter((equipment) => equipment.isActive !== false)
        .map((equipment) => ({
          value: equipment.id,
          label:
            equipment.typeOfEquipment?.trim() ||
            [equipment.brand?.trim(), equipment.model?.trim()].filter(Boolean).join(' ') ||
            equipment.id,
        })),
    [genericEquipments],
  );

  const locationOptions = useMemo(
    () =>
      locations.map((location) => ({
        label: location.name,
        value: location.id,
      })),
    [locations],
  );

  const statusOptions = useMemo(
    () => [
      { label: 'Operativo', value: 'Operativo' },
      { label: 'Disponible', value: 'Disponible' },
      { label: 'Mantenimiento', value: 'Mantenimiento' },
      { label: 'En uso', value: 'En uso' },
      { label: 'Inactivo', value: 'Inactivo' },
    ],
    [],
  );

  const title = useMemo(() => {
    if (formType === 'generic') {
      return crud.crudMode === 'edit' ? 'Actualizar equipo genÃ©rico' : 'Nuevo equipo genÃ©rico';
    }

    return crud.crudMode === 'edit'
      ? devicesDefinition.config.updateLabel
      : devicesDefinition.config.createLabel;
  }, [crud.crudMode, formType]);

  const primaryLabel = title;

  useEffect(() => {
    void fetchGenericEquipments(formType === 'complete');

    if (formType === 'generic') {
      void fetchSpareParts(true);
      void fetchGenericEquipmentSpareParts(true, true);
    }

    if (formType === 'complete' && resolvedProjectId) {
      void fetchLocations(resolvedProjectId, true);
    } else if (formType === 'complete') {
      void fetchAllLocations(true);
    }
  }, [
    fetchAllLocations,
    fetchGenericEquipments,
    fetchGenericEquipmentSpareParts,
    fetchLocations,
    fetchSpareParts,
    formType,
    resolvedProjectId,
  ]);

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
    if (formType !== 'generic' || crud.crudMode !== 'edit' || !crud.crudItemId) return;
    void fetchSparePartsByGenericEquipmentId(crud.crudItemId, true);
  }, [crud.crudItemId, crud.crudMode, fetchSparePartsByGenericEquipmentId, formType]);

  useEffect(() => {
    if (!error) return;

    crud.hideAlert();
    crud.showAlert({
      type: 'error',
      variant: 'subtle',
      title: 'No fue posible cargar la informaciÃ³n del formulario',
      description: error,
      showPrimaryButton: false,
      showSecondaryButton: false,
    });
    resetFlags();
  }, [crud, error, resetFlags]);

  useEffect(() => {
    setShowErrors(false);
    setSelectedDraftRefactionIds([]);

    if (formType === 'generic') {
      if (
        crud.crudMode === 'edit' &&
        currentGenericEquipment &&
        currentGenericEquipment.id === crud.crudItemId
      ) {
        const assignedFromStore = genericEquipmentSpareParts
          .filter((item) => item.idGenericEquipment === currentGenericEquipment.id)
          .map((item) => item.idSparePart);
        const assignedFromDevice = sparePartsByGenericEquipment.map((item) => item.id);
        const assignedIds =
          assignedFromDevice.length > 0 ? assignedFromDevice : assignedFromStore;

        const normalizedAssignedIds = Array.from(new Set(assignedIds));
        setAssignedRefactionIds(normalizedAssignedIds);
        setSelectedDraftRefactionIds(normalizedAssignedIds);

        setValues({
          equipmentId: currentGenericEquipment.id,
          typeOfEquipment: currentGenericEquipment.typeOfEquipment,
          brand: currentGenericEquipment.brand,
          model: currentGenericEquipment.model,
          serial: '',
          location: '',
          status: '',
          description: '',
        });
        return;
      }

      setAssignedRefactionIds([]);
      setSelectedDraftRefactionIds([]);
      setValues({
        ...EMPTY_VALUES,
        typeOfEquipment: crud.currentRecord?.primary ?? '',
        brand:
          crud.currentRecord?.secondary && crud.currentRecord.secondary !== crud.currentRecord.tertiary
            ? crud.currentRecord.secondary
            : '',
      });
      setShowAddRefactionForm(false);
      setNewRefactionValues(EMPTY_REFACTION_FORM);
      return;
    }

    setAssignedRefactionIds([]);
    setSelectedDraftRefactionIds([]);

    if (crud.crudMode === 'create') {
      setValues(EMPTY_VALUES);
      return;
    }

    const matchedEquipment = genericEquipments.find(
      (equipment) =>
        equipment.id === crud.currentRecord?.idGenericEquipment ||
        equipment.typeOfEquipment === (crud.currentRecord?.primary ?? ''),
    );
    const matchedLocation = locations.find(
      (location) =>
        location.id === crud.currentRecord?.idLocation ||
        location.name === (crud.currentRecord?.tertiary ?? ''),
    );

    setValues({
      equipmentId: matchedEquipment?.id ?? '',
      typeOfEquipment: matchedEquipment?.typeOfEquipment ?? crud.currentRecord?.primary ?? '',
      brand: matchedEquipment?.brand ?? '',
      model: matchedEquipment?.model ?? '',
      serial: crud.currentRecord?.serialOrPart ?? '',
      location: matchedLocation?.id ?? '',
      status: normalizeCompleteStatusToOption(crud.currentRecord?.status),
      description: crud.currentRecord?.description ?? '',
    });
  }, [
    crud.crudMode,
    crud.crudItemId,
    crud.currentRecord,
    currentGenericEquipment,
    formType,
    genericEquipments,
    genericEquipmentSpareParts,
    locations,
    sparePartsByGenericEquipment,
  ]);

  const refactionOptions = useMemo(
    () =>
      spareParts
        .filter((item) => item.isActive !== false)
        .map((item) => ({
          value: item.id,
          label: `${item.sku} ${item.name}`.trim(),
        })),
    [spareParts],
  );

  const assignedRefactions = useMemo<AssignedRefactionRow[]>(
    () =>
      assignedRefactionIds
        .map((sparePartId) => {
          const part = spareParts.find((item) => item.id === sparePartId);
          if (!part) return null;

          return {
            sparePartId,
            sku: part.sku,
            name: part.name,
            brand: part.brand,
            model: part.model,
          };
        })
        .filter((item): item is AssignedRefactionRow => item !== null),
    [assignedRefactionIds, spareParts],
  );

  const completeDisabled =
    equipmentOptions.length === 0 ||
    loading ||
    loadingCurrent ||
    creating ||
    updating ||
    creatingDeviceExternal ||
    updatingDeviceExternal;

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
      sanitize(values.status).length > 0 &&
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
        name: sanitize(values.typeOfEquipment),
        brand: sanitize(values.brand),
        model: sanitize(values.model),
      };

      crud.showSpinner({
        message:
          crud.crudMode === 'edit'
            ? 'Actualizando equipo genÃ©rico...'
            : 'Registrando equipo genÃ©rico...',
      });

      let result = null;
      const previousAssignedIds =
        crud.crudMode === 'edit' && (currentGenericEquipment?.id || crud.crudItemId)
          ? genericEquipmentSpareParts
              .filter(
                (item) =>
                  item.idGenericEquipment === (currentGenericEquipment?.id ?? crud.crudItemId ?? ''),
              )
              .map((item) => item.idSparePart)
          : [];

      if (crud.crudMode === 'edit' && crud.crudItemId) {
        const createdBy =
          user?.userName?.trim() || user?.fullName?.trim() || user?.email?.trim() || 'sistema';

        result = await updateGenericEquipment({
          name: sanitize(values.typeOfEquipment),
          brand: sanitize(values.brand),
          model: sanitize(values.model),
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
          title: 'No fue posible guardar el equipo genÃ©rico',
          description:
            useProyectInventoryStore.getState().error ??
            'OcurriÃ³ un error al guardar la informaciÃ³n.',
          showPrimaryButton: false,
          showSecondaryButton: false,
        });
        resetFlags();
        return;
      }

      const genericEquipmentId =
        crud.crudMode === 'edit'
          ? sanitize(currentGenericEquipment?.id ?? crud.crudItemId ?? result.id)
          : sanitize(result.id);

      if (!genericEquipmentId) {
        crud.showAlert({
          type: 'error',
          variant: 'subtle',
          title: 'No fue posible actualizar las refacciones',
          description: 'No se obtuvo el identificador del equipo genÃ©rico.',
          showPrimaryButton: false,
          showSecondaryButton: false,
        });
        resetFlags();
        return;
      }

      if (crud.crudMode !== 'edit' && assignedRefactionIds.length > 0) {
        const relationCreated = await createGenericEquipmentSparePart({
          idGenericEquipment: genericEquipmentId,
          idSparePart: assignedRefactionIds,
        });

        if (!relationCreated) {
          crud.showAlert({
            type: 'error',
            variant: 'subtle',
            title: 'Equipo guardado con refacciones pendientes',
            description:
              useProyectInventoryStore.getState().error ??
              'Se registrÃ³ el equipo, pero no fue posible asociar las refacciones.',
            showPrimaryButton: false,
            showSecondaryButton: false,
          });
          resetFlags();
          return;
        }
      }

      const previousSet = new Set(previousAssignedIds);

      const idsToCreate = assignedRefactionIds.filter((id) => !previousSet.has(id));

      if (crud.crudMode === 'edit') {
        const relationSeedId =
          genericEquipmentSpareParts.find((item) => item.idGenericEquipment === genericEquipmentId)
            ?.id ?? genericEquipmentId;
        const relationUpdated = await updateGenericEquipmentSparePart({
          id: relationSeedId,
          idGenericEquipment: genericEquipmentId,
          idSparePart: assignedRefactionIds,
        });

        if (!relationUpdated && assignedRefactionIds.length > 0) {
          crud.showAlert({
            type: 'error',
            variant: 'subtle',
            title: 'No fue posible actualizar las refacciones',
            description:
              useProyectInventoryStore.getState().error ??
              'FallÃ³ la actualizaciÃ³n de relaciones de refacciones.',
            showPrimaryButton: false,
            showSecondaryButton: false,
          });
          resetFlags();
          return;
        }

        if (idsToCreate.length > 0) {
          const relationCreated = await createGenericEquipmentSparePart({
            idGenericEquipment: genericEquipmentId,
            idSparePart: idsToCreate,
          });

          if (!relationCreated) {
            crud.showAlert({
              type: 'error',
              variant: 'subtle',
              title: 'No fue posible actualizar las refacciones',
              description:
                useProyectInventoryStore.getState().error ??
                'Se guardÃ³ el equipo, pero fallÃ³ la actualizaciÃ³n de refacciones.',
              showPrimaryButton: false,
              showSecondaryButton: false,
            });
            resetFlags();
            return;
          }
        }
      }

      crud.showAlert({
        type: 'success',
        variant: 'subtle',
        title:
          crud.crudMode === 'edit'
            ? 'Equipo genÃ©rico actualizado'
            : 'Equipo genÃ©rico registrado',
        description: 'La informaciÃ³n se guardÃ³ correctamente.',
        showPrimaryButton: false,
        showSecondaryButton: false,
      });
      await data.refreshRows();
      resetFlags();
      crud.goList();
      return;
    }

    crud.showSpinner({
      message:
        crud.crudMode === 'edit' ? 'Actualizando dispositivo...' : 'Registrando dispositivo...',
    });

    const idProyect = resolvedProjectId || resolvedProjectIdFromLocation;
    if (!idProyect) {
      crud.hideSpinner();
      crud.showAlert({
        type: 'error',
        variant: 'subtle',
        title: 'No fue posible guardar el dispositivo',
        description: 'No se encontrÃ³ el proyecto seleccionado.',
        showPrimaryButton: false,
        showSecondaryButton: false,
      });
      return;
    }

    const payloadBase = {
      brand: sanitize(values.brand),
      model: sanitize(values.model),
      serialnumber: sanitize(values.serial),
      idGenericEquipment: sanitize(values.equipmentId),
      idLocation: sanitize(values.location),
      idProyect,
    };

    const result =
      crud.crudMode === 'edit' && crud.crudItemId
        ? await updateDeviceExternal({ id: crud.crudItemId, ...payloadBase })
        : await createDeviceExternal(payloadBase);

    crud.hideSpinner();

    if (!result) {
      crud.showAlert({
        type: 'error',
        variant: 'subtle',
        title: 'No fue posible guardar el dispositivo',
        description:
          useReportDevicesStore.getState().error ??
          deviceExternalError ??
          'OcurriÃ³ un error al registrar el dispositivo.',
        showPrimaryButton: false,
        showSecondaryButton: false,
      });
      return;
    }

    crud.showAlert({
      type: 'success',
      variant: 'subtle',
      title: crud.crudMode === 'edit' ? 'Dispositivo actualizado' : 'Dispositivo registrado',
      description: 'La informaciÃ³n se guardÃ³ correctamente.',
      showPrimaryButton: false,
      showSecondaryButton: false,
    });
    await data.refreshRows();
    crud.goList();
  };

  const handleSaveNewRefaction = async () => {
    const stockNumber = Number.parseInt(sanitize(newRefactionValues.stock), 10);
    if (
      !sanitize(newRefactionValues.sku) ||
      !sanitize(newRefactionValues.name) ||
      !sanitize(newRefactionValues.brand) ||
      !sanitize(newRefactionValues.model)
    ) {
      return;
    }

    const linkedGenericEquipmentId = sanitize(currentGenericEquipment?.id ?? crud.crudItemId ?? '');

    crud.showSpinner({ message: 'Guardando refacción...' });
    const created = await createSparePart({
        sku: sanitize(newRefactionValues.sku),
        stock: Number.isFinite(stockNumber) ? stockNumber : 0,
        name: sanitize(newRefactionValues.name),
        brand: sanitize(newRefactionValues.brand),
        model: sanitize(newRefactionValues.model),
        serialNumber: sanitize(newRefactionValues.serialNumber),
        characteristic: sanitize(newRefactionValues.characteristic),
        website: sanitize(newRefactionValues.website),
        phoneNumber: sanitize(newRefactionValues.phoneNumber),
        idSuppliers: [],
        idGenericEquipments: linkedGenericEquipmentId ? [linkedGenericEquipmentId] : [],
      });
    crud.hideSpinner();

    if (!created) {
      crud.showAlert({
        type: 'error',
        variant: 'subtle',
        title: 'No fue posible guardar la refacciÃ³n',
        description:
          useProyectInventoryStore.getState().error ??
          'OcurriÃ³ un error al guardar la refacciÃ³n.',
        showPrimaryButton: false,
        showSecondaryButton: false,
      });
      return;
    }

    await fetchSpareParts(true, true);
    setSelectedDraftRefactionIds((current) => Array.from(new Set([...current, created.id])));
    setAssignedRefactionIds((current) => Array.from(new Set([...current, created.id])));
    setShowAddRefactionForm(false);
    setNewRefactionValues(EMPTY_REFACTION_FORM);
  };

  const handleRemoveAssignedRefaction = (sparePartId: string) => {
    setAssignedRefactionIds((current) => current.filter((item) => item !== sparePartId));
    setSelectedDraftRefactionIds((current) => current.filter((item) => item !== sparePartId));
  };

  return {
    formType,
    title,
    primaryLabel,
    values,
    equipmentOptions,
    loadingFormInfo: loading || (formType === 'generic' && crud.crudMode === 'edit' && loadingCurrent),
    submitting: creating || updating || creatingDeviceExternal || updatingDeviceExternal,
    completeDisabled,
    showErrors,
    canSubmit,
    locationOptions,
    statusOptions,
    refactionOptions,
    selectedDraftRefactionIds,
    assignedRefactions,
    onCancel: crud.goList,
    onSubmit: handleSubmit,
    onChange: updateValue,
    onSelectDraftRefactions: (ids: string[]) => {
      setSelectedDraftRefactionIds(ids);
      setAssignedRefactionIds(ids);
    },
    onAssignDraftRefactions: () => {
      setShowAddRefactionForm((current) => !current);
    },
    onRemoveAssignedRefaction: handleRemoveAssignedRefaction,
    showAddRefactionForm,
    newRefactionValues,
    onChangeNewRefaction: (name: keyof NewRefactionFormValues, value: string) =>
      setNewRefactionValues((current) => ({ ...current, [name]: value })),
    onSaveNewRefaction: handleSaveNewRefaction,
  };
};



