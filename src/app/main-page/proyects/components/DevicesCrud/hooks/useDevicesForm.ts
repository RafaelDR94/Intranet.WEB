'use client';

import { useAuth } from '@/app/context/AuthContext/AuthContext';
import { useEffect, useMemo, useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';

import type { GenericEquipmentPost, GenericEquipmentPut } from '@/app/mappings/inventory/inventory.types';
import { useProyectInventoryStore } from '@/app/stores/useProyectInventoryStore/useProyectInventoryStore';
import useProyectLocationStore from '@/app/stores/useProyectLocationStore/useProyectLocationStore';
import { useProyectsStore } from '@/app/stores/useProyectsStore/useProyectsStore';
import { useReportDevicesStore } from '@/app/stores/useReportDevicesStore/useReportDevicesStore';
import { devicesDefinition } from '../../crudDefinitions';
import { useCrudModule } from '../../crudShared';
import type { CrudScope } from '../../types';
import { useDevicesData } from './useDevicesData';

type DeviceFormType = 'complete' | 'generic';
type ProjectEquipmentMode = 'existing' | 'generic-inline';

export type DevicesFormValues = {
  equipmentId: string;
  typeOfEquipment: string;
  brand: string;
  model: string;
  serial: string;
  projectId: string;
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
  projectId: '',
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
    loadingSparePartsByGenericEquipment,
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
    createSparePart,
    spareParts,
    resetFlags,
  } = useProyectInventoryStore(
    (state) => ({
      genericEquipments: state.genericEquipments,
      currentGenericEquipment: state.currentGenericEquipment,
      loading: state.loading,
      loadingCurrent: state.loadingCurrent,
      loadingSparePartsByGenericEquipment: state.loadingSparePartsByGenericEquipment,
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
      createSparePart: state.createSparePart,
      spareParts: state.spareParts,
      resetFlags: state.resetFlags,
    }),
    shallow,
  );

  const { locations, fetchLocations } = useProyectLocationStore(
    (state) => ({
      locations: state.locations,
      fetchLocations: state.fetchLocations,
    }),
    shallow,
  );

  const { proyects, fetchProyects } = useProyectsStore(
    (state) => ({
      proyects: state.proyects,
      fetchProyects: state.fetchProyects,
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
  const [projectEquipmentMode, setProjectEquipmentMode] =
    useState<ProjectEquipmentMode>('existing');
  const [previousSelectedEquipmentId, setPreviousSelectedEquipmentId] = useState('');
  const [createdInlineGenericEquipmentId, setCreatedInlineGenericEquipmentId] = useState('');
  const [selectedDraftRefactionIds, setSelectedDraftRefactionIds] = useState<string[]>([]);
  const [assignedRefactionIds, setAssignedRefactionIds] = useState<string[]>([]);
  const [showAddRefactionForm, setShowAddRefactionForm] = useState(false);
  const [newRefactionValues, setNewRefactionValues] =
    useState<NewRefactionFormValues>(EMPTY_REFACTION_FORM);
  const lastFormSessionKeyRef = useRef('');
  const lastHydratedGenericSessionKeyRef = useRef('');
  const allowInlineGenericEquipment = formType === 'complete' && crud.crudMode === 'create';
  const isInlineGenericEquipmentMode =
    allowInlineGenericEquipment && projectEquipmentMode === 'generic-inline';
  const shouldLockProjectSelection = scope === 'project' && resolvedProjectId.length > 0;
  const selectedProjectId = shouldLockProjectSelection
    ? resolvedProjectId
    : sanitize(values.projectId);

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

  const projectOptions = useMemo(
    () =>
      proyects.map((project) => ({
        value: project.id,
        label: project.proyectKey?.trim() || project.name?.trim() || project.id,
      })),
    [proyects],
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
      return crud.crudMode === 'edit' ? 'Actualizar equipo genérico' : 'Nuevo equipo genérico';
    }

    return crud.crudMode === 'edit'
      ? devicesDefinition.config.updateLabel
      : devicesDefinition.config.createLabel;
  }, [crud.crudMode, formType]);

  const primaryLabel = title;

  useEffect(() => {
    if (formType === 'complete') {
      void fetchProyects(true);
    }

    void fetchGenericEquipments(formType === 'complete');

    if (formType === 'generic') {
      void fetchSpareParts(true);
    }

    if (formType === 'complete' && selectedProjectId) {
      void fetchLocations(selectedProjectId, true);
    }
  }, [
    fetchGenericEquipments,
    fetchLocations,
    fetchProyects,
    fetchSpareParts,
    formType,
    selectedProjectId,
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
      title: 'No fue posible cargar la información del formulario',
      description: error,
      showPrimaryButton: false,
      showSecondaryButton: false,
    });
    resetFlags();
  }, [crud, error, resetFlags]);

  useEffect(() => {
    if (!allowInlineGenericEquipment) {
      setProjectEquipmentMode('existing');
      setPreviousSelectedEquipmentId('');
      setCreatedInlineGenericEquipmentId('');
      return;
    }

    setProjectEquipmentMode('existing');
    setPreviousSelectedEquipmentId('');
    setCreatedInlineGenericEquipmentId('');
  }, [allowInlineGenericEquipment, crud.crudItemId, crud.crudMode, formType]);

  useEffect(() => {
    const nextSessionKey = `${formType}:${crud.crudMode}:${crud.crudItemId ?? 'new'}`;
    const isSameSession = lastFormSessionKeyRef.current === nextSessionKey;

    if (!isSameSession) {
      lastFormSessionKeyRef.current = nextSessionKey;
      lastHydratedGenericSessionKeyRef.current = '';
      setShowErrors(false);
      setSelectedDraftRefactionIds([]);
    }

    if (formType === 'complete' && crud.crudMode === 'create') {
      if (isSameSession) return;
      setAssignedRefactionIds([]);
      setValues(
        shouldLockProjectSelection
          ? {
              ...EMPTY_VALUES,
              projectId: resolvedProjectId,
            }
          : EMPTY_VALUES,
      );
      return;
    }

    if (formType === 'generic') {
      if (
        crud.crudMode === 'edit' &&
        currentGenericEquipment &&
        currentGenericEquipment.id === crud.crudItemId &&
        !loadingSparePartsByGenericEquipment &&
        lastHydratedGenericSessionKeyRef.current !== nextSessionKey
      ) {
        const assignedFromDevice = sparePartsByGenericEquipment.map((item) => item.id);
        const normalizedAssignedIds = Array.from(new Set(assignedFromDevice));
        setAssignedRefactionIds(normalizedAssignedIds);
        setSelectedDraftRefactionIds(normalizedAssignedIds);
        lastHydratedGenericSessionKeyRef.current = nextSessionKey;

        setValues({
          equipmentId: currentGenericEquipment.id,
          typeOfEquipment: currentGenericEquipment.typeOfEquipment,
          brand: currentGenericEquipment.brand,
          model: currentGenericEquipment.model,
          serial: '',
          projectId: '',
          location: '',
          status: '',
          description: '',
        });
        return;
      }

      if (isSameSession) return;

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

    if (isSameSession) return;

    setAssignedRefactionIds([]);

    if (crud.crudMode === 'create') return;

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
      projectId:
        shouldLockProjectSelection
          ? resolvedProjectId
          : crud.currentRecord?.projectId ?? '',
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
    loadingSparePartsByGenericEquipment,
    locations,
    resolvedProjectId,
    sparePartsByGenericEquipment,
    shouldLockProjectSelection,
  ]);

  useEffect(() => {
    if (formType !== 'complete' || !selectedProjectId) return;

    const validLocationIds = new Set(locations.map((location) => sanitize(location.id)));
    if (values.location && !validLocationIds.has(sanitize(values.location))) {
      setValues((current) => ({ ...current, location: '' }));
    }
  }, [formType, locations, selectedProjectId, values.location]);

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

    if (isInlineGenericEquipmentMode) {
      return (
        sanitize(values.typeOfEquipment).length > 0 &&
        sanitize(values.brand).length > 0 &&
        sanitize(values.model).length > 0 &&
        sanitize(values.serial).length > 0 &&
        selectedProjectId.length > 0 &&
        sanitize(values.location).length > 0 &&
        sanitize(values.status).length > 0 
      );
    }

    return (
      sanitize(values.equipmentId).length > 0 &&
      sanitize(values.brand).length > 0 &&
      sanitize(values.model).length > 0 &&
      sanitize(values.serial).length > 0 &&
      selectedProjectId.length > 0 &&
      sanitize(values.location).length > 0 &&
      sanitize(values.status).length > 0 
    );
  }, [formType, isInlineGenericEquipmentMode, selectedProjectId, values]);

  const updateValue = (name: keyof DevicesFormValues, value: string) => {
    if (
      createdInlineGenericEquipmentId &&
      ['equipmentId', 'typeOfEquipment', 'brand', 'model'].includes(name)
    ) {
      setCreatedInlineGenericEquipmentId('');
    }

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

  const updateProject = (value: string) => {
    setValues((current) => ({
      ...current,
      projectId: value,
      location: '',
    }));
  };

  const toggleProjectEquipmentMode = () => {
    if (!allowInlineGenericEquipment) return;

    crud.hideAlert();
    setShowErrors(false);
    setCreatedInlineGenericEquipmentId('');

    if (projectEquipmentMode === 'existing') {
      setPreviousSelectedEquipmentId(values.equipmentId);
      setProjectEquipmentMode('generic-inline');
      setValues((current) => ({
        ...current,
        equipmentId: '',
        typeOfEquipment: '',
        brand: '',
        model: '',
      }));
      return;
    }

    const restoredEquipment = genericEquipments.find(
      (equipment) => equipment.id === previousSelectedEquipmentId,
    );

    setProjectEquipmentMode('existing');
    setValues((current) => ({
      ...current,
      equipmentId: restoredEquipment?.id ?? '',
      typeOfEquipment: restoredEquipment?.typeOfEquipment ?? '',
      brand: restoredEquipment?.brand ?? '',
      model: restoredEquipment?.model ?? '',
    }));
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
        idSpareParts: assignedRefactionIds,
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
          name: sanitize(values.typeOfEquipment),
          brand: sanitize(values.brand),
          model: sanitize(values.model),
          id: crud.crudItemId,
          createdBy,
          idSpareParts: assignedRefactionIds,
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

      const genericEquipmentId =
        crud.crudMode === 'edit'
          ? sanitize(currentGenericEquipment?.id ?? crud.crudItemId ?? result.id)
          : sanitize(result.id);

      if (!genericEquipmentId) {
        crud.showAlert({
          type: 'error',
          variant: 'subtle',
          title: 'No fue posible guardar el equipo genérico',
          description: 'No se obtuvo el identificador del equipo genérico.',
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
      await data.refreshRows();
      resetFlags();
      crud.goList();
      return;
    }

    const idProyect = selectedProjectId;
    if (!idProyect) {
      crud.showAlert({
        type: 'error',
        variant: 'subtle',
        title: 'No fue posible guardar el dispositivo',
        description: 'No se encontró el proyecto seleccionado.',
        showPrimaryButton: false,
        showSecondaryButton: false,
      });
      return;
    }

    let genericEquipmentId = sanitize(values.equipmentId);

    if (isInlineGenericEquipmentMode && crud.crudMode === 'create') {
      genericEquipmentId = sanitize(createdInlineGenericEquipmentId);

      if (!genericEquipmentId) {
        crud.showSpinner({ message: 'Registrando equipo generico...' });

        const createdGenericEquipment = await createGenericEquipment({
          name: sanitize(values.typeOfEquipment),
          brand: sanitize(values.brand),
          model: sanitize(values.model),
          idSpareParts: [],
        });

        crud.hideSpinner();

        if (!createdGenericEquipment) {
          crud.showAlert({
            type: 'error',
            variant: 'subtle',
            title: 'No fue posible guardar el equipo generico',
            description:
              useProyectInventoryStore.getState().error ??
              'Ocurrio un error al registrar el equipo generico.',
            showPrimaryButton: false,
            showSecondaryButton: false,
          });
          resetFlags();
          return;
        }

        genericEquipmentId = sanitize(createdGenericEquipment.id);

        if (!genericEquipmentId) {
          crud.showAlert({
            type: 'error',
            variant: 'subtle',
            title: 'No fue posible continuar con el registro',
            description: 'No se obtuvo el identificador del equipo generico creado.',
            showPrimaryButton: false,
            showSecondaryButton: false,
          });
          resetFlags();
          return;
        }

        setCreatedInlineGenericEquipmentId(genericEquipmentId);
        resetFlags();
      }
    }

    crud.showSpinner({
      message:
        crud.crudMode === 'edit' ? 'Actualizando dispositivo...' : 'Registrando dispositivo...',
    });

    const payloadBase = {
      brand: sanitize(values.brand),
      model: sanitize(values.model),
      serialnumber: sanitize(values.serial),
      idGenericEquipment: genericEquipmentId,
      idLocation: sanitize(values.location),
      idProyect,
    };

    const result =
      crud.crudMode === 'edit' && crud.crudItemId
        ? await updateDeviceExternal({ id: crud.crudItemId, ...payloadBase })
        : await createDeviceExternal(payloadBase);

    crud.hideSpinner();

    if (!result) {
      if (isInlineGenericEquipmentMode && sanitize(createdInlineGenericEquipmentId || genericEquipmentId)) {
        crud.showAlert({
          type: 'error',
          variant: 'subtle',
          title: 'Equipo generico creado con dispositivo pendiente',
          description:
            useReportDevicesStore.getState().error ??
            deviceExternalError ??
            'El equipo generico se registro correctamente, pero no fue posible registrar el dispositivo. Puedes reintentar sin volver a crear el equipo.',
          showPrimaryButton: false,
          showSecondaryButton: false,
        });
        return;
      }

      crud.showAlert({
        type: 'error',
        variant: 'subtle',
        title: 'No fue posible guardar el dispositivo',
        description:
          useReportDevicesStore.getState().error ??
          deviceExternalError ??
          'Ocurrió un error al registrar el dispositivo.',
        showPrimaryButton: false,
        showSecondaryButton: false,
      });
      return;
    }

    setCreatedInlineGenericEquipmentId('');

    crud.showAlert({
      type: 'success',
      variant: 'subtle',
      title: crud.crudMode === 'edit' ? 'Dispositivo actualizado' : 'Dispositivo registrado',
      description: 'La información se guardó correctamente.',
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
        title: 'No fue posible guardar la refacción',
        description:
          useProyectInventoryStore.getState().error ??
          'Ocurrió un error al guardar la refacción.',
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
    projectOptions,
    selectedProjectId,
    shouldLockProjectSelection,
    loadingFormInfo:
      loading ||
      (formType === 'generic' &&
        crud.crudMode === 'edit' &&
        (loadingCurrent || loadingSparePartsByGenericEquipment)),
    submitting: creating || updating || creatingDeviceExternal || updatingDeviceExternal,
    completeDisabled,
    showErrors,
    canSubmit,
    allowInlineGenericEquipment,
    isInlineGenericEquipmentMode,
    locationOptions,
    statusOptions,
    refactionOptions,
    selectedDraftRefactionIds,
    assignedRefactions,
    onCancel: crud.goList,
    onSubmit: handleSubmit,
    onChange: (name: keyof DevicesFormValues, value: string) => {
      if (name === 'projectId') {
        updateProject(value);
        return;
      }

      updateValue(name, value);
    },
    onToggleProjectEquipmentMode: toggleProjectEquipmentMode,
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



