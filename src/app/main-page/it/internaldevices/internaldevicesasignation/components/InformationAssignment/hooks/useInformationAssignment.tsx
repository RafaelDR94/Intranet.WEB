import { useCallback, useMemo } from "react";

import type { InfoItem } from "@/app/components/InfoCards/types";
import useQuery from "@/app/hooks/useQuery/useQuery";

import type { InternalDeviceInformationProps } from "../types";

/**
 * Encapsulates data and handlers for InformationAssignment.
 */
const useInformationAssignment = ({
  device,
  deviceId,
  onEdit,
}: InternalDeviceInformationProps) => {
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

  const assignedLabel = device?.assigned ? "Asignado" : "Sin asignar";

  const handleEdit = useCallback(() => {
    if (onEdit) {
      onEdit();
      return;
    }
    const targetId = device?.device_id ?? deviceId;
    if (!targetId) return;
    updateQuery({ id: targetId, view: "edit" });
  }, [device?.device_id, deviceId, onEdit, updateQuery]);

  return {
    assignedLabel,
    cards,
    handleEdit,
  };
};

export default useInformationAssignment;
