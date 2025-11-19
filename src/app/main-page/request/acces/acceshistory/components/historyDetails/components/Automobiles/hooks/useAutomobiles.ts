import { useEffect, useMemo, useCallback } from "react";
import JSZip from "jszip";
import { shallow } from "zustand/shallow";

import type { InfoItem } from "@/app/components/InfoCards/types";
import { useAccesRequirementStore } from "@/app/stores/useAccesRequirementStore/useAccesRequirementStore";
import type { CompleteTransport } from "@/app/mappings/transport/transport.types";

export type AutomobilesListItem = CompleteTransport & { id: string; name: string };

const buildVehicleName = (vehicle: CompleteTransport) => {
  const brandModel = [vehicle.brand, vehicle.model].filter(Boolean).join(" ").trim();
  if (brandModel && vehicle.plates) {
    return `${brandModel} · ${vehicle.plates}`;
  }

  return brandModel || vehicle.plates || "Vehículo sin datos";
};

const buildVehicleCards = (vehicle: CompleteTransport): InfoItem[][] => [
  [
    {
      label: "Placa",
      value: vehicle?.plates,
    },
    {
      label: "Póliza",
      value: vehicle?.insurance_policy,
    },
  ],
  [
    {
      label: "Marca",
      value: vehicle?.brand,
    },
    {
      label: "Modelo",
      value: vehicle?.model,
    },
  ],
  [
    {
      label: "Tipo de Unidad",
      value: vehicle?.Unit_type,
    },
    {
      label: "Año",
      value: vehicle?.year,
    },
  ],
  [
    {
      label: "Vigencia de Póliza",
      value: vehicle?.policy_expiration,
    },
  ],
  [
    {
      label: "Tarjeta de circulación",
      value: vehicle?.circulation_card,
    },
  ],
  [
    {
      label: "Vigencia tarjeta",
      value: vehicle?.circulation_card_expiration,
    },
  ],
  [
    {
      label: "No. de Serie",
      value: vehicle?.serial_number,
    },
    {
      label: "No. de Motor",
      value: vehicle?.engine_number,
    },
  ],
];

const mapVehicleRow = (vehicle: CompleteTransport, index: number): AutomobilesListItem => ({
  ...vehicle,
  id: vehicle.transport_id || String(index),
  name: buildVehicleName(vehicle),
});

const useAutomobiles = () => {
  const { current, fetchAccesRequirementById, loadingVehicles } =
    useAccesRequirementStore(
      (s) => ({
        current: s.current,
        fetchAccesRequirementById: s.fetchAccesRequirementById,
        loadingVehicles: s.loadingById,
      }),
      shallow,
    );

  useEffect(() => {
    if (!current?.id) return;
    if ((current?.vehicles?.length ?? 0) > 0) return;
    fetchAccesRequirementById(current.id, true);
  }, [current?.id, current?.vehicles?.length, fetchAccesRequirementById]);

  const vehicles = useMemo(
    () => (current?.vehicles ?? []).map(mapVehicleRow),
    [current?.vehicles],
  );

  const getCardsForVehicle = useCallback(
    (vehicle?: AutomobilesListItem | null) => {
      if (!vehicle) return [];
      return buildVehicleCards(vehicle);
    },
    [],
  );

  const downloadImagesZip = useCallback(
    async (vehicle?: AutomobilesListItem) => {
      if (!vehicle) return;

      const zip = new JSZip();

      const files = [
        { url: vehicle.image_plates, name: "placa.jpg" },
        { url: vehicle.image_circulation_card, name: "tarjeta_circulacion.jpg" },
        { url: vehicle.front_image, name: "imagen_frontal.jpg" },
        { url: vehicle.right_side_image, name: "lado_derecho.jpg" },
        { url: vehicle.left_side_image, name: "lado_izquierdo.jpg" },
        { url: vehicle.back_image, name: "imagen_trasera.jpg" },
        { url: vehicle.insurance_policy_doc, name: "poliza_seguro.pdf" },
      ];

      for (const file of files) {
        if (!file.url) continue;

        const response = await fetch(file.url);
        const blob = await response.blob();
        zip.file(file.name, blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });

      const a = document.createElement("a");
      a.href = URL.createObjectURL(zipBlob);
      const identifier =
        [vehicle.brand, vehicle.model, vehicle.plates].filter(Boolean).join("_") ||
        current?.dr_responsiblename ||
        "vehiculo";
      a.download = `${identifier}_Acceso.zip`;
      a.click();
    },
    [current?.dr_responsiblename],
  );

  return {
    vehicles,
    loadingVehicles,
    getCardsForVehicle,
    downloadImagesZip,
  };
};

export default useAutomobiles;
