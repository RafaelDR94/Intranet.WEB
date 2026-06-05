import type { SAPKey, SAPKeyPost, SAPKeyPut } from "./sapkeys.types";

const toString = (value: unknown, fallback = "") => {
  if (value == null) return fallback;
  return String(value).trim();
};

const toNumber = (value: unknown, fallback = 0) => {
  if (value == null || value === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toBoolean = (value: unknown, fallback = false) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
    if (normalized === "1") return true;
    if (normalized === "0") return false;
  }
  return fallback;
};

const toGTSType = (value: unknown) => toString(value).toUpperCase();

export const mapSAPKey = (raw: any): SAPKey => ({
  id: toString(raw?.id ?? raw?.Id),
  satKey: toString(raw?.satKey ?? raw?.sat_key),
  descriptionSatKey: toString(
    raw?.descriptionSatKey ?? raw?.description_sat_key,
  ),
  internalKey: toString(raw?.internalKey ?? raw?.internal_key),
  descriptionInternalKey: toString(
    raw?.descriptionInternalKey ?? raw?.description_internal_key,
  ),
  gtsType: toGTSType(
    raw?.gtsType ?? raw?.gtStype ?? raw?.gts_type ?? raw?.GTSType,
  ),
  iva: toNumber(raw?.iva, 0),
  isActive: toBoolean(raw?.isActive ?? raw?.is_active, true),
});

export const mapSAPKeys = (raw: any): SAPKey[] =>
  Array.isArray(raw) ? raw.map(mapSAPKey) : [];

export const mapSAPKeyPost = (
  payload: Partial<SAPKeyPost> | any,
): SAPKeyPost => ({
  satKey: toString(payload?.satKey ?? payload?.sat_key),
  descriptionSatKey: toString(
    payload?.descriptionSatKey ?? payload?.description_sat_key,
  ),
  internalKey: toString(payload?.internalKey ?? payload?.internal_key),
  descriptionInternalKey: toString(
    payload?.descriptionInternalKey ?? payload?.description_internal_key,
  ),
  gtsType: toGTSType(
    payload?.gtsType ??
      payload?.gtStype ??
      payload?.gts_type ??
      payload?.GTSType,
  ),
  iva: toNumber(payload?.iva, 0),
});

export const mapSAPKeyPut = (payload: Partial<SAPKeyPut> | any): SAPKeyPut => ({
  id: toString(payload?.id ?? payload?.Id),
  satKey: toString(payload?.satKey ?? payload?.sat_key),
  descriptionSatKey: toString(
    payload?.descriptionSatKey ?? payload?.description_sat_key,
  ),
  internalKey: toString(payload?.internalKey ?? payload?.internal_key),
  descriptionInternalKey: toString(
    payload?.descriptionInternalKey ?? payload?.description_internal_key,
  ),
  gtsType: toGTSType(
    payload?.gtsType ??
      payload?.gtStype ??
      payload?.gts_type ??
      payload?.GTSType,
  ),
  iva: toNumber(payload?.iva, 0),
});
