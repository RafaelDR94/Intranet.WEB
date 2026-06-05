import type {
  SAPKey,
  SAPKeyPost,
  SAPKeyPut,
} from "@/app/mappings/sapkeys/sapkeys.types";

export type SAPKeysState = {
  sapKeys: SAPKey[];
  sapKey?: SAPKey;

  loadingSAPKeys: boolean;
  loadingSAPKey: boolean;
  creatingSAPKey: boolean;
  updatingSAPKey: boolean;
  deletingSAPKey: boolean;

  successGetSAPKeys: boolean;
  successGetSAPKey: boolean;
  successCreateSAPKey: boolean;
  successUpdateSAPKey: boolean;
  successDeleteSAPKey: boolean;

  error?: string;
  warning?: string;

  fetchSAPKeys: (force?: boolean) => Promise<SAPKey[] | null>;
  fetchSAPKeyById: (id: string, force?: boolean) => Promise<SAPKey | null>;
  createSAPKey: (payload: SAPKeyPost) => Promise<SAPKey | null>;
  updateSAPKey: (payload: SAPKeyPut) => Promise<SAPKey | null>;
  deleteSAPKey: (id: string) => Promise<boolean>;

  reset: () => void;
  resetFlags: () => void;
};

export type Set = (
  partial:
    | Partial<SAPKeysState>
    | ((state: SAPKeysState) => Partial<SAPKeysState>),
) => void;

export type Get = () => SAPKeysState;
