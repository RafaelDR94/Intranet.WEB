'use client';

import { Edit3 } from 'lucide-react';

import DetailsPanelLayout from '@/app/components/DetailsPanelLayout/DetailsPanelLayout';

import { useProvidersDetail } from '../hooks/useProvidersDetail';
import type { CrudScope } from '../../types';

type ProvidersDetailProps = {
  scope: CrudScope;
  open: boolean;
};

const actionButtonClass =
  'inline-flex h-[40px] items-center gap-3 rounded-[14px] bg-[#8CECEC] px-6 text-[14px] font-semibold text-green-100 shadow-sm';

const cardClass =
  'rounded-[18px] bg-white-100 px-5 py-4 shadow-[0px_8px_22px_rgba(19,25,39,0.10)]';

const ProvidersDetail = ({ scope, open }: ProvidersDetailProps) => {
  const state = useProvidersDetail(scope);

  return (
    <DetailsPanelLayout
      open={open}
      onClose={state.onClose}
      zIndex={10000}
      divider={false}
      withinContainer
      collapsedWidthClass="w-[478px] min-w-[478px]"
      contentClassName="px-4 pb-6 pt-0 sm:px-5 md:px-7"
    >
      {!state.provider ? (
        <div className="text-center text-gray-70">Selecciona un proveedor para ver el detalle.</div>
      ) : (
        <div className="min-w-0 space-y-[18px]">
          <div className="min-w-0 pt-2">
            <h2 className="break-words text-h3 font-semibold text-green-100">{state.provider.primary}</h2>
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={state.onEdit} className={actionButtonClass}>
              <span>Editar Información</span>
              <Edit3 className="h-6 w-6 text-green-100" strokeWidth={1.75} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className={`${cardClass} sm:col-span-2`}>
              <p className="text-[18px] font-medium leading-[1.2] text-gray-90">
                Proveedor: <span className="text-gray-70">{state.provider.primary}</span>
              </p>
            </div>
            <div className={`${cardClass} sm:col-span-2`}>
              <p className="text-[18px] font-medium leading-[1.2] text-gray-90">
                Pagina web: <span className="text-gray-70">{state.provider.secondary}</span>
              </p>
            </div>
            <div className={cardClass}>
              <p className="text-[18px] font-medium leading-[1.2] text-gray-90">
                Telefono: <span className="text-gray-70">{state.provider.tertiary}</span>
              </p>
            </div>
            <div className={cardClass}>
              <p className="text-[18px] font-medium leading-[1.2] text-gray-90">
                Estatus: <span className="text-gray-70">{state.provider.status}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </DetailsPanelLayout>
  );
};

export default ProvidersDetail;
