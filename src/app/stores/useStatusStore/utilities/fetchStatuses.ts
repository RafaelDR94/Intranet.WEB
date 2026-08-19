// src/app/stores/useStatusStore/utilities/fetchStatuses.ts
import { intranetClient } from "@/app/configurations/Axios/Clients";
import { Statuses, StatusById, StatusByType } from "@/app/configurations/Axios/urls";
import { Status, StatusPost, StatusPut } from "@/app/mappings/status/status.types";
import { StatusListMap, StatusMap, StatusPostMap, StatusPutMap } from "@/app/mappings/status/status.mapper";
import type { Set, Get } from "../types";

export const fetchStatuses = async (set: Set, get: Get, force = false) => {
  if (get().loading) return;
  if (!force && get().statuses.length > 0) return;
  set({ loading: true, error: undefined, successGet: false });
  try {
    const { data } = await intranetClient.get(Statuses);
    set({ statuses: StatusListMap(data), successGet: true });
  } catch (err: any) {
    set({ error: err?.message || "Error al obtener estatus" });
  } finally {
    set({ loading: false });
  }
};

export const fetchStatusById = async (
  id: string,
  set: Set,
  get: Get,
  force = false
) => {
  if (get().loadingById) return null;
  if (!force && get().current?.id === id) return get().current ?? null;
  set({ loadingById: true, error: undefined, successGetById: false });
  try {
    const { data } = await intranetClient.get(`${StatusById}/${id}`);
    const parsed = StatusMap(data);
    set({ current: parsed, successGetById: true });
    return parsed;
  } catch (err: any) {
    set({ error: err?.message || "Error al obtener estatus" });
    return null;
  } finally {
    set({ loadingById: false });
  }
};

export const fetchStatusesByType = async (
  type: string,
  set: Set,
  get: Get,

): Promise<Status[]> => {
  if (get().loading) return [];
  set({ loading: true, error: undefined, successGet: false });
  try {
    const { data } = await intranetClient.get(`${StatusByType}/${encodeURIComponent(type)}`);
    const list = StatusListMap(data.data);
    set({ statuses: list, successGet: true });
    return list;
  } catch (err: any) {
    set({ error: err?.message || "Error al obtener estatus por tipo" });
    return [];
  } finally {
    set({ loading: false });
  }
};

export const createStatus = async (
  set: Set,
  get: Get,
  payload: StatusPost
): Promise<Status | null> => {
  if (get().creating) return null;
  set({ creating: true, error: undefined, successPost: false });
  try {
    const body = StatusPostMap(payload);
    const { data } = await intranetClient.post(Statuses, body);
    const created = StatusMap(data);
    set({ statuses: [created, ...get().statuses], successPost: true });
    return created;
  } catch (err: any) {
    set({ error: err?.message || "Error al crear estatus" });
    return null;
  } finally {
    set({ creating: false });
  }
};

export const updateStatus = async (
  set: Set,
  get: Get,
  payload: StatusPut
): Promise<Status | null> => {
  if (get().updating) return null;
  set({ updating: true, error: undefined, successPut: false });
  try {
    const body = StatusPutMap(payload);
    const { data } = await intranetClient.put(Statuses, body);
    const updated = StatusMap(data);
    set({
      statuses: get().statuses.map((s) => (s.id === updated.id ? updated : s)),
      current: get().current?.id === updated.id ? updated : get().current,
      successPut: true,
    });
    return updated;
  } catch (err: any) {
    set({ error: err?.message || "Error al actualizar estatus" });
    return null;
  } finally {
    set({ updating: false });
  }
};

export const deleteStatus = async (
  id: string,
  set: Set,
  get: Get
): Promise<boolean> => {
  if (get().deleting) return false;
  set({ deleting: true, error: undefined, successDelete: false });
  try {
    await intranetClient.delete(`${StatusById}/${id}`);
    set({
      statuses: get().statuses.filter((s) => s.id !== id),
      current: get().current?.id === id ? undefined : get().current,
      successDelete: true,
    });
    return true;
  } catch (err: any) {
    set({ error: err?.message || "Error al eliminar estatus" });
    return false;
  } finally {
    set({ deleting: false });
  }
};

