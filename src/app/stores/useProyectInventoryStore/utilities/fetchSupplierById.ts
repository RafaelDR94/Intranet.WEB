import type {
  GetProyectInventoryState as Get,
  SetProyectInventoryState as Set,
} from "../types";

import { ReportsSuppliers } from "@/app/configurations/Axios/urls";
import { mapSupplier } from "@/app/mappings/inventory/inventory.mapper";
import type { Supplier } from "@/app/mappings/inventory/inventory.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const fetchSupplierById = async (
  id: string,
  set: Set,
  get: Get,
  force = false
): Promise<Supplier | null> => {
  if (get().currentSupplier && get().lastSupplierId === id && !force) {
    set({ successGetCurrentSupplier: true, error: undefined });
    return get().currentSupplier;
  }

  set({ loadingCurrentSupplier: true, error: undefined, successGetCurrentSupplier: false });

  try {
    const getFn = requireGateway("get");
    const res = await pGet(getFn)(
      `${ReportsSuppliers}?id=${encodeURIComponent(id)}`
    );
    const raw = res.data?.data ?? res.data;
    const currentSupplier = raw ? mapSupplier(raw) : null;

    set({
      currentSupplier,
      lastSupplierId: id,
      loadingCurrentSupplier: false,
      successGetCurrentSupplier: true,
    });

    return currentSupplier;
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      loadingCurrentSupplier: false,
      successGetCurrentSupplier: false,
      error: e.message,
    });

    return null;
  }
};
