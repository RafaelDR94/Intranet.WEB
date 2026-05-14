'use client';

import { useEffect, useState } from 'react';

import { Minus, UserRoundPlus, Wrench } from 'lucide-react';

import CrudFormTemplate from '../../CrudFormTemplate';
import {
  useRefactionsForm,
  type RefactionEquipmentFormValue,
  type RefactionProviderFormValue,
} from '../hooks/useRefactionsForm';
import type { CrudScope } from '../../types';

type RefactionsFormProps = {
  scope: CrudScope;
};

const LABEL_CLASS = 'text-label font-medium leading-4 text-gray-70';
const CONTROL_CLASS =
  'h-[40px] w-full rounded-[8px] border-[1.5px] border-[#afafaf] bg-white px-3 py-2 text-b3 leading-5 text-black-100 shadow-none placeholder:text-gray-50';
const SELECT_CLASS = `${CONTROL_CLASS} w-full`;

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

  const handleAddEquipment = () => {
    setEquipments((current) => [
      ...current,
      {
        id: `equipment-${current.length + 1}-${Date.now()}`,
        equipmentId: '',
        brand: '',
        model: '',
        characteristic: '',
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
              brand: selectedEquipment?.brand ?? equipment.brand,
              model: selectedEquipment?.model ?? equipment.model,
            }
          : equipment,
      ),
    );
  };

  const handleEquipmentFieldChange = (
    rowId: string,
    field: 'brand' | 'model' | 'characteristic',
    value: string,
  ) => {
    setEquipments((current) =>
      current.map((equipment) => (equipment.id === rowId ? { ...equipment, [field]: value } : equipment)),
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

  return (
    <CrudFormTemplate {...state} onSubmit={(values) => state.onSubmit(values, providers, equipments)}>
      <div className="flex flex-col gap-5 pt-1">
        {equipments.map((equipment, index) => (
          <div
            key={equipment.id}
            className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,3.34fr)_minmax(0,3.33fr)_minmax(0,3.33fr)] md:gap-[30px]"
          >
            <div>
              <p className={LABEL_CLASS}>Equipo relacionado</p>
              <select
                id={`equipment-select-${equipment.id}`}
                value={equipment.equipmentId}
                onChange={(event) => handleEquipmentSelected(equipment.id, event.target.value)}
                className={SELECT_CLASS}
              >
                <option value="">Selecciona una opción</option>
                {state.genericEquipments.map((genericEquipment) => (
                  <option key={genericEquipment.id} value={genericEquipment.id}>
                    {genericEquipment.typeOfEquipment}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className={LABEL_CLASS}>Marca</p>
              <input
                value={equipment.brand}
                onChange={(event) => handleEquipmentFieldChange(equipment.id, 'brand', event.target.value)}
                placeholder="Marca"
                className={CONTROL_CLASS}
              />
            </div>
            <div>
              <p className={LABEL_CLASS}>Modelo</p>
              <input
                value={equipment.model}
                onChange={(event) => handleEquipmentFieldChange(equipment.id, 'model', event.target.value)}
                placeholder="Modelo"
                className={CONTROL_CLASS}
              />
            </div>
            <div className="md:col-span-2">
              <p className={LABEL_CLASS}>Características adicionales</p>
              <input
                value={equipment.characteristic}
                onChange={(event) => handleEquipmentFieldChange(equipment.id, 'characteristic', event.target.value)}
                placeholder="Características adicionales"
                className={CONTROL_CLASS}
              />
            </div>
            <div className="flex items-end">
              {index === equipments.length - 1 ? (
                <button
                  type="button"
                  onClick={handleAddEquipment}
                  className="inline-flex h-[40px] items-center gap-2 whitespace-nowrap text-label font-medium text-gray-70"
                >
                  <Wrench className="h-5 w-5 text-blue-60" strokeWidth={1.75} />
                  <span>Agregar equipo</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleRemoveEquipment(equipment.id)}
                  className="inline-flex h-[40px] items-center gap-2 whitespace-nowrap text-label font-medium text-gray-70"
                >
                  <Minus className="h-5 w-5 text-blue-60" strokeWidth={2} />
                  <span>Eliminar equipo</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {providers.map((provider, index) => (
          <div key={provider.id} className="flex flex-col gap-3">
            <p className={LABEL_CLASS}>Proveedor</p>

            <div className="flex w-full items-end gap-4 max-md:flex-col max-md:items-stretch">
              <div className="w-full max-w-[360px]">
                <select
                  id={`provider-select-${provider.id}`}
                  value={provider.supplierId}
                  onChange={(event) => handleProviderSelected(provider.id, event.target.value)}
                  className={SELECT_CLASS}
                >
                  <option value="">Selecciona un proveedor</option>
                  {state.suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.nombreProveedor}
                    </option>
                  ))}
                </select>
              </div>
              {index === 0 ? (
                <button
                  type="button"
                  onClick={handleAddProvider}
                  className="inline-flex h-[40px] items-center gap-2 whitespace-nowrap text-label font-medium text-gray-70"
                >
                  <UserRoundPlus className="h-5 w-5 text-blue-60" strokeWidth={1.75} />
                  <span>Agregar proveedor</span>
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </CrudFormTemplate>
  );
};

export default RefactionsForm;
