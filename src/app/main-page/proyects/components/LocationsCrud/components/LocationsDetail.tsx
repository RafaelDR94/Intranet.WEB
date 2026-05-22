'use client';

import { Edit3, Link2 } from 'lucide-react';

import DetailsPanelLayout from '@/app/components/DetailsPanelLayout/DetailsPanelLayout';
import Label from '@/app/components/Label/Label';

import { useLocationsDetail } from '../hooks/useLocationsDetail';
import type { CrudScope } from '../../types';

type LocationsDetailProps = {
  scope: CrudScope;
  open: boolean;
};

const actionButtonClass =
  'inline-flex h-[40px] items-center gap-3 rounded-[14px] bg-[#8CECEC] px-6 text-[14px] font-semibold text-green-100 shadow-sm';

const cardClass =
  'rounded-[18px] bg-white-100 px-5 py-4 shadow-[0px_8px_22px_rgba(19,25,39,0.10)]';

const LocationsDetail = ({ scope, open }: LocationsDetailProps) => {
  const state = useLocationsDetail(scope);

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
        state.location ? <Label type={state.statusLabelType} text={state.location.status} /> : null
      }
    >
      {!state.location ? (
        <div className="text-center text-gray-70">
          Selecciona una ubicacion para ver el detalle.
        </div>
      ) : (
        <div className="min-w-0 space-y-[18px]">
          <div className="min-w-0 pt-2">
            <h2 className="break-words text-h3 font-semibold text-green-100">
              {state.location.primary}
            </h2>
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={state.onEdit} className={actionButtonClass}>
              <span>Editar Información</span>
              <Edit3 className="h-6 w-6 text-green-100" strokeWidth={1.75} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className={cardClass}>
              <p className="text-[18px] font-medium leading-[1.2] text-gray-90">
                Proyecto: <span className="text-gray-70">{state.location.secondary}</span>
              </p>
            </div>
            <div className={cardClass}>
              <p className="text-[18px] font-medium leading-[1.2] text-gray-90">
                Estatus: <span className="text-gray-70">{state.location.status}</span>
              </p>
            </div>
            <div className={`${cardClass} sm:col-span-2`}>
              <p className="text-[18px] font-medium leading-[1.2] text-gray-90">
                Nombre: <span className="text-gray-70">{state.location.primary}</span>
              </p>
            </div>
            <div className={`${cardClass} sm:col-span-2`}>
              <p className="text-[18px] font-medium leading-[1.2] text-gray-90">
                Direccion: <span className="text-gray-70">{state.location.tertiary}</span>
              </p>
            </div>
            <div className={`${cardClass} sm:col-span-2`}>
              <p className="text-[18px] font-medium leading-[1.2] text-gray-90">
                Enlace Google Maps:
              </p>
              <a
                href={state.location.mapLink}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 break-all text-[18px] leading-[1.3] text-blue-60 underline-offset-2 hover:underline"
              >
                <Link2 className="h-5 w-5 shrink-0" />
                <span>{state.location.mapLink ?? 'Sin Información'}</span>
              </a>
            </div>
            <div className={`${cardClass} min-h-[132px] sm:col-span-2`}>
              <p className="text-[18px] font-medium leading-[1.2] text-gray-90">
                Descripcion:
              </p>
              <p className="mt-5 text-[18px] leading-[1.3] text-gray-70">
                {state.location.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </DetailsPanelLayout>
  );
};

export default LocationsDetail;
