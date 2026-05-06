'use client';

import clsx from 'clsx';

import type { FieldModel } from '@/app/components/DynamicForm/types';

import { locationsDefinition, locationsRows } from '../../crudDefinitions';
import { useCrudModule } from '../../crudShared';
import type { CrudScope } from '../../types';

const ACTIVE_LABEL_CLASS = 'text-label font-medium leading-4 text-gray-70';
const ACTIVE_CONTROL_CLASS =
  'h-[40px] rounded-[8px] border-[1.5px] border-[#afafaf] bg-white px-3 py-2 text-b3 leading-5 text-black-100 shadow-none placeholder:text-gray-50';
const SELECT_CONTAINER_CLASS = 'w-full';

export const useLocationsForm = (scope: CrudScope) => {
  const crud = useCrudModule(locationsDefinition, scope);
  const projectOptions = Array.from(
    new Map(
      locationsRows.map((row) => [
        row.secondary,
        {
          label: row.secondary,
          value: row.secondary,
        },
      ]),
    ).values(),
  );

  const fields: FieldModel[] = [
    {
      type: 'select' as const,
      name: 'projectCode',
      label: 'Selecciona uno o varios proyectos (opcional)',
      placeholder: 'Selecciona un proyecto',
      value: crud.currentRecord?.secondary ?? '',
      options: projectOptions,
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

  const handleSubmit = async (_values: Record<string, unknown>) => {
    crud.hideAlert();
    crud.showSpinner({
      message:
        crud.crudMode === 'edit'
          ? 'Actualizando ubicacion...'
          : 'Registrando ubicacion...',
    });
    await Promise.resolve();
    crud.hideSpinner();
    crud.showAlert({
      type: 'success',
      variant: 'subtle',
      title: crud.crudMode === 'edit' ? 'Ubicacion actualizada' : 'Ubicacion registrada',
      description: 'La accion fue ejecutada como parte de la infraestructura base del CRUD.',
      showPrimaryButton: false,
      showSecondaryButton: false,
    });
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
    cardClassName:
      '!block !gap-0 !rounded-[10px] !bg-white !p-0 shadow-[0px_2px_4px_-2px_rgba(19,25,39,0.12),0px_4px_4px_-2px_rgba(19,25,39,0.08)]',
    contentClassName: 'flex flex-col gap-5 px-[18px] pt-[26px] pb-9 md:px-[25px] md:pt-[23px]',
    formClassName: 'space-y-5',
    rowClassName: '!mb-0 !gap-[29px]',
  };
};
