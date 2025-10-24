// src/app/stores/employees/types.ts
import type { EmployeeType } from "@/app/mappings/employees/employee.types";

/**
 * Shape of the employees store state.
 */
export type EmployeesState = {
  /** Lista de empleados disponibles */
  employees: EmployeeType[];
  /** Indica si se esta cargando la lista de empleados */
  loading: boolean;
  /** Indica si se esta cargando un empleado individual */
  loadingById: boolean;
  /** Mensaje de error de la ultima operacion */
  error?: string;
  /** Empleado obtenido mediante consulta puntual */
  employee?: EmployeeType;
  /** Dispara la obtencion de empleados del backend */
  fetchEmployees: (force?: boolean) => Promise<void>;
  /** Obtiene un empleado por su identificador */
  fetchEmployeeById: (id: string, force?: boolean) => Promise<EmployeeType | null>;
  /** Forza el refetch ignorando cache */
  forceFetchEmployees: () => Promise<void>;
  /** Limpia el estado */
  reset: () => void;
};

export type Set = (
  partial:
    | Partial<EmployeesState>
    | ((s: EmployeesState) => Partial<EmployeesState>)
) => void;

export type Get = () => EmployeesState;

