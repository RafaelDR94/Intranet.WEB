// src/app/stores/useAccesRequirementStore/utilities/generateTemplate.ts
import type { Set, Get } from "../types";

import { CustomAccessControlerTemplate } from "@/app/configurations/Axios/urls";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPost } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const generateTemplate = async (
  set: Set,
  get: Get,
  id: string
): Promise<any> => {
  set({ templating: true, successTemplate: false, templateError: undefined });
  try {
    const post = pPost(requireGateway("post"));
    const res = await post(CustomAccessControlerTemplate+"?accesRequirementId="+id, {accesRequirementId:id});
    const payload = res.data?.data ?? res.data ?? true;
    set({ templating: false, successTemplate: true });
    return payload;
  } catch (err) {
    const e = normalizeApiError(err);
    set({ templating: false, successTemplate: false, templateError: e.message });
    return null;
  }
};

