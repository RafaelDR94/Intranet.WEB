'use client';

import type { FieldModel } from '@/app/components/DynamicForm/types';
import { useEffect } from 'react';

import { providersDefinition } from '../../crudDefinitions';
import { useCrudModule } from '../../crudShared';
import type { CrudScope } from '../../types';
import { useProvidersData } from './useProvidersData';
import { useProyectInventoryStore } from '@/app/stores/useProyectInventoryStore/useProyectInventoryStore';

const ACTIVE_LABEL_CLASS = 'text-label font-medium leading-4 text-gray-70';
const ACTIVE_CONTROL_CLASS =
  'h-[40px] rounded-[8px] border-[1.5px] border-[#afafaf] bg-white px-3 py-2 text-b3 leading-5 text-black-100 shadow-none placeholder:text-gray-50';

export const useProvidersForm = (scope: CrudScope) => {
  const data = useProvidersData();
  const crud = useCrudModule(providersDefinition, scope, data.rows, {
    isResolvingRecord: data.loading,
  });

  useEffect(() => {
    if (!data.error) return;
    crud.hideAlert();
    crud.showAlert({
      type: 'error',
      variant: 'subtle',
      title: 'No fue posible preparar el formulario',
      description: data.error,
      showPrimaryButton: false,
      showSecondaryButton: false,
    });
    data.resetFlags();
  }, [crud, data.error, data.resetFlags]);

  const fields: FieldModel[] = [
    {
      type: 'input',
      name: 'primary',
      label: 'Empresa',
      placeholder: 'Industria Suply',
      value: crud.currentRecord?.primary ?? '',
      validations: [{ type: 'required' }],
      labelClassName: ACTIVE_LABEL_CLASS,
      className: ACTIVE_CONTROL_CLASS,
    },
    {
      type: 'input',
      name: 'secondary',
      label: 'Pagina Web',
      placeholder: 'www.industriasuply.com',
      value: crud.currentRecord?.secondary ?? '',
      validations: [{ type: 'required' }],
      labelClassName: ACTIVE_LABEL_CLASS,
      className: ACTIVE_CONTROL_CLASS,
    },
    {
      type: 'input',
      name: 'tertiary',
      label: 'Telefono',
      placeholder: '55 5555 5555',
      value: crud.currentRecord?.tertiary ?? '',
      validations: [{ type: 'required' }],
      labelClassName: ACTIVE_LABEL_CLASS,
      className: ACTIVE_CONTROL_CLASS,
    },
  ];

  const title =
    crud.crudMode === 'edit'
      ? providersDefinition.config.updateLabel
      : providersDefinition.config.createLabel;

  const handleSubmit = async (values: Record<string, unknown>) => {
    crud.hideAlert();
    crud.showSpinner({
      message:
        crud.crudMode === 'edit'
          ? 'Actualizando proveedor...'
          : 'Registrando proveedor...',
    });

    const payload = {
      supplierName: String(values.primary ?? '').trim(),
      website: String(values.secondary ?? '').trim(),
      phonenumber: String(values.tertiary ?? '').trim(),
    };

    const result =
      crud.crudMode === 'edit' && crud.crudItemId
        ? await data.updateSupplier({ id: crud.crudItemId, ...payload })
        : await data.createSupplier(payload);

    crud.hideSpinner();

    if (!result) {
      crud.showAlert({
        type: 'error',
        variant: 'subtle',
        title:
          crud.crudMode === 'edit'
            ? 'No fue posible actualizar el proveedor'
            : 'No fue posible registrar el proveedor',
        description: useProyectInventoryStore.getState().error ?? 'Ocurrio un error inesperado.',
        showPrimaryButton: false,
        showSecondaryButton: false,
      });
      data.resetFlags();
      return;
    }

    crud.showAlert({
      type: 'success',
      variant: 'subtle',
      title: crud.crudMode === 'edit' ? 'Proveedor actualizado' : 'Proveedor registrado',
      description: 'La informacion se guardo correctamente.',
      showPrimaryButton: false,
      showSecondaryButton: false,
    });
    data.resetFlags();
    crud.goList();
  };

  return {
    title,
    primaryLabel:
      crud.crudMode === 'edit'
        ? providersDefinition.config.updateLabel
        : providersDefinition.config.createLabel,
    showSecondaryButton: true,
    fields,
    loading: false,
    loadingFormInfo: false,
    responsiveLayout: {
      sm: [[10], [10], [10]],
      md: [[10], [10], [10]],
      lg: [[3.34, 3.33, 3.33]],
    },
    onSubmit: handleSubmit,
    onCancel: crud.goList,
    dataTestId: 'providers-crud-form',
  };
};
