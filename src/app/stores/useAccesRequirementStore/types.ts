import type {
  AccesPost,
  AccesPut,
  AccesRequirmentGet,
} from "@/app/mappings/accesrequest/accesrequest.types";

export type AccesRequirementsState = {
  // Collections
  accesRequirements: AccesRequirmentGet[];
  current?: AccesRequirmentGet;

  // Flags
  loading: boolean;
  loadingById: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  templating: boolean;

  // Success flags
  successGet: boolean;
  successGetById: boolean;
  successPost: boolean;
  successPut: boolean;
  successDelete: boolean;
  successTemplate: boolean;

  // Errors
  error?: string;
  warning?: string;
  templateError?: string;

  // Actions
  fetchAccesRequirements: (force?: boolean) => Promise<AccesRequirmentGet[] | null>;
  fetchAccesRequirementById: (id: string, force?: boolean) => Promise<AccesRequirmentGet | null>;
  createAccesRequirement: (payload: AccesPost) => Promise<AccesRequirmentGet | null>;
  updateAccesRequirement: (payload: AccesPut) => Promise<AccesRequirmentGet | null>;
  updateInternalComments: (payload: import("@/app/mappings/accesrequest/accesrequest.types").AccesInternalCommentsPut) => Promise<AccesRequirmentGet | null>;
  updateExternalComments: (payload: import("@/app/mappings/accesrequest/accesrequest.types").AccesExternalCommentsPut) => Promise<AccesRequirmentGet | null>;
  deleteAccesRequirement: (id: string) => Promise<boolean>;
  generateTemplate: (id: string) => Promise<any>;

  reset: () => void;
  resetFlags: () => void;

  setCurrent: (acces: AccesRequirmentGet | undefined) => void
};

export type Set = (
  partial:
    | Partial<AccesRequirementsState>
    | ((state: AccesRequirementsState) => Partial<AccesRequirementsState>)
) => void;

export type Get = () => AccesRequirementsState;

