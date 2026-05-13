'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';

import type { FieldModel, ResponsiveLayoutMatrix } from '@/app/components/DynamicForm/types';
import type { ProyectLocationType } from '@/app/mappings/locations/locations.types';
import { locationsDefinition } from '../../crudDefinitions';
import { useCrudModule } from '../../crudShared';
import type { CrudScope } from '../../types';
import { useLocationsData } from './useLocationsData';
import useProyectLocationStore from '@/app/stores/useProyectLocationStore/useProyectLocationStore';
import { useProyectsStore } from '@/app/stores/useProyectsStore/useProyectsStore';

const getSingleValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;
const sanitize = (value: unknown) => String(value ?? '').trim();

type DefaultLocationsFormState = {
  mode: 'default';
  title: string;
  primaryLabel: string;
  primaryDisabled?: boolean;
  fields: FieldModel[];
  loading: boolean;
  loadingFormInfo: boolean;
  responsiveLayout: ResponsiveLayoutMatrix;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
  dataTestId: string;
};

type LinkExistingLocationsFormState = {
  mode: 'link-existing';
  title: string;
  primaryLabel: string;
  primaryDisabled: boolean;
  loadingFormInfo: boolean;
  isCreatingNewLocation: boolean;
  locationOptions: Array<{ label: string; value: string }>;
  selectedLocationIds: string[];
  stagedLocations: ProyectLocationType[];
  createLocationForm: Omit<DefaultLocationsFormState, 'mode' | 'title' | 'primaryLabel'> & {
    valuesVersion: number;
  };
  onSelectionChange: (values: string[]) => void;
  onToggleCreateMode: () => void;
  onRemoveStagedLocation: (locationId: string) => void;
  onSubmit: () => Promise<void> | void;
  onCancel: () => void;
};

export type LocationsFormState =
  | DefaultLocationsFormState
  | LinkExistingLocationsFormState;

