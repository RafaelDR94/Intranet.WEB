// src/app/mappings/status/status.mapper.ts
import { Status, StatusPost, StatusPut } from "./status.types";

const toString = (v: unknown, fb = "") => (v == null ? fb : String(v));
const toBool = (v: unknown) => Boolean(v);

export const StatusMap = (raw: any): Status => ({
  id: toString(raw?.id),
  name: toString(raw?.name),
  type: toString(raw?.type),
  is_active: toBool(raw?.is_active),
});

export const StatusListMap = (list: any[]): Status[] =>
  Array.isArray(list) ? list.map(StatusMap) : [];

export const StatusPostMap = (src: Partial<StatusPost> | any): StatusPost => ({
  id: toString(src?.id),
  name: toString(src?.name),
  type: toString(src?.type),
  is_active: Boolean(src?.is_active),
});

export const StatusPutMap = (src: Partial<StatusPut> | any): StatusPut => ({
  id: toString(src?.id),
  name: toString(src?.name),
  type: toString(src?.type),
  is_active: Boolean(src?.is_active),
});

