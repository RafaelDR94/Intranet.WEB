import type {
  GetProyectInventoryState as Get,
  SetProyectInventoryState as Set,
} from "../types";

import { ReportsSparePartsByProyectId } from "@/app/configurations/Axios/urls";
import { mapSpareParts } from "@/app/mappings/inventory/inventory.mapper";
import type { SparePart } from "@/app/mappings/inventory/inventory.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const fetchSparePartsByProyectId = async (
  idProyect: string,
  set: Set,
  get: Get,
  force = false
): Promise<SparePart[]> => {
  if (
    get().sparePartsByProyect.length > 0 &&
    get().lastSparePartsByProyectId === idProyect &&
    !force
  ) {
    set({ successGetSparePartsByProyect: true, error: undefined });
    return get().sparePartsByProyect;
  }

  set({
    loadingSparePartsByProyect: true,
    error: undefined,
    successGetSparePartsByProyect: false,
  });

  try {
    const getFn = requireGateway("get");
    const res = await pGet(getFn)(`${ReportsSparePartsByProyectId}/${idProyect}`);
    const raw = res.data?.data ?? res.data ?? [];
    const spareParts = mapSpareParts(raw);

    set({
      sparePartsByProyect: spareParts,
      lastSparePartsByProyectId: idProyect,
      loadingSparePartsByProyect: false,
      successGetSparePartsByProyect: true,
    });

    return spareParts;
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      loadingSparePartsByProyect: false,
      successGetSparePartsByProyect: false,
      error: e.message,
    });

    return [];
  }
};
