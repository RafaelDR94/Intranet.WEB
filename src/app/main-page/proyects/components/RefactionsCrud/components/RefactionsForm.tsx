'use client';

import { useState } from 'react';

import { Trash2, UserRoundPlus } from 'lucide-react';

import { Button } from '@/app/components/Button/Button';
import { Input } from '@/app/components/Input/Input';

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

const RefactionsForm = ({ scope }: RefactionsFormProps) => {
  const state = useRefactionsForm(scope);
  const [providers, setProviders] = useState<RefactionProviderFormValue[]>(state.initialProviders);

  const handleProviderChange = (
    providerId: string,
    key: keyof Omit<RefactionProviderFormValue, 'id'>,
    value: string,
  ) => {
    setProviders((current) =>
      current.map((provider) =>
        provider.id === providerId ? { ...provider, [key]: value } : provider,
      ),
    );
  };

  const handleAddProvider = () => {
    setProviders((current) => [
      ...current,
      {
        id: `provider-${current.length + 1}-${Date.now()}`,
        provider: '',
        website: '',
        phone: '',
      },
    ]);
  };

  const handleRemoveProvider = (providerId: string) => {
    setProviders((current) => current.filter((provider) => provider.id !== providerId));
  };

  return (
    <CrudFormTemplate {...state}>
      <div className="flex flex-col gap-5 pt-1">
        {providers.map((provider, index) => (
          <div key={provider.id} className="flex flex-col gap-3">
            {providers.length > 1 ? (
              <div className="flex items-center justify-between">
                <p className="text-label font-medium text-gray-70">
                  Proveedor {index + 1}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="small"
                  hideIcon
                  onClick={() => handleRemoveProvider(provider.id)}
                  className="gap-2 px-0 text-alert-red-100 hover:bg-transparent"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Eliminar proveedor</span>
                </Button>
              </div>
            ) : null}

            <div className="flex w-full gap-[30px] max-md:flex-col">
              <div className="w-full">
                <Input
                  label="Proveedor"
                  value={provider.provider}
                  onChange={(event) =>
                    handleProviderChange(provider.id, 'provider', event.target.value)
                  }
                  labelClassName={LABEL_CLASS}
                  className={CONTROL_CLASS}
                />
              </div>
              <div className="w-full">
                <Input
                  label="Pagina web"
                  value={provider.website}
                  onChange={(event) =>
                    handleProviderChange(provider.id, 'website', event.target.value)
                  }
                  labelClassName={LABEL_CLASS}
                  className={CONTROL_CLASS}
                />
              </div>
              <div className="w-full">
                <Input
                  label="Telefono"
                  value={provider.phone}
                  onChange={(event) =>
                    handleProviderChange(provider.id, 'phone', event.target.value)
                  }
                  labelClassName={LABEL_CLASS}
                  className={CONTROL_CLASS}
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddProvider}
          className="inline-flex w-fit items-center gap-3 text-label font-medium text-gray-70"
        >
          <UserRoundPlus className="h-6 w-6 text-blue-60" strokeWidth={1.75} />
          <span>Agregar proveedor</span>
        </button>
      </div>
    </CrudFormTemplate>
  );
};

export default RefactionsForm;
