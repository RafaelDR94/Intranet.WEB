import { mapDepartment } from "../department/department.mapper";
import { mapUser } from "../users/user.mapper";
import { mapWorkPosition } from "../workposition/workposition.mapper";

import type { EmployeeType, PostEmployees, PutEmployees } from "./employee.types";

const toString = (value: unknown, fallback = "") =>
  value == null ? fallback : String(value);

const toOptionalString = (value: unknown) => {
  if (value == null) return undefined;
  const str = String(value);
  return str.trim() === "" ? undefined : str;
};

const toNullableString = (value: unknown) => {
  if (value == null) return null;
  const str = String(value);
  return str.trim() === "" ? null : str;
};

const toBoolean = (value: unknown, fallback = false) =>
  value == null ? fallback : Boolean(value);

export const mapEmployee = (emp: any): EmployeeType => ({
  id: toString(emp?.employee_id),
  employee_id: toString(emp?.employee_id ?? emp?.id),
  employee_number: toString(emp?.employee_number),
  firstname: toString(emp?.firstname),
  secondname: toString(emp?.secondname),
  lastname: toString(emp?.lastname),
  motherlast_name: toNullableString(emp?.motherlast_name),
  gender: toString(emp?.gender),
  email: toString(emp?.email),
  phone_number: toString(emp?.phone_number),
  extension: toString(emp?.extension),
  image_url: toString(emp?.image_url),
  manager_id: toString(emp?.manager_id),
  department: mapDepartment(emp?.department ?? {}),
  workposition: mapWorkPosition(emp?.workposition ?? {}),
  user: emp?.user ? mapUser(emp.user) : null,
  is_active: toBoolean(emp?.is_active),
  fullname: toString(
    emp?.fullname ?? [emp?.firstname, emp?.secondname, emp?.lastname, emp?.motherlast_name]
      .filter((part) => part != null && String(part).trim() !== "")
      .join(" ")
  ),
});

export const mapEmployees = (emps: any[] | undefined): EmployeeType[] =>
  Array.isArray(emps) ? emps.map(mapEmployee) : [];

export const mapEmployeePost = (payload: Partial<PostEmployees> | any): PostEmployees => ({
  employee_number: toOptionalString(payload?.employee_number),
  firstname: toString(payload?.firstname),
  secondname: toString(payload?.secondname),
  lastname: toString(payload?.lastname),
  motherlast_name: toString(payload?.motherlast_name),
  gender: toString(payload?.gender),
  email: toOptionalString(payload?.email),
  phone_number: toOptionalString(payload?.phone_number),
  extension: toOptionalString(payload?.extension),
  image_url: toOptionalString(payload?.image_url),
  department_id: toString(payload?.department_id),
  workposition_id: toString(payload?.workposition_id),
  manager_id: toOptionalString(payload?.manager_id),
});

export const mapEmployeePut = (payload: Partial<PutEmployees> | any): PutEmployees => ({

  employee_id: toString(payload.employee_id),
  employee_number: toOptionalString(payload?.employee_number),
  firstname: toString(payload?.firstname),
  secondname: toString(payload?.secondname),
  lastname: toString(payload?.lastname),
  motherlast_name: toString(payload?.motherlast_name),
  gender: toString(payload?.gender),
  email: toOptionalString(payload?.email),
  phone_number: toOptionalString(payload?.phone_number),
  extension: toOptionalString(payload?.extension),
  image_url: toOptionalString(payload?.image_url),
  department_id: toString(payload?.department_id),
  workposition_id: toString(payload?.workposition_id),
  manager_id: toOptionalString(payload?.manager_id),
});
