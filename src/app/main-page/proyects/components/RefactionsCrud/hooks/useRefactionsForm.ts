'use client';

import clsx from 'clsx';

import type { FieldModel } from '@/app/components/DynamicForm/types';

import { refactionsDefinition } from '../../crudDefinitions';
import { useCrudModule } from '../../crudShared';
import type { CrudScope } from '../../types';

const getSingleValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const PROVIDER_FIELD_NAMES = new Set(['provider', 'website', 'phone']);
const ACTIVE_LABEL_CLASS = 'text-label font-medium leading-4 text-gray-70';
const INACTIVE_LABEL_CLASS = 'text-label font-medium leading-4 text-gray-50';
const ACTIVE_CONTROL_CLASS =
  'h-[40px] rounded-[8px] border-[1.5px] border-[#afafaf] bg-white px-3 py-2 text-b3 leading-5 text-black-100 shadow-none placeholder:text-gray-50';
const INACTIVE_CONTROL_CLASS =
  'h-[40px] rounded-[8px] border-[1.5px] border-gray-20 bg-gray-10 px-3 py-2 text-b3 leading-5 text-gray-70 shadow-none placeholder:text-gray-70';
const SINGLE_LINE_TEXTAREA_CLASS = '!min-h-0 !h-[40px] resize-none overflow-hidden';
const SELECT_CONTAINER_CLASS = 'w-full';

export type RefactionProviderFormValue = {
  id: string;
  provider: string;
  website: string;
  phone: string;
};

export const useRefactionsForm = (scope: CrudScope) => {
  const crud = useCrudModule(refactionsDefinition, scope);
  const onlyProveedor = getSingleValue(crud.all.onlyproveedor) === 'true';
  const initialProviders: RefactionProviderFormValue[] = [
    {
      id: 'provider-1',
      provider: crud.currentRecord?.provider ?? '',
      website: crud.currentRecord?.website ?? '',
      phone: crud.currentRecord?.phone ?? '',
    },
  ];

  const fields: FieldModel[] = refactionsDefinition
    .fields(scope, crud.crudMode, crud.currentRecord)
    .filter((field) => !PROVIDER_FIELD_NAMES.has(field.name))
    .map((field) => {
      const isProviderField = PROVIDER_FIELD_NAMES.has(field.name);
      const disabled = onlyProveedor ? !isProviderField : field.disabled;
      const controlClassName = clsx(
        disabled ? INACTIVE_CONTROL_CLASS : ACTIVE_CONTROL_CLASS,
        field.name === 'description' && SINGLE_LINE_TEXTAREA_CLASS,
      );

      return {
        ...field,
        disabled,
        rows: field.name === 'description' ? 1 : field.rows,
        labelClassName: disabled ? INACTIVE_LABEL_CLASS : ACTIVE_LABEL_CLASS,
        helperClassName: 'hidden',
        className: field.type === 'select' ? SELECT_CONTAINER_CLASS : controlClassName,
        triggerClassName: field.type === 'select' ? controlClassName : undefined,
      };
    });
  const title =
    crud.crudMode === 'edit'
      ? 'Detalle refaccion'
      : refactionsDefinition.config.createLabel;

  const handleSubmit = async (_values: Record<string, unknown>) => {
    crud.hideAlert();
    crud.showSpinner({
      message:
        crud.crudMode === 'edit'
          ? 'Actualizando refaccion...'
          : 'Registrando refaccion...',
    });
    await Promise.resolve();
    crud.hideSpinner();
    crud.showAlert({
      type: 'success',
      variant: 'subtle',
      title: crud.crudMode === 'edit' ? 'Refaccion actualizada' : 'Refaccion registrada',
      description: 'La accion fue ejecutada como parte de la infraestructura base del CRUD.',
      showPrimaryButton: false,
      showSecondaryButton: false,
    });
    crud.goList();
  };

  return {
    title,
    primaryLabel: 'Guardar informacion',
    fields,
    initialProviders,
    onlyProveedor,
    loading: false,
    loadingFormInfo: false,
    responsiveLayout: refactionsDefinition.responsiveLayout,
    onSubmit: handleSubmit,
    onCancel: crud.goList,
    dataTestId: 'refactions-crud-form',
    mergeChildrenInSingleCard: true,
    cardClassName:
      '!block !gap-0 !rounded-[10px] !bg-white !p-0 shadow-[0px_2px_4px_-2px_rgba(19,25,39,0.12),0px_4px_4px_-2px_rgba(19,25,39,0.08)]',
    contentClassName: 'flex flex-col gap-5 px-[26px] pt-[28px] pb-6',
    formClassName: 'space-y-5',
    rowClassName: '!mb-0 !gap-[30px]',
  };
};
