'use client';

import { useEffect, useState } from 'react';

import TrashIcon from '@/assets/icons/acciones/trash.svg';
import AddUserIcon from '@/assets/icons/Users/Users/add-user.svg';
import WrenchIcon from '@/assets/icons/tools/tools/wrench.svg';
import { Button } from '@/app/components/Button/Button';
import { Input } from '@/app/components/Input/Input';
import { Select } from '@/app/components/Select/Select';

import CrudFormTemplate from '../../CrudFormTemplate';
import type { CrudScope } from '../../types';
import {
  useRefactionsForm,
  type RefactionEquipmentFormValue,
  type RefactionProviderFormValue,
} from '../hooks/useRefactionsForm';

type RefactionsFormProps = {
  scope: CrudScope;
};

const buildEquipmentOptionLabel = (typeOfEquipment: string, brand: string, model: string) =>
  [typeOfEquipment.trim(), brand.trim(), model.trim()].filter(Boolean).join(' - ');

const actionWrapperClasses = 'flex items-end md:min-h-[56px] md:justify-end';
const actionButtonClasses = 'flex-row-reverse gap-2 px-0 text-label font-medium text-gray-70';

const RefactionsForm = ({ scope }: RefactionsFormProps) => {
  const state = useRefactionsForm(scope);
  const [providers, setProviders] = useState<RefactionProviderFormValue[]>(state.initialProviders);
  const [equipments, setEquipments] = useState<RefactionEquipmentFormValue[]>(state.initialEquipments);

  useEffect(() => {
    setProviders(state.initialProviders);
  }, [state.initialProviders]);

  useEffect(() => {
    setEquipments(state.initialEquipments);
  }, [state.initialEquipments]);

  const hasSelectedEquipment = equipments.some((equipment) => equipment.equipmentId.trim().length > 0);
  const equipmentHelperText =
    state.genericEquipments.length === 0
      ? 'No hay equipos genericos disponibles para seleccionar.'
      : !hasSelectedEquipment
        ? 'Selecciona al menos un equipo generico.'
        : undefined;

  const equipmentOptions = state.genericEquipments.map((genericEquipment) => ({
    value: genericEquipment.id,
    label:
      buildEquipmentOptionLabel(
        genericEquipment.typeOfEquipment,
        genericEquipment.brand,
        genericEquipment.model,
      ) || genericEquipment.id,
  }));

  const supplierOptions = state.suppliers.map((supplier) => ({
    value: supplier.id,
    label: supplier.nombreProveedor,
  }));

  const handleAddProvider = () => {
    setProviders((current) => [
      ...current,
      {
        id: `provider-${current.length + 1}-${Date.now()}`,
        supplierId: '',
        provider: '',
        website: '',
        phone: '',
      },
    ]);
  };

  const handleRemoveProvider = (providerId: string) => {
    setProviders((current) => current.filter((provider) => provider.id !== providerId));
  };

  const handleAddEquipment = () => {
    setEquipments((current) => [
      ...current,
      {
        id: `equipment-${current.length + 1}-${Date.now()}`,
        equipmentId: '',
        brand: '',
        model: '',
      },
    ]);
  };

  const handleRemoveEquipment = (equipmentId: string) => {
    setEquipments((current) => current.filter((equipment) => equipment.id !== equipmentId));
  };

  const handleEquipmentSelected = (rowId: string, selectedEquipmentId: string) => {
    const selectedEquipment = state.genericEquipments.find((equipment) => equipment.id === selectedEquipmentId);

    setEquipments((current) =>
      current.map((equipment) =>
        equipment.id === rowId
          ? {
              ...equipment,
              equipmentId: selectedEquipmentId,
              brand: selectedEquipment?.brand ?? '',
              model: selectedEquipment?.model ?? '',
            }
          : equipment,
      ),
    );
  };

  const handleProviderSelected = (providerId: string, supplierId: string) => {
    const selectedSupplier = state.suppliers.find((supplier) => supplier.id === supplierId);

    setProviders((current) =>
      current.map((provider) =>
        provider.id === providerId
          ? {
              ...provider,
              supplierId,
              provider: selectedSupplier?.nombreProveedor ?? '',
              website: selectedSupplier?.paginaWeb ?? '',
              phone: selectedSupplier?.telefono ?? '',
            }
          : provider,
      ),
    );
  };

  const handleSubmit = (values: Record<string, unknown>) => {
    void state.onSubmit(values, providers, equipments);
  };

  return (
    <CrudFormTemplate
      {...state}
      primaryDisabled={!hasSelectedEquipment}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-6 pt-1">
        {equipments.map((equipment, index) => (
          <div
            key={equipment.id}
            className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,2.8fr)_minmax(0,1.6fr)_minmax(0,1.6fr)_auto] md:items-end"
          >
            <Select
              label="Equipo al que pertenece la refacciÃ³n*"
              placeholder="Selecciona equipo"
              selected={equipment.equipmentId ? [equipment.equipmentId] : []}
              onChange={(selected) => handleEquipmentSelected(equipment.id, selected[0] ?? '')}
              options={equipmentOptions}
              helperText={index === 0 ? equipmentHelperText : undefined}
            />
            <Input
              label="Marca"
              placeholder="Marca del equipo"
              value={equipment.brand}
              disabled
              variant="disabled"
            />
            <Input
              label="Modelo"
              placeholder="Modelo del equipo"
              value={equipment.model}
              disabled
              variant="disabled"
            />
            <div className={actionWrapperClasses}>
              {index === equipments.length - 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  icon={WrenchIcon}
                  onClick={handleAddEquipment}
                  className={actionButtonClasses}
                >
                  Agregar equipo
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  icon={TrashIcon}
                  onClick={() => handleRemoveEquipment(equipment.id)}
                  className={actionButtonClasses}
                >
                  Eliminar equipo
                </Button>
              )}
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-4">
          {providers.map((provider, index) => (
            <div
              key={provider.id}
              className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,2.2fr)_minmax(0,1.5fr)_minmax(0,1.2fr)_auto] md:items-end"
            >
              <Select
                label="Proveedor"
                placeholder="Selecciona un proveedor"
                selected={provider.supplierId ? [provider.supplierId] : []}
                onChange={(selected) => handleProviderSelected(provider.id, selected[0] ?? '')}
                options={supplierOptions}
              />
              <Input
                label="Página web"
                placeholder="Sin pagina web"
                value={provider.website}
                disabled
                variant="disabled"
              />
              <Input
                label="Telefono"
                placeholder="Sin telefono"
                value={provider.phone}
                disabled
                variant="disabled"
              />
              <div className={actionWrapperClasses}>
                {index === providers.length - 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    icon={AddUserIcon}
                    onClick={handleAddProvider}
                    className={actionButtonClasses}
                  >
                    Agregar proveedor
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    icon={TrashIcon}
                    onClick={() => handleRemoveProvider(provider.id)}
                    className={actionButtonClasses}
                  >
                    Eliminar proveedor
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </CrudFormTemplate>
  );
};

export default RefactionsForm;
