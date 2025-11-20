import { mapCompleteTransport } from "../transport/transport.mapper";
import { mapEmployee } from "../employees/employee.mapper";
import { mapExternalPerson } from "../externalperson/externalperson.mapper";
import { mapProyectLocation } from "../locations/location.mapper";
import { mapEnterprise } from "../enterprises/enterprises.mapper";
import type {
  AccesPost,
  AccesPut,
  AccesRequirmentGet,
  Tools,
} from "./accesrequest.types";
import type { CompleteTransport } from "../transport/transport.types";
import type { EmployeeType } from "../employees/employee.types";
import type { ExternalPersonModel } from "../externalperson/externalperson.types";

const toString = (value: unknown, fallback = "") =>
  value == null ? fallback : String(value);

const toOptionalString = (value: unknown) => {
  if (value == null) return undefined;
  const v = String(value);
  return v.trim() === "" ? undefined : v;
};

// Tries to parse JSON if it is a string; otherwise returns value as-is
const parseMaybeJson = <T = any>(val: any): T | undefined => {
  if (val == null) return undefined as any;
  if (typeof val === "string") {
    try {
      return JSON.parse(val) as T;
    } catch {
      return undefined as any;
    }
  }
  if (typeof val === "object") return val as T;
  return undefined as any;
};

const mapTool = (raw: any): Tools => ({
  quantity: toString(raw?.quantity),
  description: toString(raw?.description),
  brand: toString(raw?.brand),
  model: toString(raw?.model),
  serialnumber: toString(raw?.serialnumber ?? raw?.serialNumber ?? raw?.serial_number),
  materialtype:raw?.materialtype,
  meditiontype:raw?.meditiontype
});

const mapTools = (raw: unknown): Tools[] => {
  const parsed = parseMaybeJson<any[]>(raw) ?? (Array.isArray(raw) ? (raw as any[]) : []);
  return Array.isArray(parsed) ? parsed.map(mapTool) : [];
};

const mapVehicles = (raw: unknown): CompleteTransport[] => {
  const list = Array.isArray(raw) ? raw : parseMaybeJson<any[]>(raw) ?? [];
  return Array.isArray(list) ? list.map(mapCompleteTransport) : [];
};

const mapInternalPersons = (raw: unknown): EmployeeType[] => {
  const list = Array.isArray(raw) ? raw : parseMaybeJson<any[]>(raw) ?? [];
  return Array.isArray(list) ? list.map(mapEmployee) : [];
};

const mapExternalPersonsList = (raw: unknown): ExternalPersonModel[] => {
  const list = Array.isArray(raw) ? raw : parseMaybeJson<any[]>(raw) ?? [];
  return Array.isArray(list) ? list.map(mapExternalPerson) : [];
};

export const mapAccesRequirement = (raw: any): AccesRequirmentGet => ({
  id: toString(raw?.id ?? raw?.access_requirement_id),
  location: mapProyectLocation(raw?.id_location ?? raw?.location_id),
  external_enterprise: mapEnterprise(
    raw?.id_external_enterprise ?? raw?.external_enterprise_id ?? raw?.enterprise_id
  ),
  location_responsible: toString(raw?.location_responsible ?? raw?.responsible_name),
  location_workposition: toString(
    raw?.location_workposition ?? raw?.responsible_workposition ?? raw?.workposition
  ),
  vehicles: mapVehicles(raw?.vehicles),
  internalpersons: mapInternalPersons(raw?.internalpersons ?? raw?.internal_persons),
  externalpersons: mapExternalPersonsList(
    raw?.externalpersons ?? raw?.external_persons ?? raw?.externalPersonnel
  ),
  tools: mapTools(raw?.tools),
  dateCreate: toString(raw?.dateCreate),
  createdBy: toString(raw?.createdBy ?? raw?.created_by),
  status: toString(raw?.status) as AccesRequirmentGet["status"],
  motive: toString(raw?.motive ?? raw?.reason),
  start_date: toString(raw?.start_date ?? raw?.startDate),
  end_date: toString(raw?.end_date ?? raw?.endDate),
  dr_responsiblename: toString(raw?.dr_responsiblename ?? raw?.dr_responsible_name),
  dr_responsiblesignature: toString(
    raw?.dr_responsiblesignature ?? raw?.dr_responsible_signature ?? raw?.signature
  ),
  evidence_send_email: toString(raw?.evidence_send_email),
  evidence_response_email: toString(raw?.evidence_response_email),
  internal_comments: toString(raw?.internal_comments),
  external_comments: toString(raw?.external_comments)
});

