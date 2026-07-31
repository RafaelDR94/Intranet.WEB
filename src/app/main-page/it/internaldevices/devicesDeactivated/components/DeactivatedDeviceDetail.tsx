"use client";

import { useMemo } from "react";

import ButtonsNavigation from "@/app/components/ButtonsNavigation/ButtonsNavigation";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import InfoCards from "@/app/components/InfoCards/InfoCards";
import type { InfoItem } from "@/app/components/InfoCards/types";
import Label from "@/app/components/Label/Label";
import type { InternalDevice } from "@/app/mappings/internaldevices/internaldevices.types";

import DeactivatedDeviceReviews from "./DeactivatedDeviceReviews";

type DeactivatedDeviceDetailProps = {
  open: boolean;
  device: InternalDevice | null;
  onClose: () => void;
};

const DeactivatedDeviceDetail = ({
  open,
  device,
  onClose,
}: DeactivatedDeviceDetailProps) => {
  const cards = useMemo<InfoItem[][]>(
    () =>
      device
        ? [
            [
              { label: "Dispositivo", value: device.device_type?.name ?? "-" },
              { label: "Marca", value: device.device_brand?.name ?? "-" },
            ],
            [{ label: "Modelo", value: device.model || "-" }],
            [{ label: "Numero de serie", value: device.serial_number || "-" }],
            [{ label: "Nombre del equipo", value: device.name || "-" }],
            [
              { label: "Direccion IP", value: device.ip_address || "-" },
              { label: "MAC", value: device.mac_address || "-" },
            ],
            [
              {
                label: "Sistema Operativo",
                value: device.operating_system || "-",
              },
            ],
            [
              {
                label: "Numero de serie de cargador",
                value: device.charge_sn || "-",
              },
            ],
            [{ label: "Otros accesorios", value: device.description || "-" }],
            [
              {
                label: "Caracteristicas adicionales",
                value: device.low_motive || "-",
              },
            ],
          ]
        : [],
    [device],
  );

  return (
    <DetailsPanelLayout
      open={open}
      onClose={onClose}
      zIndex={10000}
      actionButton={
        device ? (
          <h2 className="text-[18px] font-semibold text-green-100">
            {device.name || device.serial_number || "Dispositivo"}
          </h2>
        ) : null
      }
      label={() => <Label type="invalido" text="Desactivado" />}
    >
      {device && (
        <div className="space-y-6">
          <h2 className="text-h3 font-semibold text-green-100 md:hidden">
            {device.name || device.serial_number || "Dispositivo"}
          </h2>

          <ButtonsNavigation
            ariaLabel="Secciones de dispositivo desactivado"
            buttonSize="small"
            activeVariant="solid"
            inactiveVariant="outline"
          >
            <ButtonsNavigation.Item
              id="info"
              label="Informacion"
              renderContent={
                <InfoCards
                  cards={cards}
                  maxWidthClassName="max-w-3xl"
                  cardClassName="rounded-lg shadow-md"
                  dataTestId="deactivated-device-info"
                  responsiveLayoutMatrix={{
                    sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
                    md: [
                      [5, 5],
                      [10],
                      [10],
                      [10],
                      [5, 5],
                      [10],
                      [10],
                      [10],
                      [10],
                    ],
                  }}
                />
              }
            />
            <ButtonsNavigation.Item
              id="reviews"
              label="Revisiones"
              renderContent={<DeactivatedDeviceReviews device={device} />}
            />
          </ButtonsNavigation>
        </div>
      )}
    </DetailsPanelLayout>
  );
};

export default DeactivatedDeviceDetail;
