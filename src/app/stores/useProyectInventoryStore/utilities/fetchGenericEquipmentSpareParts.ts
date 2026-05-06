import type {
  GetProyectInventoryState as Get,
  SetProyectInventoryState as Set,
} from "../types";

import { ReportsGenericEquipmentSpareParts } from "@/app/configurations/Axios/urls";
import { mapGenericEquipmentSpareParts } from "@/app/mappings/inventory/inventory.mapper";
import type { GenericEquipmentSparePart } from "@/app/mappings/inventory/inventory.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const fetchGenericEquipmentSpareParts = async (
  isActive: boolean,
  set: Set,
  get: Get,
  force = false
): Promise<GenericEquipmentSparePart[]> => {
  if (
    get().genericEquipmentSpareParts.length > 0 &&
    get().lastGenericEquipmentSparePartsIsActive === isActive &&
    !force
  ) {
    set({ successGetGenericEquipmentSpareParts: true, error: undefined });
    return get().genericEquipmentSpareParts;
  }

  set({
    loadingGenericEquipmentSpareParts: true,
    error: undefined,
    successGetGenericEquipmentSpareParts: false,
  });

  try {
    const getFn = requireGateway("get");
    const res = await pGet(getFn)(
      `${ReportsGenericEquipmentSpareParts}?isActive=${String(isActive)}`
    );
    const raw = res.data?.data ?? res.data ?? [];
    const genericEquipmentSpareParts = mapGenericEquipmentSpareParts(raw);

    set({
      genericEquipmentSpareParts,
      lastGenericEquipmentSparePartsIsActive: isActive,
      loadingGenericEquipmentSpareParts: false,
      successGetGenericEquipmentSpareParts: true,
    });

    return genericEquipmentSpareParts;
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      loadingGenericEquipmentSpareParts: false,
      successGetGenericEquipmentSpareParts: false,
      error: e.message,
    });

    return [];
  }
};
