export type DepartmentEnterprise = {
  enterprise_id: string;
  name: string;
};

export type DepartmentPosition = {
  name: string;
};

export type DepartmentPost = {
  name: string;
  description?: string;
  enterprise_id: string;
  workpositions: string[];
};

export type DepartmentPut = DepartmentPost & {
  department_id: string;
};

export type DepartmentType = {
  department_id: string;
  name: string;
  enterprise_id: string;
  enterprice_name: string;
  description?: string;
  enterprises?: DepartmentEnterprise[];
  positions?: DepartmentPosition[];
};
