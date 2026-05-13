'use client';

import { UserRoundPlus } from 'lucide-react';

import ButtonsNavigation from '@/app/components/ButtonsNavigation/ButtonsNavigation';
import DetailsPanelLayout from '@/app/components/DetailsPanelLayout/DetailsPanelLayout';
import EditIcon from "@/assets/icons/Editor/edit-pencil.svg"
import Label from '@/app/components/Label/Label';

import { useRefactionsDetail } from '../hooks/useRefactionsDetail';
import type { CrudScope } from '../../types';
import { Button } from '@/app/components/Button/Button';

type RefactionsDetailProps = {
  scope: CrudScope;
  open: boolean;
};

const cardClass =
  'rounded-[18px] bg-white-100 px-5 py-4 shadow-[0px_8px_22px_rgba(19,25,39,0.10)]';

const RefactionsDetail = ({ scope, open }: RefactionsDetailProps) => {
  const state = useRefactionsDetail(scope);

  return (
    <DetailsPanelLayout
      open={open}
      onClose={state.onClose}
      zIndex={10000}
      divider={false}
      withinContainer
      collapsedWidthClass="w-[478px] min-w-[478px]"
      contentClassName="px-4 pb-6 pt-0 sm:px-5 md:px-7"
      label={() =>
        state.refaction ? (
          <Label type={state.statusLabelType} text={state.refaction.status} />
        ) : null
      }
    >
      {!state.refaction ? (
        <div className="text-center text-gray-70">
          Selecciona una refaccion para ver el detalle.
        </div>
      ) : (
        <div className="min-w-0 space-y-[18px]">
          <div className="min-w-0 pt-2">
            <h2 className="break-words text-s1 font-semibold text-green-100">
              {state.refaction.primary}
            </h2>
          </div>

          <ButtonsNavigation
            ariaLabel="Secciones de la refaccion"
            buttonSize="xsmall"
            activeVariant="solid"
            inactiveVariant="outline"
          >
            <ButtonsNavigation.Item
              id="info"
              label="Información"
              className="h-[24px] rounded-[8px] px-4 py-[6px]"
              renderContent={
                <div className="space-y-5 pt-2">
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      onClick={state.onEditInformation}
                      icon={EditIcon}
                      size='small'
                    >
                      Editar información
                    </Button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className={cardClass}>
                      <p className="text-[14px] font-medium leading-[1.2] text-gray-90">
                        ID/SKU: <span className="text-gray-70">{state.refaction.id}</span>
                      </p>
                    </div>
                    <div className={cardClass}>
                      <p className="text-[14px] font-medium leading-[1.2] text-gray-90">
                        Stock: <span className="text-gray-70">{state.refaction.stock}</span>
                      </p>
                    </div>
                    <div className={`${cardClass} sm:col-span-2`}>
                      <p className="text-[14px] font-medium leading-[1.2] text-gray-90">
                        Nombre: <span className="text-gray-70">{state.refaction.primary}</span>
                      </p>
                    </div>
                    <div className={`${cardClass} sm:col-span-2`}>
                      <p className="text-[14px] font-medium leading-[1.2] text-gray-90">
                        Equipo:{' '}
                        <span className="text-gray-70">{state.refaction.secondary}</span>
                      </p>
                    </div>
                    <div className={cardClass}>
                      <p className="text-[14px] font-medium leading-[1.2] text-gray-90">
                        Marca: <span className="text-gray-70">{state.refaction.tertiary}</span>
                      </p>
                    </div>
                    <div className={cardClass}>
                      <p className="text-[14px] font-medium leading-[1.2] text-gray-90">
                        Modelo: <span className="text-gray-70">{state.refaction.model}</span>
                      </p>
                    </div>
                    <div className={`${cardClass} sm:col-span-2`}>
                      <p className="text-[14px] font-medium leading-[1.2] text-gray-90">
                        Número de serie:{' '}
                        <span className="text-gray-70">{state.refaction.serialOrPart}</span>
                      </p>
                    </div>
                    <div className={`${cardClass} min-h-[132px] sm:col-span-2`}>
                      <p className="text-[14px] font-medium leading-[1.2] text-gray-90">
                        Características adicionales:
                      </p>
                      <p className="mt-5 text-[14px] leading-[1.3] text-gray-70">
                        {state.refaction.description}
                      </p>
                    </div>
                  </div>
                </div>
              }
            />
            <ButtonsNavigation.Item
              id="providers"
              label="Proveedores"
              className="h-[24px] rounded-[8px] px-4 py-[6px]"
              renderContent={
                <div className="min-h-[620px] space-y-6">
                  <div className="flex justify-end">
                    <Button
                      variant='ghost'
                      size='small'
                      onClick={state.onEditProviders}
                      icon={UserRoundPlus}
                    >
                      Agregar proveedor
                    </Button>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className={cardClass}>
                      <p className="text-[14px] font-medium leading-[1.2] text-gray-90">
                        ID/SKU: <span className="text-gray-70">{state.refaction.id}</span>
                      </p>
                    </div>
                    <div className={cardClass}>
                      <p className="text-[14px] font-medium leading-[1.2] text-gray-90">
                        Stock: <span className="text-gray-70">{state.refaction.stock}</span>
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[18px] bg-white-100 px-5 py-6 shadow-[0px_8px_22px_rgba(19,25,39,0.10)]">
                    <div className="grid grid-cols-[1.2fr_1.8fr_1fr] gap-4 border-b border-blue-30 pb-5">
                      <p className="text-[14px] font-medium uppercase tracking-[0.02em] text-green-100">
                        Proveedor
                      </p>
                      <p className="text-[14px] font-medium uppercase tracking-[0.02em] text-green-100">
                        Página web
                      </p>
                      <p className="text-[14px] font-medium uppercase tracking-[0.02em] text-green-100">
                        Teléfono
                      </p>
                    </div>

                    <div className="space-y-6 pt-6">
                      {state.providers.length === 0 ? (
                        <p className="text-[14px] text-gray-70">No hay proveedores relacionados.</p>
                      ) : (
                        state.providers.map((provider) => (
                          <div
                            key={provider.id}
                            className="grid grid-cols-[1.2fr_1.8fr_1fr] gap-4 text-[15px] leading-[1.25] text-gray-80"
                          >
                            <p>{provider.name}</p>
                            <p className="break-all">{provider.website}</p>
                            <p>{provider.phone}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              }
            />
          </ButtonsNavigation>
        </div>
      )}
    </DetailsPanelLayout>
  );
};

export default RefactionsDetail;
