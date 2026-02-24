import { EmployeeType } from "../employees/employee.types";
import { Enterprise, Department } from "../enterprises/enterprises.types";
import { Proyect } from "../proyects/proyects.types";
import type { Status } from "../status/status.types";

export type StatusAuthorization = "Pendiente" | "Aprobada" | "Rechazada" | "Cancelada";

export type AuthorizationType = {
  id: string;
  name: string;
};

export type AuthorizationStatus = Status;

export type Authorization = {
  authorization_id: string;
  applicant: EmployeeType;
  authorizer: EmployeeType;
  enterprise: Enterprise;
  department?: Department;
  kind: AuthorizationType;
  dateCreated: string;
  status: AuthorizationStatus;
  proyect?: Proyect;
  event_id: string;
  comment?: string;
};

export type PostAuthorization = {
  authorization_id: string;
  applicant_id: string;
  authorizer_id: string;
  enterprise_id: string;
  department_id: string;
  kind: string;
  proyect_id?: string;
  event_id: string;
  comments?: string;
};

export type PutAuthorizer = {
  authorizer_id: string;
};

export type PutStatusAuthorization = {
  status: StatusAuthorization;
};
