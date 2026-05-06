import type {
  GetProyectInventoryState as Get,
  SetProyectInventoryState as Set,
} from "../types";

import { ReportsSparePartsByDeviceId } from "@/app/configurations/Axios/urls";
import { mapSpareParts } from "@/app/mappings/inventory/inventory.mapper";
import type { SparePart } from "@/app/mappings/inventory/inventory.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const fetchSparePartsByDeviceId = async (
  idDevice: string,
  set: Set,
  get: Get,
  force = false
): Promise<SparePart[]> => {
  if (
    get().sparePartsByDevice.length > 0 &&
    get().lastSparePartsByDeviceId === idDevice &&
    !force
  ) {
    set({ successGetSparePartsByDevice: true, error: undefined });
    return get().sparePartsByDevice;
  }

  set({
    loadingSparePartsByDevice: true,
    error: undefined,
    successGetSparePartsByDevice: false,
  });

  try {
    const getFn = requireGateway("get");
    const res = await pGet(getFn)(`${ReportsSparePartsByDeviceId}/${idDevice}`);
    const raw = res.data?.data ?? res.data ?? [];
    const spareParts = mapSpareParts(raw);

    set({
      sparePartsByDevice: spareParts,
      lastSparePartsByDeviceId: idDevice,
      loadingSparePartsByDevice: false,
      successGetSparePartsByDevice: true,
    });

    return spareParts;
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      loadingSparePartsByDevice: false,
      successGetSparePartsByDevice: false,
      error: e.message,
    });

    return [];
  }
};
