// src/app/stores/employees/types.ts
import type {
  EmployeeType,
  PostEmployees,
  PutEmployees,
} from "@/app/mappings/employees/employee.types";

/**
 * Payload expected by the update employee endpoint.
 */
export type UpdateEmployeePayload = PutEmployees & {
  employee_id: string;
};

/**
 * Zustand store shape for the employees catalog.
 */
export type EmployeesState = {
  /** Employees list as returned by the API */
  employees: EmployeeType[];
  /** Only active employees cached from the API */
  activeEmployees: EmployeeType[];
  /** Employees cached for the selected department */
  departmentEmployees: EmployeeType[];
  /** Department id associated to cached employees */
  departmentEmployeesDepartmentId?: string;
  /** Currently selected employee (detail) */
  employee?: EmployeeType;

  /** Loading list flag */
  loading: boolean;
  /** Loading detail flag */
  loadingById: boolean;
  /** Loading active employees flag */
  loadingActive: boolean;
  /** Loading employees by department flag */
  loadingByDepartment: boolean;
  /** Create request in progress */
  creating: boolean;
  /** Update request in progress */
  updating: boolean;
  /** Delete request in progress */
  deleting: boolean;
  /** Activate/deactivate request in progress */
  activating: boolean;

  /** Success flags */
  successGet: boolean;
  successGetById: boolean;
  successGetActive: boolean;
  successGetByDepartment: boolean;
  successPost: boolean;
  successPut: boolean;
  successDelete: boolean;
  successActivate: boolean;

  /** Last error message */
  error?: string;
  /** Warning message returned by the API */
  warning?: string;

  /** Fetch full employees list */
  fetchEmployees: (force?: boolean) => Promise<void>;
  /** Fetch only active employees */
  fetchActiveEmployees: (force?: boolean) => Promise<void>;
  /** Fetch employees by department id */
  fetchEmployeesByDepartment: (
    departmentId: string,
    force?: boolean
  ) => Promise<EmployeeType[]>;
  /** Fetch an employee by identifier */
  fetchEmployeeById: (id: string, force?: boolean) => Promise<EmployeeType | null>;
  /** Create a new employee */
  createEmployee: (payload: PostEmployees) => Promise<EmployeeType | null>;
  /** Update an existing employee */
  updateEmployee: (payload: UpdateEmployeePayload) => Promise<EmployeeType | null>;
  /** Delete an employee */
  deleteEmployee: (id: string) => Promise<boolean>;
  /** Activate or reactive an employee */
  activateEmployee: (id: string) => Promise<EmployeeType | null>;
  /** Force revalidation ignoring cache */
  forceFetchEmployees: () => Promise<void>;
  /** Reset store to initial state */
  reset: () => void;
  /** Reset only process flags and messages */
  resetFlags: () => void;
  resetEmployee: () => void;
  setCurrentEmployee: (employee: EmployeeType) => void
};

export type Set = (
  partial:
    | Partial<EmployeesState>
    | ((s: EmployeesState) => Partial<EmployeesState>)
) => void;

export type Get = () => EmployeesState;