export const useLocationsForm = (scope: CrudScope): LocationsFormState => {
  const data = useLocationsData(scope);
  const crud = useCrudModule(locationsDefinition, scope, data.rows, {
    isResolvingRecord: data.loading,
  });

  const [projectCreateMode, setProjectCreateMode] = useState<'link-existing' | 'create-new'>(
    'create-new',
  );
  const [catalogLocations, setCatalogLocations] = useState<ProyectLocationType[]>([]);
  const [linkedProjectLocations, setLinkedProjectLocations] = useState<ProyectLocationType[]>([]);
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);
  const [inlineFormVersion, setInlineFormVersion] = useState(0);

  const { fetchLocations, fetchAllLocations } = useProyectLocationStore(
    (state) => ({
      fetchLocations: state.fetchLocations,
      fetchAllLocations: state.fetchAllLocations,
    }),
    shallow,
  );

  const {
    proyects,
    fetchProyects,
    linkLocationsToProyect,
    linkingLocations,
  } = useProyectsStore(
    (state) => ({
      proyects: state.proyects,
      fetchProyects: state.fetchProyects,
      linkLocationsToProyect: state.linkLocationsToProyect,
      linkingLocations: state.linkingLocations,
    }),
    shallow,
  );

  useEffect(() => {
    void fetchProyects(true);
  }, [fetchProyects]);

  const resolvedProjectIdFromQuery = useMemo(
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

  const isProjectLocationsCreateRoute =
    scope === 'project' &&
    crud.crudMode === 'create' &&
    crud.pathname.startsWith('/main-page/proyects/proyects/locations') &&
    Boolean(resolvedProjectIdFromQuery);

  useEffect(() => {
    setProjectCreateMode(isProjectLocationsCreateRoute ? 'link-existing' : 'create-new');
    setSelectedLocationIds([]);
    setInlineFormVersion((current) => current + 1);
  }, [isProjectLocationsCreateRoute]);

  const isSpecialProjectCreateRoute = isProjectLocationsCreateRoute;
  const isLinkExistingMode = isSpecialProjectCreateRoute;
  const isCreatingNewLocation = isSpecialProjectCreateRoute && projectCreateMode === 'create-new';

  const toggleProjectCreateMode = useCallback(() => {
    setProjectCreateMode((current) => {
      const next = current === 'create-new' ? 'link-existing' : 'create-new';
      return next;
    });
    setSelectedLocationIds([]);
    setInlineFormVersion((current) => current + 1);
  }, []);

  const loadLinkModeData = useCallback(async () => {
    if (!isSpecialProjectCreateRoute || !resolvedProjectIdFromQuery) return;

    const projectLocations = await fetchLocations(resolvedProjectIdFromQuery, true);
    setLinkedProjectLocations(projectLocations ?? []);

    const allLocations = await fetchAllLocations(true);
    setCatalogLocations(allLocations ?? []);
  }, [fetchAllLocations, fetchLocations, isSpecialProjectCreateRoute, resolvedProjectIdFromQuery]);

  useEffect(() => {
    if (!isSpecialProjectCreateRoute) return;
    void loadLinkModeData();
  }, [isSpecialProjectCreateRoute, loadLinkModeData]);

  const projectOptions = useMemo(
    () =>
      proyects.map((project) => ({
        label: project.proyectKey?.trim() || project.name?.trim() || project.id,
        value: project.id,
      })),
    [proyects],
  );

  const selectedProjectValue = useMemo(() => {
    if (scope === 'project' && resolvedProjectIdFromQuery) {
      return resolvedProjectIdFromQuery;
    }

    return crud.currentRecord?.projectId ?? '';
  }, [crud.currentRecord?.projectId, resolvedProjectIdFromQuery, scope]);

  const shouldDisableProjectField =
    scope === 'project' && Boolean(resolvedProjectIdFromQuery);

  const linkedLocationIds = useMemo(
    () => new Set(linkedProjectLocations.map((location) => sanitize(location.id))),
    [linkedProjectLocations],
  );

  const availableLocations = useMemo(
    () =>
      catalogLocations.filter((location) => {
        const locationId = sanitize(location.id);
        if (linkedLocationIds.has(locationId)) return false;

        const isAlreadyLinkedInCatalog = Array.isArray(location.proyect)
          ? location.proyect.some(
              (project) => sanitize(project?.id) === resolvedProjectIdFromQuery,
            )
          : false;

        return !isAlreadyLinkedInCatalog;
      }),
    [catalogLocations, linkedLocationIds, resolvedProjectIdFromQuery],
  );

  const locationOptions = useMemo(
    () =>
      availableLocations.map((location) => ({
        label: sanitize(location.name) || sanitize(location.address),
        value: sanitize(location.id),
      })),
    [availableLocations],
  );

  const stagedLocations = useMemo(() => {
    const availableById = new Map(
      availableLocations.map((location) => [sanitize(location.id), location]),
    );

    return selectedLocationIds
      .map((locationId) => availableById.get(locationId))
      .filter(Boolean) as ProyectLocationType[];
  }, [availableLocations, selectedLocationIds]);

  useEffect(() => {
    if (!isSpecialProjectCreateRoute) return;

    const availableIds = new Set(availableLocations.map((location) => sanitize(location.id)));
    setSelectedLocationIds((current) =>
      current.filter((locationId) => availableIds.has(locationId)),
    );
  }, [availableLocations, isSpecialProjectCreateRoute]);

  const fields: FieldModel[] = [
    {
      type: 'select' as const,
      name: 'projectCode',
      label: 'Selecciona un proyecto (opcional)',
      placeholder: 'Selecciona un proyecto',
      value: selectedProjectValue,
      options: projectOptions,
      disabled: shouldDisableProjectField,
    },
    {
      type: 'input' as const,
      name: 'primary',
      label: 'Nombre de la ubicacion',
      placeholder: 'Nombre',
      value: crud.currentRecord?.primary ?? '',
      validations: [{ type: 'required' as const }],
    },
    {
      type: 'input' as const,
      name: 'tertiary',
      label: 'Direccion',
      placeholder: 'Direccion',
      value: crud.currentRecord?.tertiary ?? '',
      validations: [{ type: 'required' as const }],
    },
    {
      type: 'input' as const,
      name: 'mapLink',
      label: 'Enlace Google maps',
      placeholder: 'Enlace de la ubicacion',
      value: crud.currentRecord?.mapLink ?? '',
    },
  ];

  const title =
    crud.crudMode === 'edit'
      ? 'Detalle ubicacion'
      : `${locationsDefinition.config.createLabel}`;

  const handleSubmit = async (values: Record<string, unknown>) => {
    crud.hideAlert();
    crud.showSpinner({
      message:
        crud.crudMode === 'edit'
          ? 'Actualizando ubicacion...'
          : 'Registrando ubicacion...',
    });

    const selectedProjectId = sanitize(values.projectCode ?? selectedProjectValue);
    const payload = {
      name: sanitize(values.primary),
      linkmaps: sanitize(values.mapLink),
      address: sanitize(values.tertiary),
      proyects: selectedProjectId ? [selectedProjectId] : undefined,
    };

    const result =
      crud.crudMode === 'edit' && crud.crudItemId
        ? await data.updateLocation({ id: crud.crudItemId, ...payload })
        : await data.createLocation(payload);

    crud.hideSpinner();

    if (!result) {
      crud.showAlert({
        type: 'error',
        variant: 'subtle',
        title:
          crud.crudMode === 'edit'
            ? 'No fue posible actualizar la ubicacion'
            : 'No fue posible registrar la ubicacion',
        description: useProyectLocationStore.getState().error ?? 'Ocurrio un error inesperado.',
        showPrimaryButton: false,
        showSecondaryButton: false,
      });
      data.resetFlags();
      return;
    }

    crud.showAlert({
      type: 'success',
      variant: 'subtle',
      title: crud.crudMode === 'edit' ? 'Ubicacion actualizada' : 'Ubicacion registrada',
      description: 'La Información se guardo correctamente.',
      showPrimaryButton: false,
      showSecondaryButton: false,
    });
    await data.refreshRows();
    data.resetFlags();
    crud.goList();
  };

  const handleLinkLocationsSubmit = async () => {
    if (!resolvedProjectIdFromQuery || selectedLocationIds.length === 0) return;

    crud.hideAlert();
    crud.showSpinner({ message: 'Vinculando ubicaciones...' });

    const success = await linkLocationsToProyect({
      proyect_id: resolvedProjectIdFromQuery,
      location_ids: selectedLocationIds,
    });

    crud.hideSpinner();

    if (!success) {
      crud.showAlert({
        type: 'error',
        variant: 'subtle',
        title: 'No fue posible vincular las ubicaciones',
        description: useProyectsStore.getState().error ?? 'Ocurrio un error inesperado.',
        showPrimaryButton: false,
        showSecondaryButton: false,
      });
      return;
    }

    const refreshedProjectLocations = await fetchLocations(resolvedProjectIdFromQuery, true);
    setLinkedProjectLocations(refreshedProjectLocations ?? []);
    setSelectedLocationIds([]);
    crud.showAlert({
      type: 'success',
      variant: 'subtle',
      title: 'Ubicaciones vinculadas',
      description: 'Las ubicaciones se agregaron correctamente al proyecto.',
      showPrimaryButton: false,
      showSecondaryButton: false,
    });
    crud.goList();
  };

  if (isLinkExistingMode) {
    return {
      mode: 'link-existing',
      title,
      primaryLabel: 'Guardar ubicacion',
      primaryDisabled: selectedLocationIds.length === 0 || linkingLocations,
      loadingFormInfo: data.loading,
      isCreatingNewLocation,
      locationOptions,
      selectedLocationIds,
      stagedLocations,
      createLocationForm: {
        fields,
        loading: false,
        loadingFormInfo: false,
        responsiveLayout: {
          sm: [[10], [10], [10], [10]],
          md: [[5, 5], [10], [10]],
          lg: [[5, 5], [10], [10]],
        },
        onSubmit: handleSubmit,
        onCancel: toggleProjectCreateMode,
        dataTestId: 'locations-crud-form-inline',
        primaryDisabled: false,
        valuesVersion: inlineFormVersion,
      },
      onSelectionChange: setSelectedLocationIds,
      onToggleCreateMode: toggleProjectCreateMode,
      onRemoveStagedLocation: (locationId: string) =>
        setSelectedLocationIds((current) =>
          current.filter((currentId) => currentId !== sanitize(locationId)),
        ),
      onSubmit: handleLinkLocationsSubmit,
      onCancel: crud.goList,
    };
  }

  return {
    mode: 'default',
    title,
    primaryLabel: 'Guardar ubicacion',
    primaryDisabled: false,
    fields,
    loading: false,
    loadingFormInfo: false,
    responsiveLayout: {
      sm: [[10], [10], [10], [10]],
      md: [[5, 5], [10], [10]],
      lg: [[5, 5], [10], [10]],
    },
    onSubmit: handleSubmit,
    onCancel:
      isProjectLocationsCreateRoute && projectCreateMode === 'create-new'
        ? () => setProjectCreateMode('link-existing')
        : crud.goList,
    dataTestId: 'locations-crud-form',
  };
};
