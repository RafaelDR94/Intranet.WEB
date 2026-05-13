'use client';

import clsx from 'clsx';
import { useEffect, useMemo } from 'react';
import { shallow } from 'zustand/shallow';

import type { FieldModel } from '@/app/components/DynamicForm/types';

import { locationsDefinition } from '../../crudDefinitions';
import { useCrudModule } from '../../crudShared';
import type { CrudScope } from '../../types';
import { useLocationsData } from './useLocationsData';
import useProyectLocationStore from '@/app/stores/useProyectLocationStore/useProyectLocationStore';
import { useProyectsStore } from '@/app/stores/useProyectsStore/useProyectsStore';

const ACTIVE_LABEL_CLASS = 'text-label font-medium leading-4 text-gray-70';
const ACTIVE_CONTROL_CLASS =
  'h-[40px] rounded-[8px] border-[1.5px] border-[#afafaf] bg-white px-3 py-2 text-b3 leading-5 text-black-100 shadow-none placeholder:text-gray-50';
const SELECT_CONTAINER_CLASS = 'w-full';

export const useLocationsForm = (scope: CrudScope) => {
  const data = useLocationsData(scope);
  const crud = useCrudModule(locationsDefinition, scope, data.rows, {
    isResolvingRecord: data.loading,
  });

  const { proyects, fetchProyects } = useProyectsStore(
    (state) => ({
      proyects: state.proyects,
      fetchProyects: state.fetchProyects,
    }),
    shallow,
  );

  useEffect(() => {
    void fetchProyects(true);
  }, [fetchProyects]);

  const projectOptions = useMemo(
    () =>
      proyects.map((project) => ({
        label: project.name?.trim() || project.proyectKey?.trim() || project.id,
        value: project.id,
      })),
    [proyects],
  );

  const selectedProjectValue = useMemo(() => {
    if (crud.crudMode === 'create' && scope === 'project' && crud.projectId) {
      return crud.projectId;
    }

    return (
      projectOptions.find((option) => option.label === (crud.currentRecord?.secondary ?? ''))
        ?.value ?? ''
    );
  }, [crud.crudMode, crud.currentRecord?.secondary, crud.projectId, projectOptions, scope]);

  const shouldDisableProjectField =
    crud.crudMode === 'create' && scope === 'project' && Boolean(crud.projectId);

  const fields: FieldModel[] = [
    {
      type: 'select' as const,
      name: 'projectCode',
      label: 'Selecciona uno o varios proyectos (opcional)',
      placeholder: 'Selecciona un proyecto',
      value: selectedProjectValue,
      options: projectOptions,
      disabled: shouldDisableProjectField,
      labelClassName: ACTIVE_LABEL_CLASS,
      className: SELECT_CONTAINER_CLASS,
      triggerClassName: ACTIVE_CONTROL_CLASS,
    },
    {
      type: 'input' as const,
      name: 'primary',
      label: 'Nombre de la ubicacion',
      placeholder: 'Nombre',
      value: crud.currentRecord?.primary ?? '',
      validations: [{ type: 'required' as const }],
      labelClassName: ACTIVE_LABEL_CLASS,
      className: ACTIVE_CONTROL_CLASS,
    },
    {
      type: 'input' as const,
      name: 'tertiary',
      label: 'Direccion',
      placeholder: 'Direccion',
      value: crud.currentRecord?.tertiary ?? '',
      validations: [{ type: 'required' as const }],
      labelClassName: ACTIVE_LABEL_CLASS,
      className: ACTIVE_CONTROL_CLASS,
    },
    {
      type: 'input' as const,
      name: 'mapLink',
      label: 'Enlace Google maps',
      placeholder: 'Enlace de la ubicacion',
      value: crud.currentRecord?.mapLink ?? '',
      validations: [{ type: 'required' as const }],
      labelClassName: ACTIVE_LABEL_CLASS,
      className: ACTIVE_CONTROL_CLASS,
    },
  ].map((field) => ({
    ...field,
    className: clsx(field.className),
  }));
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

    const payload = {
      name: String(values.primary ?? '').trim(),
      linkmaps: String(values.mapLink ?? '').trim(),
      address: String(values.tertiary ?? '').trim(),
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
      description: 'La informacion se guardo correctamente.',
      showPrimaryButton: false,
      showSecondaryButton: false,
    });
    await data.refreshRows();
    data.resetFlags();
    crud.goList();
  };

  return {
    title,
    primaryLabel: 'Guardar ubicacion',
    fields,
    loading: false,
    loadingFormInfo: false,
    responsiveLayout: {
      sm: [[10], [10], [10], [10]],
      md: [[5, 5], [10], [10]],
      lg: [[5, 5], [10], [10]],
    },
    onSubmit: handleSubmit,
    onCancel: crud.goList,
    dataTestId: 'locations-crud-form',
  };
};
