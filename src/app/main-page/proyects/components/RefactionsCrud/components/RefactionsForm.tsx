'use client';

import { useEffect, useState } from 'react';

import { UserRoundPlus } from 'lucide-react';

import CrudFormTemplate from '../../CrudFormTemplate';
import {
  useRefactionsForm,
  type RefactionProviderFormValue,
} from '../hooks/useRefactionsForm';
import type { CrudScope } from '../../types';

type RefactionsFormProps = {
  scope: CrudScope;
};

const LABEL_CLASS = 'text-label font-medium leading-4 text-gray-70';
const CONTROL_CLASS =
  'h-[40px] rounded-[8px] border-[1.5px] border-[#afafaf] bg-white px-3 py-2 text-b3 leading-5 text-black-100 shadow-none placeholder:text-gray-50';
const SELECT_CLASS = `${CONTROL_CLASS} w-full`;

const RefactionsForm = ({ scope }: RefactionsFormProps) => {
  const state = useRefactionsForm(scope);
  const [providers, setProviders] = useState<RefactionProviderFormValue[]>(state.initialProviders);

  useEffect(() => {
    setProviders(state.initialProviders);
  }, [state.initialProviders]);

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
    <CrudFormTemplate {...state} onSubmit={(values) => state.onSubmit(values, providers)}>
      <div className="flex flex-col gap-5 pt-1">
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
