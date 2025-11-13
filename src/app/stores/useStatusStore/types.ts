import type { Status, StatusPost, StatusPut } from "@/app/mappings/status/status.types";

export type StatusState = {
  statuses: Status[];
  current?: Status;

  loading: boolean;
  loadingById: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;

  successGet: boolean;
  successGetById: boolean;
  successPost: boolean;
  successPut: boolean;
  successDelete: boolean;

  error?: string;
  warning?: string;

  fetchStatuses: (force?: boolean) => Promise<void>;
  fetchStatusById: (id: string, force?: boolean) => Promise<Status | null>;
  fetchStatusesByType: (type: string) => Promise<Status[]>;
  createStatus: (payload: StatusPost) => Promise<Status | null>;
  updateStatus: (payload: StatusPut) => Promise<Status | null>;
  deleteStatus: (id: string) => Promise<boolean>;

  reset: () => void;
  resetFlags: () => void;
};

export type Set = (
  partial: Partial<StatusState> | ((state: StatusState) => Partial<StatusState>)
) => void;

export type Get = () => StatusState;

