import { mapEnterprise } from "../enterprises/enterprises.mapper";
import type {
  ExternalPersonModel,
  ExternalPersonPost,
  ExternalPersonPut,
} from "./externalperson.types";
import type { Enterprise } from "../enterprises/enterprises.types";

const toString = (value: unknown, fallback = "") =>
  value == null ? fallback : String(value);

const toOptionalString = (value: unknown) => {
  if (value == null) return undefined;
  const str = String(value);
  return str.trim() === "" ? undefined : str;
};

const ensureEnterprise = (raw: any): Enterprise => {
  if (raw?.enterprise) return mapEnterprise(raw.enterprise);
  const id = toString(
    raw?.id_enterprise ?? raw?.enterprise_id ?? raw?.enterprise?.id
  );
  const name = toString(raw?.enterprise_name ?? raw?.enterprise?.name);
  return {
    enterprise_id: id,
    name,
    departments: Array.isArray(raw?.enterprise?.departments)
      ? raw.enterprise.departments
      : [],
  } as Enterprise;
};

export const mapExternalPerson = (raw: any): ExternalPersonModel => ({
  id: toString(raw?.id ?? raw?.external_person_id ?? raw?.externalperson_id),
  enterprise: ensureEnterprise(raw),
  frontal_ine_json: toString(raw?.frontal_ine_json),
  back_ine_json: toString(raw?.back_ine_json),
  license_json: toString(raw?.license_json),
  pictureURL: toString(raw?.pictureURL ?? raw?.picture_url ?? raw?.image_url),
  frontal_ine_url: toString(raw?.frontal_ine_url),
  back_ine_url: toString(raw?.back_ine_url),
  license_url: toOptionalString(raw?.license_url),
  name: toString(raw?.name),
  lastname: toString(raw?.lastname),
  motherslastname: toString(raw?.motherslastname),
  curp: toString(raw?.curp),
  electorkey: toString(raw?.electorkey),
  electorvigence: toString(raw?.electorvigence),
  nss: toString(raw?.nss),
  license_number: toString(raw?.license_number),
  vigence: toString(raw?.vigence),
  phone_number: toString(raw?.phone_number),
  email: toString(raw?.email),
});

export const mapExternalPersons = (
  list: any[] | undefined
): ExternalPersonModel[] => (Array.isArray(list) ? list.map(mapExternalPerson) : []);

export const mapExternalPersonPost = (
  payload: Partial<ExternalPersonPost> | any
): ExternalPersonPost => ({
  id_enterprise: toString(
    payload?.id_enterprise ?? payload?.enterprise?.enterprise_id ?? payload?.enterprise_id
  ),
  frontal_ine_json: toString(payload?.frontal_ine_json),
  back_ine_json: toString(payload?.back_ine_json),
  license_json: toString(payload?.license_json),
  pictureURL: toString(payload?.pictureURL ?? payload?.picture_url ?? payload?.image_url),
  frontal_ine_url: toString(payload?.frontal_ine_url),
  back_ine_url: toString(payload?.back_ine_url),
  license_url: toOptionalString(payload?.license_url),
  name: toString(payload?.name),
  lastname: toString(payload?.lastname),
  motherslastname: toString(payload?.motherslastname),
  curp: toString(payload?.curp),
  electorkey: toString(payload?.electorkey),
  electorvigence: toString(payload?.electorvigence),
  nss: toString(payload?.nss),
  license_number: toString(payload?.license_number),
  vigence: toString(payload?.vigence),
  phone_number: toString(payload?.phone_number),
  email: toString(payload?.email),
});

export const mapExternalPersonPut = (
  payload: Partial<ExternalPersonPut> | any
): ExternalPersonPut => ({
  id: toString(payload?.id),
  id_enterprise: toString(
    payload?.id_enterprise ?? payload?.enterprise?.enterprise_id ?? payload?.enterprise_id
  ),
  frontal_ine_json: toString(payload?.frontal_ine_json),
  back_ine_json: toString(payload?.back_ine_json),
  license_json: toString(payload?.license_json),
  pictureURL: toString(payload?.pictureURL ?? payload?.picture_url ?? payload?.image_url),
  frontal_ine_url: toString(payload?.frontal_ine_url),
  back_ine_url: toString(payload?.back_ine_url),
  license_url: toOptionalString(payload?.license_url),
  name: toString(payload?.name),
  lastname: toString(payload?.lastname),
  motherslastname: toString(payload?.motherslastname),
  curp: toString(payload?.curp),
  electorkey: toString(payload?.electorkey),
  electorvigence: toString(payload?.electorvigence),
  nss: toString(payload?.nss),
  license_number: toString(payload?.license_number),
  vigence: toString(payload?.vigence),
  phone_number: toString(payload?.phone_number),
  email: toString(payload?.email),
});

