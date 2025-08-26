import { DepartmentType } from "./department.types";

export const mapDepartment = (dep: any): DepartmentType => ({
  department_id: dep?.department_id,
  name: dep?.name,
  enterprise_id: dep?.enterprise_id,
  enterprice_name: dep?.enterprice_name,
});

export const mapDepartments = (deps: any[]): DepartmentType[] => deps.map(mapDepartment);
