"use client";

import type { Get, Set } from "../types";

import { ExpenseTypeCatalog } from "@/app/configurations/Axios/urls";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pDelete } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

import { fetchSAPKeys } from "./fetchSAPKeys";

export const deleteSAPKey = async (
  set: Set,
  get: Get,
  id: string,
): Promise<boolean> => {
  set({
    deletingSAPKey: true,
    error: undefined,
    successDeleteSAPKey: false,
  });

  try {
    const del = pDelete(requireGateway("del"), [200, 204]);
    await del(`${ExpenseTypeCatalog}/${id}`);

    await fetchSAPKeys(set, get, true);

    if (get().sapKey?.id === id) {
      set({ sapKey: undefined });
    }

    set({
      deletingSAPKey: false,
      successDeleteSAPKey: true,
    });

    return true;
  } catch (error) {
    const err = normalizeApiError(error);
    set({
      deletingSAPKey: false,
      successDeleteSAPKey: false,
      error: err.message,
    });
    return false;
  }
};
