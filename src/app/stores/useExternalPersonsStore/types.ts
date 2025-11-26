import type {
  ExternalPersonModel,
  ExternalPersonPost,
  ExternalPersonPut,
} from "@/app/mappings/externalperson/externalperson.types";

export type ExternalPersonsByEnterprise = Record<string, ExternalPersonModel[]>;

export type ExternalPersonsState = {
  /** Listado general de personal externo */
  externalPersons: ExternalPersonModel[];
  /** Cache de personal por empresa */
  externalPersonsByEnterprise: ExternalPersonsByEnterprise;
  /** Detalle del personal externo */
  externalPerson?: ExternalPersonModel;
  /** Empresa actual usada para el listado */
  currentEnterpriseId?: string;

  /** Flags de proceso */
  loading: boolean;
  loadingByEnterprise: boolean;
  loadingById: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;

  /** Flags de exito */
  successGet: boolean;
  successGetByEnterprise: boolean;
  successGetById: boolean;
  successPost: boolean;
  successPut: boolean;
  successDelete: boolean;

  /** Mensajes */
  error?: string;
  warning?: string;

  /** Acciones */
  fetchExternalPersons: (force?: boolean) => Promise<void>;
  fetchExternalPersonsByEnterprise: (
    enterpriseId: string,
    force?: boolean
  ) => Promise<ExternalPersonModel[]>;
  fetchExternalPersonById: (
    id: string,
    force?: boolean
  ) => Promise<ExternalPersonModel | null>;
  createExternalPerson: (
    payload: ExternalPersonPost
  ) => Promise<ExternalPersonModel | null>;
  updateExternalPerson: (
    payload: ExternalPersonPut
  ) => Promise<ExternalPersonModel | null>;
  deleteExternalPerson: (id: string) => Promise<boolean>;

  reset: () => void;
  resetFlags: () => void;
};

export type Set = (
  partial:
    | Partial<ExternalPersonsState>
    | ((s: ExternalPersonsState) => Partial<ExternalPersonsState>)
) => void;

export type Get = () => ExternalPersonsState;

