import type {
  GetProyectInventoryState as Get,
  SetProyectInventoryState as Set,
} from "../types";

import { ReportsSuppliers } from "@/app/configurations/Axios/urls";
import { mapSuppliers } from "@/app/mappings/inventory/inventory.mapper";
import type { Supplier } from "@/app/mappings/inventory/inventory.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const fetchSuppliers = async (
  set: Set,
  get: Get,
  force = false
): Promise<Supplier[]> => {
  if (get().suppliers.length > 0 && !force) {
    set({ successGetSuppliers: true, error: undefined });
    return get().suppliers;
  }

  set({ loadingSuppliers: true, error: undefined, successGetSuppliers: false });

  try {
    const getFn = requireGateway("get");
    const res = await pGet(getFn)(ReportsSuppliers);
    const raw = res.data?.data ?? res.data ?? [];
    const suppliers = mapSuppliers(raw);

    set({
      suppliers,
      loadingSuppliers: false,
      successGetSuppliers: true,
    });

    return suppliers;
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      loadingSuppliers: false,
      successGetSuppliers: false,
      error: e.message,
    });

    return [];
  }
};
