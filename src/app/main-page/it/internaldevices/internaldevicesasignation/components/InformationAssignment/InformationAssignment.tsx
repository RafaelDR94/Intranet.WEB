"use client";

import React, { useMemo } from "react";

import { Button } from "@/app/components/Button/Button";
import InfoCards from "@/app/components/InfoCards/InfoCards";
import type { InfoItem } from "@/app/components/InfoCards/types";
import useQuery from "@/app/hooks/useQuery/useQuery";
import type { InternalDevice } from "@/app/mappings/internaldevices/internaldevices.types";
import EditIcon from "@/assets/icons/Editor/edit-pencil.svg";

export interface InternalDeviceInformationProps {
  device?: InternalDevice | null;
  deviceId?: string | null;
  onEdit?: () => void;
}

const InformationAssignment: React.FC<InternalDeviceInformationProps> = ({
  device,
  deviceId,
  onEdit,
}) => {
  const { updateQuery } = useQuery();

  const cards = useMemo<InfoItem[][]>(
    () => [
      [
        { label: "Dispositivo", value: device?.device_type?.name ?? "-" },
        { label: "Marca", value: device?.device_brand?.name ?? "-" },
      ],
      [
        { label: "Modelo", value: device?.model ?? "-" },
        { label: "No. Serie", value: device?.serial_number ?? "-" },
      ],
      [{ label: "Nombre del equipo", value: device?.name ?? "-" }],
      [
        { label: "Direccion IP", value: device?.ip_address ?? "-" },
        { label: "MAC", value: device?.mac_address ?? "-" },
      ],
      [
        { label: "MAC WiFi", value: device?.mac_wifi_address ?? "-" },
        { label: "Sistema operativo", value: device?.operating_system ?? "-" },
      ],
      [
        {
          label: "Numero de serie de cargador",
          value: device?.charge_sn ?? "-",
        },
      ],
      [
        { label: "Proyecto", value: device?.device_proyect?.name ?? "-" },
        { label: "Cliente", value: device?.device_proyect?.client ?? "-" },
      ],
      [{ label: "Empresa", value: device?.enterprise?.name ?? "-" }],
      [{ label: "Otros accesorios", value: device?.description ?? "-" }],
      [{ label: "Motivo de baja", value: device?.low_motive || "-" }],
    ],
    [device],
  );

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
      return;
    }
    const targetId = device?.device_id ?? deviceId;
    if (!targetId) return;
    updateQuery({ id: targetId, view: "edit" });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <span className="text-label text-blue-60">
          Asignado a: {device?.assigned ? "Asignado" : "Sin asignar"}
        </span>
        <Button
          size="small"
          variant="ghost"
          icon={EditIcon}
          className="gap-2"
          onClick={handleEdit}
        >
          Editar informacion
        </Button>
      </div>

      <InfoCards
        cards={cards}
        maxWidthClassName="max-w-4xl"
        dataTestId="internal-device-assignment-info-cards"
        responsiveLayoutMatrix={{
          sm: [[10], [10], [10], [10], [10], [10]],
          md: [[5, 5], [5, 5], [10], [10], [10], [10], [10]],
        }}
      />
    </div>
  );
};

export default InformationAssignment;
