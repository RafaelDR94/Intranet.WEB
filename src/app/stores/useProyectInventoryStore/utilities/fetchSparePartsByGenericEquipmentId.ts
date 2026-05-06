import type {
  GetProyectInventoryState as Get,
  SetProyectInventoryState as Set,
} from "../types";

import { ReportsSparePartsByGenericEquipmentId } from "@/app/configurations/Axios/urls";
import { mapSpareParts } from "@/app/mappings/inventory/inventory.mapper";
import type { SparePart } from "@/app/mappings/inventory/inventory.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const fetchSparePartsByGenericEquipmentId = async (
  idGenericEquipment: string,
  set: Set,
  get: Get,
  force = false
): Promise<SparePart[]> => {
  if (
    get().sparePartsByGenericEquipment.length > 0 &&
    get().lastSparePartsByGenericEquipmentId === idGenericEquipment &&
    !force
  ) {
    set({ successGetSparePartsByGenericEquipment: true, error: undefined });
    return get().sparePartsByGenericEquipment;
  }

  set({
    loadingSparePartsByGenericEquipment: true,
    error: undefined,
    successGetSparePartsByGenericEquipment: false,
  });

  try {
    const getFn = requireGateway("get");
    const res = await pGet(getFn)(
      `${ReportsSparePartsByGenericEquipmentId}/${idGenericEquipment}`
    );
    const raw = res.data?.data ?? res.data ?? [];
    const spareParts = mapSpareParts(raw);

    set({
      sparePartsByGenericEquipment: spareParts,
      lastSparePartsByGenericEquipmentId: idGenericEquipment,
      loadingSparePartsByGenericEquipment: false,
      successGetSparePartsByGenericEquipment: true,
    });

    return spareParts;
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      loadingSparePartsByGenericEquipment: false,
      successGetSparePartsByGenericEquipment: false,
      error: e.message,
    });

    return [];
  }
};
