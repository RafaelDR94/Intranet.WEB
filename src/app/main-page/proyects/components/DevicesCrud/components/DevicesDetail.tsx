'use client';

import { useEffect, useState } from 'react';
import { Copy, Link2, Pencil, Plus } from 'lucide-react';

import ButtonsNavigation from '@/app/components/ButtonsNavigation/ButtonsNavigation';
import DetailsPanelLayout from '@/app/components/DetailsPanelLayout/DetailsPanelLayout';
import Label from '@/app/components/Label/Label';

import { useDevicesDetail } from '../hooks/useDevicesDetail';
import type { CrudScope } from '../../types';
import { Button } from '@/app/components/Button/Button';

type DevicesDetailProps = {
  scope: CrudScope;
  open: boolean;
};

type RefactionRow = {
  id: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
};

const cardClass =
  'rounded-[12px] bg-white-100 px-4 py-3 shadow-[0px_2px_6px_rgba(19,25,39,0.12)]';

const DevicesDetail = ({ scope, open }: DevicesDetailProps) => {
  const state = useDevicesDetail(scope);
  const [activeTab, setActiveTab] = useState('info');
  const {
    device,
    loading,
    loadingRefactions,
    refactions,
    refactionsError,
    fetchRefactions,
    resetRefactionsFlags,
    statusLabelType,
    onClose,
    onEdit,
    onNewRefaction,
  } = state;

  useEffect(() => {
    if (!open) {
      setActiveTab('info');
      return;
    }

    if (activeTab !== 'refactions') return;
    if (!device?.id) return;
    void fetchRefactions();
  }, [activeTab, device?.id, fetchRefactions, open]);

  useEffect(() => {
    if (activeTab !== 'refactions') return;
    if (!refactionsError) return;
    resetRefactionsFlags();
  }, [activeTab, refactionsError, resetRefactionsFlags]);

  const handleCopy = async (value?: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
  };

  return (
    <DetailsPanelLayout
      open={open}
      onClose={onClose}
      zIndex={10000}
      divider={false}
      withinContainer
      collapsedWidthClass="w-[478px] min-w-[478px]"
      contentClassName="px-4 pb-6 pt-0 sm:px-5 md:px-7"
      label={() => (device ? <Label type={statusLabelType} text={device.status} /> : null)}
    >
      {loading && !device ? (
        <div className="text-center text-gray-70">Cargando detalle del dispositivo...</div>
      ) : !device ? (
        <div className="text-center text-gray-70">Selecciona un dispositivo para ver el detalle.</div>
      ) : (
        <div className="min-w-0 space-y-[18px]">
          <div className="min-w-0 space-y-1 pt-2">
            <h2 className="break-words text-s1 font-semibold text-green-100">{device.primary}</h2>
          </div>

          <ButtonsNavigation
            dataTestId="devices-detail-nav"
            ariaLabel="Secciones del dispositivo"
            buttonSize="xsmall"
            activeVariant="solid"
            inactiveVariant="outline"
            activeId={activeTab}
            onActiveChange={setActiveTab}
          >
            <ButtonsNavigation.Item
              id="info"
              label="Información"
              className="h-[24px] rounded-[8px] px-4 py-[6px]"
              renderContent={
                <div className="space-y-4 pt-2">
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      icon={Pencil}
                      onClick={onEdit}
                    >
                      Editar información
                    </Button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className={cardClass}>
                      <p className="text-[14px] font-medium text-gray-90">
                        ID/SKU: <span className="text-gray-70">{device.id}</span>
                      </p>
                    </div>
                    <div className={cardClass}>
                      <p className="text-[14px] font-medium text-gray-90">
                        Proyecto: <span className="text-gray-70">{device.projectCode || 'Sin proyecto'}</span>
                      </p>
                    </div>
                  </div>

                  <div className={cardClass}>
                    <p className="text-[14px] font-medium text-gray-90">
                      Equipo: <span className="text-gray-70">{device.primary}</span>
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className={cardClass}>
                      <p className="text-[14px] font-medium text-gray-90">
                        Marca: <span className="text-gray-70">{device.secondary}</span>
                      </p>
                    </div>
                    <div className={cardClass}>
                      <p className="text-[14px] font-medium text-gray-90">
                        Modelo: <span className="text-gray-70">{device.model || 'Sin información'}</span>
                      </p>
                    </div>
                  </div>

                  <div className={cardClass}>
                    <p className="text-[14px] font-medium text-gray-90">
                      Número de serie: <span className="text-gray-70">{device.serialOrPart || 'Sin información'}</span>
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                    <div className={cardClass}>
                      <p className="text-[14px] font-medium text-gray-90">
                        Ubicación: <span className="text-gray-70">{device.tertiary}</span>
                      </p>
                    </div>
                    <div className={`${cardClass} flex items-center justify-center gap-3 px-5`}>
                      <a
                        href={device.mapLink || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-6 w-6 items-center justify-center text-blue-60"
                        aria-label="Abrir enlace de ubicación"
                      >
                        <Link2 className="h-5 w-5" strokeWidth={1.75} />
                      </a>
                      <button
                        type="button"
                        onClick={() => void handleCopy(device.mapLink)}
                        className="inline-flex h-6 w-6 items-center justify-center text-blue-60"
                        aria-label="Copiar enlace de ubicación"
                      >
                        <Copy className="h-5 w-5" strokeWidth={1.75} />
                      </button>
                    </div>
                  </div>

                  <div className={cardClass}>
                    <p className="text-[14px] font-medium text-gray-90">
                      Ubicación: <span className="text-gray-70">{device.tertiary}</span>
                    </p>
                  </div>

                  <div className={`${cardClass} min-h-[110px]`}>
                    <p className="text-[14px] font-medium text-gray-90">Características adicionales:</p>
                    <p className="mt-4 text-[14px] leading-[1.3] text-gray-70">{device.description}</p>
                  </div>
                </div>
              }
            />
            <ButtonsNavigation.Item
              id="refactions"
              label="Refacciones"
              className="h-[24px] rounded-[8px] px-4 py-[6px]"
              renderContent={
                <div className="space-y-3 pt-2">
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      icon={Plus}
                      onClick={onNewRefaction}
                    >
                      Nueva refacción
                    </Button>
                  </div>
                  {loadingRefactions ? (
                    <div className="py-6 text-center text-gray-70">Cargando refacciones...</div>
                  ) : (
                    <div className="overflow-hidden rounded-[14px] bg-white-100 shadow-[0px_2px_8px_rgba(19,25,39,0.12)]">
                      <div>
                        <table className="w-full border-collapse table-fixed">
                          <thead>
                            <tr className="border-b border-[#9EB8C4]">
                              <th className="px-3 py-4 text-left text-[13px] font-semibold text-green-100">NOMBRE</th>
                              <th className="px-3 py-4 text-left text-[13px] font-semibold text-green-100">MARCA</th>
                              <th className="px-3 py-4 text-left text-[13px] font-semibold text-green-100">MODELO</th>
                              <th className="px-3 py-4 text-left text-[13px] font-semibold text-green-100">No.SERIE</th>
                            </tr>
                          </thead>
                          <tbody>
                            {refactions.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="px-3 py-6 text-center text-[13px] text-gray-70">
                                  No hay refacciones relacionadas.
                                </td>
                              </tr>
                            ) : (
                              refactions.map((row: RefactionRow) => (
                                <tr key={row.id} className="border-b border-gray-30 last:border-b-0">
                                  <td className="px-3 py-3 text-[13px] text-gray-70">{row.name}</td>
                                  <td className="px-3 py-3 text-[13px] text-gray-70">{row.brand}</td>
                                  <td className="px-3 py-3 text-[13px] text-gray-70">{row.model}</td>
                                  <td className="px-3 py-3 text-[13px] text-gray-70">{row.serialNumber}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              }
            />
          </ButtonsNavigation>
        </div>
      )}
    </DetailsPanelLayout>
  );
};

export default DevicesDetail;

