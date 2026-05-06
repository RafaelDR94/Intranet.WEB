import type {
  GetProyectInventoryState as Get,
  SetProyectInventoryState as Set,
} from "../types";

import { ReportsSpareParts } from "@/app/configurations/Axios/urls";
import { mapSpareParts } from "@/app/mappings/inventory/inventory.mapper";
import type { SparePart } from "@/app/mappings/inventory/inventory.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const fetchSpareParts = async (
  isActive: boolean,
  set: Set,
  get: Get,
  force = false
): Promise<SparePart[]> => {
  if (
    get().spareParts.length > 0 &&
    get().lastSparePartsIsActive === isActive &&
    !force
  ) {
    set({ successGetSpareParts: true, error: undefined });
    return get().spareParts;
  }

  set({
    loadingSpareParts: true,
    error: undefined,
    successGetSpareParts: false,
  });

  try {
    const getFn = requireGateway("get");
    const res = await pGet(getFn)(
      `${ReportsSpareParts}?isActive=${String(isActive)}`
    );
    const raw = res.data?.data ?? res.data ?? [];
    const spareParts = mapSpareParts(raw);

    set({
      spareParts,
      lastSparePartsIsActive: isActive,
      loadingSpareParts: false,
      successGetSpareParts: true,
    });

    return spareParts;
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      loadingSpareParts: false,
      successGetSpareParts: false,
      error: e.message,
    });

    return [];
  }
};
