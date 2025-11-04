import type { DepartmentType } from "../department/department.types";
import type { UserType } from "../users/user.types";
import type { WorkPositionType } from "../workposition/workposition.types";

export type EmployeeType = {
  id:string;
  employee_id: string;
  employee_number: string;
  firstname: string;
  secondname: string;
  lastname: string;
  motherlast_name: string | null;
  gender: string;
  email: string;
  phone_number: string;
  extension: string;
  image_url: string;
  manager_id: string;
  department: DepartmentType;
  workposition: WorkPositionType;
  user: UserType | null;
  is_active: boolean;
  fullname: string;
};

type BaseEmployeePayload = {
  employee_number?: string;
  firstname: string;
  secondname: string;
  lastname: string;
  motherlast_name: string;
  gender: string;
  email?: string;
  phone_number?: string;
  extension?: string;
  image_url?: string;
  department_id: string;
  workposition_id: string;
  manager_id?: string;
};

type BaseEmployeePayloadPut = {
  employee_id:string;
  employee_number?: string;
  firstname: string;
  secondname: string;
  lastname: string;
  motherlast_name: string;
  gender: string;
  email?: string;
  phone_number?: string;
  extension?: string;
  image_url?: string;
  department_id: string;
  workposition_id: string;
  manager_id?: string;
};
export type PostEmployees = BaseEmployeePayload;

export type PutEmployees = BaseEmployeePayloadPut;
