import { mapDepartment } from "../department/department.mapper";
import { mapUser } from "../users/user.mapper";
import { mapWorkPosition } from "../workposition/workposition.mapper";

import { EmployeeType } from "./employee.types";

export const mapEmployee = (emp: any): EmployeeType => ({
  employee_id: emp?.employee_id ?? emp?.id,
  employee_number: emp?.employee_number,
  firstname: emp?.firstname,
  secondname: emp?.secondname,
  lastname: emp?.lastname,
  motherlast_name: emp?.motherlast_name,
  gender: emp?.gender,
  email: emp?.email,
  phone_number: emp?.phone_number,
  extension: emp?.extension,
  image_url: emp?.image_url,
  manager_id: emp?.manager_id,
  department: mapDepartment(emp?.department),
  workposition: mapWorkPosition(emp?.workposition),
  user: emp?.user ? mapUser(emp.user) : null,
  is_active: emp?.is_active,
  fullname: emp?.fullname,
});

export const mapEmployees = (emps: any[]): EmployeeType[] => emps.map(mapEmployee);
