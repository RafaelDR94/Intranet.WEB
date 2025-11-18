import { useAccesRequirementStore } from "@/app/stores/useAccesRequirementStore/useAccesRequirementStore";
import { useEffect, useMemo } from "react";
import { shallow } from "zustand/shallow";
import JSZip from "jszip";

import type { CompleteTransport } from "@/app/mappings/transport/transport.types";

type VehicleRow = {
  id: string;
  plates: string;
  brand: string;
  model: string;
  Unit_type: string;
};

const mapVehicleRow = (vehicle: CompleteTransport, index: number): VehicleRow => ({
  id: vehicle.transport_id || String(index),
  plates: vehicle.plates,
  brand: vehicle.brand,
  model: vehicle.model,
  Unit_type: vehicle.Unit_type,
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

  const cards = useMemo(() => {
    const r = current?.vehicles[0];

    if (!r) return [] as { label: string; value?: React.ReactNode }[][];

    const newcards = [
      [
        {
          label: "Placa",
          value: r?.plates,
        },
        {
          label: "Póliza",
          value: r?.insurance_policy,
        },
      ],
      [
        {
          label: "Marca",
          value: r?.brand,
        },
        {
          label: "Modelo",
          value: r?.model,
        },
      ],
      [
        {
          label: "Vigencia de Póliza",
          value: r?.policy_expiration
        }
      ],
      [
        {
          label: "Tarjeta de circulación",
          value: r?.circulation_card
        }
      ],
      [
        {
          label: "Vigencia",
          value: r?.circulation_card_expiration
        }
      ],
      [
        {
          label: "No. de Serie",
          value: r?.serial_number
        }
      ],
      [
        {
          label: "No. de Motor",
          value: r?.engine_number
        }
      ]
    ];
    return newcards;
  }, [current]);

  const downloadImagesZip = async (item: any) => {
    const zip = new JSZip();

    const files = [
      { url: item.image_plates, name: "placa.jpg" },
      { url: item.image_circulation_card, name: "tarjeta_circulacion.jpg" },
      { url: item.front_image, name: "imagen_frontal.jpg" },
      { url: item.right_side_image, name: "lado_derecho.jpg" },
      { url: item.left_side_image, name: "lado_izquierdo.jpg" },
      { url: item.back_image, name: "imagen_trasera.jpg" },
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
    a.download = `${current?.dr_responsiblename}_Acceso.zip`;
    a.click();
  };

  return {
    vehicles,
    loadingVehicles,
    cards,
    current,
    downloadImagesZip,
  };
};

export default useAutomobiles;
