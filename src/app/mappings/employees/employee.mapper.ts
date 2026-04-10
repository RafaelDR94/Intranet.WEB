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
  employee_number: toString(emp?.employee_number ?? emp?.employee),
  firstname: toString(emp?.firstname ?? emp?.name),
  secondname: toString(emp?.secondname ?? emp?.second_name),
  lastname: toString(emp?.lastname ?? emp?.father_lastname),
  motherlast_name: toNullableString(emp?.motherlast_name ?? emp?.mother_lastname),
  gender: toString(emp?.gender),
  email: toString(emp?.email ?? emp?.employee_email),
  phone_number: toString(emp?.phone_number ?? emp?.employee_phone),
  extension: toString(emp?.extension),
  image_url: toString(emp?.image_url ?? emp?.image_profile),
  manager_id: toString(emp?.manager_id),
  department: mapDepartment(
    emp?.department ?? {
      department_id: emp?.department_id,
      name: emp?.department_name ?? emp?.department,
      enterprise_id: emp?.id_enterprise ?? emp?.enterprise_id,
      enterprise_name: emp?.enterprise_name ?? emp?.enterprice_name,
    },
  ),
  gtstype: toString(emp?.gtstype),
  workposition: mapWorkPosition(
    emp?.workposition ?? {
      workposition_id: emp?.workposition_id,
      name: emp?.workposition_name,
    },
  ),
  user: emp?.user
    ? mapUser(emp.user)
    : emp?.user_id || emp?.username || emp?.role_id || emp?.role_name
    ? mapUser({
        user_id: emp?.user_id,
        username: emp?.username,
        role_id: emp?.role_id,
        role: {
          id: emp?.role_id,
          name: emp?.role_name,
        },
      })
    : null,
  is_active: toBoolean(emp?.is_active),
  fullname: toString(
    emp?.fullname ??
      [emp?.firstname ?? emp?.name,
      emp?.secondname ?? emp?.second_name,
      emp?.lastname ?? emp?.father_lastname,
      emp?.motherlast_name ?? emp?.mother_lastname]
      .filter((part) => part != null && String(part).trim() !== "")
      .join(" ")
  ),
  workposition_name: toString(
    emp?.workposition_name ??
      emp?.workposition?.name ??
      emp?.workposition?.workposition_name,
  ),
  employee_phone: toString(emp?.employee_phone ?? emp?.phone_number),
  employee_email: toString(emp?.employee_email ?? emp?.email),
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
  gtstype: toString(payload?.gtstype),
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
  gtstype: toString(payload?.gtstype),
});
