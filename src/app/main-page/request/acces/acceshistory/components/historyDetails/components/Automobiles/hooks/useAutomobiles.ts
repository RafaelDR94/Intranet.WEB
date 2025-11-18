import { useAccesRequirementStore } from "@/app/stores/useAccesRequirementStore/useAccesRequirementStore";
import { useCallback, useEffect, useMemo } from "react";
import { shallow } from "zustand/shallow";
import { useRouter } from "next/navigation";
import type { Transport } from "@/app/mappings/transport/transport.types";

type VehicleRow = {
  id: string;
  plates: string;
  brand: string;
  model: string;
  unitType: string;
};

const mapVehicleRow = (vehicle: Transport, index: number): VehicleRow => ({
  id: vehicle.transport_id || String(index),
  plates: vehicle.plates,
  brand: vehicle.brand,
  model: vehicle.model,
  unitType: vehicle.UnitType,
});

const useAutomobiles = () => {
  const router = useRouter();
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

  const handleEditVehicles = useCallback(() => {
    if (!current?.id) return;
    router.push(
      `/main-page/request/acces/generateacces/?idAcces=${encodeURIComponent(current.id)}&mode=edit`,
    );
  }, [current?.id, router]);

  return {
    vehicles,
    loadingVehicles,
    handleEditVehicles,
  };
};

export default useAutomobiles;
