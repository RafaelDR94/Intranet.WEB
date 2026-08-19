import type {
  GetProyectInventoryState as Get,
  SetProyectInventoryState as Set,
} from "../types";

import { ReportsGenericEquipmentById } from "@/app/configurations/Axios/urls";
import { mapGenericEquipment } from "@/app/mappings/inventory/inventory.mapper";
import type { GenericEquipment } from "@/app/mappings/inventory/inventory.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const fetchGenericEquipmentById = async (
  id: string,
  set: Set,
  get: Get,
  force = false
): Promise<GenericEquipment | null> => {
  if (
    get().currentGenericEquipment &&
    get().lastGenericEquipmentId === id &&
    !force
  ) {
    set({ successGetCurrent: true, error: undefined });
    return get().currentGenericEquipment;
  }

  set({ loadingCurrent: true, error: undefined, successGetCurrent: false });

  try {
    const getFn = requireGateway("get");
    const res = await pGet(getFn)(`${ReportsGenericEquipmentById}/${id}`);
    const raw = res.data?.data ?? res.data;
    const currentGenericEquipment = raw ? mapGenericEquipment(raw) : null;

    set({
      currentGenericEquipment,
      lastGenericEquipmentId: id,
      loadingCurrent: false,
      successGetCurrent: true,
    });

    return currentGenericEquipment;
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      loadingCurrent: false,
      successGetCurrent: false,
      error: e.message,
    });

    return null;
  }
};
