import type {
  Department,
  Enterprise,
  EnterprisePost,
  EnterprisePut,
  ExternalEnterprisePost,
} from "./enterprises.types";

const toString = (value: unknown, fallback = "") =>
  value == null ? fallback : String(value);

const mapEnterpriseDepartment = (dep: any): Department => ({
  department_id: toString(dep?.department_id ?? dep?.id),
  name: toString(dep?.name),
  enterprise_id: toString(dep?.enterprise_id),
  enterprice_name: toString(dep?.enterprice_name ?? dep?.enterprise_name),
});

export const mapEnterprise = (raw: any): Enterprise => ({
  enterprise_id: toString(raw?.enterprise_id ?? raw?.id),
  name: toString(raw?.name),
  is_external:(raw?.is_external),
  departments: Array.isArray(raw?.departments)
    ? raw.departments.map(mapEnterpriseDepartment)
    : [],
});

export const mapEnterprises = (list: any[] | undefined): Enterprise[] =>
  Array.isArray(list) ? list.map(mapEnterprise) : [];

// Payload mappers
export const mapEnterprisePost = (
  payload: Partial<EnterprisePost> | any
): EnterprisePost => ({
  newEnterprise: toString(payload?.newEnterprise),
});

export const mapEnterprisePut = (
  payload: Partial<EnterprisePut> | any
): EnterprisePut => ({
  enterprise_id: toString(payload?.enterprise_id ?? payload?.id),
  name: toString(payload?.name),
  is_external: Boolean(payload?.is_external),
});

export const mapExternalEnterprisePost = (
  payload: Partial<ExternalEnterprisePost> | any
): ExternalEnterprisePost => ({
  newEnterprise: toString(payload?.newEnterprise),
});