export const mapAccesRequirements = (list: any[] | undefined): AccesRequirmentGet[] =>
  Array.isArray(list) ? list.map(mapAccesRequirement) : [];

// Helpers to normalize IDs array (accepts array of strings or array of objects)
const extractId = (x: any): string => {
  if (typeof x === "string") return x;
  if (!x || typeof x !== "object") return "";
  return (
    x?.id ??
    x?.transport_id ??
    x?.employee_id ??
    x?.external_person_id ??
    x?.externalperson_id ??
    x?.external_person?.id ??
    x?.vehicleassignments_id ??
    x?.value ??
    ""
  );
};

const toIdArray = (val: any): string[] => {
  const arr = Array.isArray(val) ? val : parseMaybeJson<any[]>(val) ?? [];
  return arr.map(extractId).filter((x) => String(x).trim() !== "");
};

export const mapAccesPost = (payload: Partial<AccesPost> | any): AccesPost => ({
  id_location: toString(payload?.id_location ?? payload?.location_id),
  id_external_enterprise: toOptionalString(
    payload?.id_external_enterprise ?? payload?.external_enterprise_id ?? payload?.enterprise_id
  ),
  location_responsible: toString(payload?.location_responsible),
  location_workposition: toString(payload?.location_workposition),
  vehicles: toIdArray(payload?.vehicles),
  internalpersons: toIdArray(payload?.internalpersons ?? payload?.internal_persons),
  externalpersons: toIdArray(payload?.externalpersons ?? payload?.external_persons),
  tools: JSON.stringify(payload?.tools),
  motive: toString(payload?.motive ?? payload?.reason),
  start_date: toString(payload?.start_date ?? payload?.startDate),
  end_date: toString(payload?.end_date ?? payload?.endDate),
  dr_responsiblename: toString(payload?.dr_responsiblename ?? payload?.dr_responsible_name),
  dr_responsiblesignature: toString(
    payload?.dr_responsiblesignatue ?? payload?.dr_responsible_signature ?? payload?.signature
  ),
});

export const mapAccesPut = (payload: Partial<AccesPut> | any): AccesPut => ({
  id: toString(payload?.id ?? payload?.access_requirement_id),
  id_location: toString(payload?.id_location ?? payload?.location_id),
  id_external_enterprise: toOptionalString(
    payload?.id_external_enterprise ?? payload?.external_enterprise_id ?? payload?.enterprise_id
  ),
  location_responsible: toString(payload?.location_responsible),
  location_workposition: toString(payload?.location_workposition),
  vehicles: toIdArray(payload?.vehicles),
  internalpersons: toIdArray(payload?.internalpersons ?? payload?.internal_persons),
  externalpersons: toIdArray(payload?.externalpersons ?? payload?.external_persons),
  tools: JSON.stringify(payload?.tools),
  id_status: toString(payload?.id_status),
  motive: toString(payload?.motive ?? payload?.reason),
  start_date: toString(payload?.start_date ?? payload?.startDate),
  end_date: toString(payload?.end_date ?? payload?.endDate),
  dr_responsiblename: toString(payload?.dr_responsiblename ?? payload?.dr_responsible_name),
  dr_responsiblesignature: toString(
    payload?.dr_responsiblesignatue ?? payload?.dr_responsible_signature ?? payload?.signature
  ),
  evidence_send_email: toString(payload?.evidence_send_email),
  evidence_response_email: toString(payload?.evidence_response_email),
  internal_comments: toString(payload?.evidence_response_email),
  external_comments: toString(payload?.evidence_response_email)
});

// Some APIs expect tools as a serialized string. Provide helpers if needed.
export const serializeTools = (tools: Tools[] | unknown): string => {
  try {
    const list = mapTools(tools);
    return JSON.stringify(list);
  } catch {
    return "[]";
  }
};

