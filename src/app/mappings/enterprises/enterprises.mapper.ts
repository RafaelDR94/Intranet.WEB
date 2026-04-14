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
  companytype: toString(raw?.companytype),
  rfc: toString(raw?.rfc),
  businessindustry: toString(raw?.businessindustry),
  imgurl: toString(
    raw?.imgurl ?? raw?.imgUrl ?? raw?.image_url ?? raw?.imageUrl
  ),
  is_external: raw?.is_external,
  departments: Array.isArray(raw?.departments)
    ? raw.departments.map(mapEnterpriseDepartment)
    : [],
});

export const mapEnterprises = (list: any[] | undefined): Enterprise[] =>
  Array.isArray(list) ? list.map(mapEnterprise) : [];

// Payload mappers
export const mapEnterprisePost = (
  payload: Partial<EnterprisePost> | any
): EnterprisePost => {
  const enterpriseId = toString(payload?.enterprise_id ?? payload?.id, "");
  return {
    ...(enterpriseId ? { enterprise_id: enterpriseId } : {}),
    name: toString(payload?.name),
    companytype: toString(payload?.companytype),
    rfc: toString(payload?.rfc),
    businessindustry: toString(payload?.businessindustry),
    imgurl: toString(payload?.imgurl),
  };
};

export const mapEnterprisePut = (
  payload: Partial<EnterprisePut> | any
): EnterprisePut => ({
  enterprise_id: toString(payload?.enterprise_id ?? payload?.id),
  name: toString(payload?.name),
  companytype: toString(payload?.companytype),
  rfc: toString(payload?.rfc),
  businessindustry: toString(payload?.businessindustry),
  is_external: Boolean(payload?.is_external),
  imgurl: toString(payload?.imgurl),
});

export const mapExternalEnterprisePost = (
  payload: Partial<ExternalEnterprisePost> | any
): ExternalEnterprisePost => ({
  newEnterprise: toString(payload?.newEnterprise),
  RFC: toString(payload?.RFC)
});
