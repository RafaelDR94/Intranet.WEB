import type {
  GetProyectInventoryState as Get,
  SetProyectInventoryState as Set,
} from "../types";

import { ReportsGenericEquipmentByProyectId } from "@/app/configurations/Axios/urls";
import { mapGenericEquipments } from "@/app/mappings/inventory/inventory.mapper";
import type { GenericEquipment } from "@/app/mappings/inventory/inventory.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const fetchGenericEquipmentsByProyectId = async (
  idProyect: string,
  set: Set,
  get: Get,
  force = false
): Promise<GenericEquipment[]> => {
  const trimmedId = String(idProyect ?? "").trim();

  if (!trimmedId) {
    set({
      genericEquipments: [],
      lastGenericEquipmentsScope: null,
      lastGenericEquipmentsByProyectId: null,
      successGet: true,
      error: undefined,
    });
    return [];
  }

  if (
    get().genericEquipments.length > 0 &&
    get().lastGenericEquipmentsScope === "project" &&
    get().lastGenericEquipmentsByProyectId === trimmedId &&
    !force
  ) {
    set({ successGet: true, error: undefined });
    return get().genericEquipments;
  }

  set({ loading: true, error: undefined, successGet: false });

  try {
    const getFn = requireGateway("get");
    const res = await pGet(getFn)(
      `${ReportsGenericEquipmentByProyectId}/${encodeURIComponent(trimmedId)}`
    );
    const raw = res.data?.data ?? res.data ?? [];
    const genericEquipments = mapGenericEquipments(raw);

    set({
      genericEquipments,
      lastGenericEquipmentsScope: "project",
      lastGenericEquipmentsByProyectId: trimmedId,
      loading: false,
      successGet: true,
    });

    return genericEquipments;
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      loading: false,
      successGet: false,
      error: e.message,
    });

    return [];
  }
};
