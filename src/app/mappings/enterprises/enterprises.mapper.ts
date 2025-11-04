import type { Department, Enterprise } from "./enterprises.types";

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
  departments: Array.isArray(raw?.departments)
    ? raw.departments.map(mapEnterpriseDepartment)
    : [],
});

export const mapEnterprises = (list: any[] | undefined): Enterprise[] =>
  Array.isArray(list) ? list.map(mapEnterprise) : [];
