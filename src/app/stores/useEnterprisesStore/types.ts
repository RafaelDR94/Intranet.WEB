import type {
  Enterprise,
  EnterprisePost,
  EnterprisePut,
  ExternalEnterprisePost,
} from "@/app/mappings/enterprises/enterprises.types";
import type { WorkPositionType } from "@/app/mappings/workposition/workposition.types";

export type WorkpositionsMap = Record<string, WorkPositionType[]>;

export type EnterprisesState = {
  /** Lista de empresas disponibles */
  enterprises: Enterprise[];
  /** Cache de puestos por empresa (clave enterpriseId o "__all__") */
  workpositionsByEnterprise: WorkpositionsMap;
  /** Cache de puestos por departamento */
  workpositionsByDepartment: WorkpositionsMap;
  /** Listado activo de puestos tras la ultima consulta */
  workpositions: WorkPositionType[];
  /** Identificador de empresa usada en la ultima consulta de puestos */
  currentEnterpriseId?: string;
  /** Identificador de departamento usado en la ultima consulta de puestos */
  currentDepartmentId?: string;

  /** Flags de proceso */
  loadingEnterprises: boolean;
  loadingWorkpositions: boolean;
  creating: boolean;
  updating: boolean;

  /** Flags de exito */
  successGetEnterprises: boolean;
  successGetWorkpositions: boolean;
  successPost: boolean;
  successPut: boolean;

  /** Mensajes de error / advertencia */
  error?: string;
  warning?: string;

  fetchEnterprises: (force?: boolean) => Promise<void>;
  fetchWorkpositions: (
    enterpriseId?: string,
    force?: boolean
  ) => Promise<WorkPositionType[]>;
  fetchWorkpositionsByDepartment: (
    departmentId: string,
    force?: boolean
  ) => Promise<WorkPositionType[]>;
  createEnterprise: (payload: EnterprisePost) => Promise<Enterprise | null>;
  updateEnterprise: (payload: EnterprisePut) => Promise<Enterprise | null>;
  createExternalEnterprise: (
    payload: ExternalEnterprisePost
  ) => Promise<Enterprise | null>;
  reset: () => void;
  resetFlags: () => void;
};

export type Set = (
  partial:
    | Partial<EnterprisesState>
    | ((state: EnterprisesState) => Partial<EnterprisesState>)
) => void;

export type Get = () => EnterprisesState;
