'use client';

import { useEffect, useState } from 'react';

import ButtonsNavigation from '@/app/components/ButtonsNavigation/ButtonsNavigation';
import { Button } from '@/app/components/Button/Button';
import { DataTable } from '@/app/components/DataTable/DataTable';
import DetailsPanelLayout from '@/app/components/DetailsPanelLayout/DetailsPanelLayout';
import Label from '@/app/components/Label/Label';

import { useDevicesDetail } from '../hooks/useDevicesDetail';
import type { CrudScope } from '../../types';

type DevicesDetailProps = {
  scope: CrudScope;
  open: boolean;
};

type RefactionRow = {
  id: string;
  name: string;
  code: string;
  quantity: string;
};

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

  return (
    <DetailsPanelLayout
      open={open}
      onClose={onClose}
      zIndex={10000}
      divider={false}
      withinContainer
      collapsedWidthClass="w-[478px] min-w-[478px]"
      contentClassName="px-4 pb-6 pt-0 sm:px-5 md:px-7"
      label={() =>
        device ? <Label type={statusLabelType} text={device.status} /> : null
      }
    >
      {loading && !device ? (
        <div className="text-center text-gray-70">Cargando detalle del dispositivo...</div>
      ) : !device ? (
        <div className="text-center text-gray-70">
          Selecciona un dispositivo para ver el detalle.
        </div>
      ) : (
        <div className="min-w-0 space-y-[18px]">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <h2 className="break-words text-s1 font-semibold text-green-100">
                {device.primary}
              </h2>
              <p className="text-b4 text-gray-70">{device.secondary}</p>
            </div>

            <Button
              hideIcon
              size="xsmall"
              variant="outline"
              className="h-[24px] rounded-[8px] px-4 py-[6px]"
              onClick={onEdit}
            >
              Editar
            </Button>
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
              label="Informacion"
              className="h-[24px] rounded-[8px] px-4 py-[6px]"
              renderContent={
                <div className="grid gap-4 pt-2 sm:grid-cols-2">
                  <div className="rounded-[10px] border border-gray-20 bg-white-100 p-4">
                    <p className="text-c2 text-gray-60">Dispositivo</p>
                    <p className="mt-1 text-b3 text-gray-100">{device.primary}</p>
                  </div>
                  <div className="rounded-[10px] border border-gray-20 bg-white-100 p-4">
                    <p className="text-c2 text-gray-60">Marca</p>
                    <p className="mt-1 text-b3 text-gray-100">{device.secondary}</p>
                  </div>
                  <div className="rounded-[10px] border border-gray-20 bg-white-100 p-4">
                    <p className="text-c2 text-gray-60">Ubicacion</p>
                    <p className="mt-1 text-b3 text-gray-100">{device.tertiary}</p>
                  </div>
                  <div className="rounded-[10px] border border-gray-20 bg-white-100 p-4">
                    <p className="text-c2 text-gray-60">Estatus</p>
                    <p className="mt-1 text-b3 text-gray-100">{device.status}</p>
                  </div>
                  <div className="rounded-[10px] border border-gray-20 bg-white-100 p-4 sm:col-span-2">
                    <p className="text-c2 text-gray-60">Descripcion</p>
                    <p className="mt-1 text-b3 text-gray-100">{device.description}</p>
                  </div>
                </div>
              }
            />
            <ButtonsNavigation.Item
              id="refactions"
              label="Refacciones"
              className="h-[24px] rounded-[8px] px-4 py-[6px]"
              renderContent={
                <div className="pt-2">
                  {loadingRefactions ? (
                    <div className="py-6 text-center text-gray-70">Cargando refacciones...</div>
                  ) : (
                    <DataTable<RefactionRow>
                      showCalendar={false}
                      showSearch={false}
                      showFilter={false}
                      showButton={false}
                      enableInternalSearch={false}
                      enablePagination={false}
                      textSize={{ mobile: 'text-d3', desktop: 'text-b4' }}
                      tables={[
                        {
                          title: 'Refacciones relacionadas',
                          data: refactions,
                          columns: [
                            {
                              key: 'name',
                              label: 'REFACCION',
                              cellClass: 'w-[46%] min-w-0 px-2',
                              headerClass: 'w-[46%] min-w-0 px-2',
                            },
                            {
                              key: 'code',
                              label: 'CODIGO',
                              cellClass: 'w-[24%] min-w-0 px-2',
                              headerClass: 'w-[24%] min-w-0 px-2',
                            },
                            {
                              key: 'quantity',
                              label: 'CANTIDAD',
                              cellClass: 'w-[30%] min-w-0 px-2',
                              headerClass: 'w-[30%] min-w-0 px-2',
                            },
                          ],
                        },
                      ]}
                    />
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
