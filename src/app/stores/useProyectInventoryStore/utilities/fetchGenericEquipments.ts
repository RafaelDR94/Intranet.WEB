import type {
  GetProyectInventoryState as Get,
  SetProyectInventoryState as Set,
} from "../types";

import { ReportsGenericEquipment } from "@/app/configurations/Axios/urls";
import { mapGenericEquipments } from "@/app/mappings/inventory/inventory.mapper";
import type { GenericEquipment } from "@/app/mappings/inventory/inventory.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const fetchGenericEquipments = async (
  set: Set,
  get: Get,
  force = false
): Promise<GenericEquipment[]> => {
  if (get().genericEquipments.length > 0 && !force) {
    set({ successGet: true, error: undefined });
    return get().genericEquipments;
  }

  set({ loading: true, error: undefined, successGet: false });

  try {
    const getFn = requireGateway("get");
    const res = await pGet(getFn)(ReportsGenericEquipment);
    const raw = res.data?.data ?? res.data ?? [];
    const genericEquipments = mapGenericEquipments(raw);

    set({
      genericEquipments,
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
