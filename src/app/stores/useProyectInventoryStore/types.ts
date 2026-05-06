import type {
  GenericEquipment,
  GenericEquipmentPost,
  GenericEquipmentPut,
  GenericEquipmentSparePart,
  GenericEquipmentSparePartPost,
  GenericEquipmentSparePartPut,
  SparePart,
  SparePartPost,
  SparePartPut,
} from "@/app/mappings/inventory/inventory.types";

export type ProyectInventoryState = {
  genericEquipments: GenericEquipment[];
  spareParts: SparePart[];
  sparePartsByProyect: SparePart[];
  sparePartsByDevice: SparePart[];
  sparePartsByGenericEquipment: SparePart[];
  genericEquipmentSpareParts: GenericEquipmentSparePart[];
  currentGenericEquipment: GenericEquipment | null;
  lastSparePartsIsActive: boolean | null;
  lastSparePartsByProyectId: string | null;
  lastSparePartsByDeviceId: string | null;
  lastSparePartsByGenericEquipmentId: string | null;
  lastGenericEquipmentSparePartsIsActive: boolean | null;
  lastGenericEquipmentId: string | null;

  loading: boolean;
  loadingCurrent: boolean;
  loadingSpareParts: boolean;
  loadingSparePartsByProyect: boolean;
  loadingSparePartsByDevice: boolean;
  loadingSparePartsByGenericEquipment: boolean;
  loadingGenericEquipmentSpareParts: boolean;
  creating: boolean;
  updating: boolean;
  removing: boolean;

  successGet: boolean;
  successGetCurrent: boolean;
  successGetSpareParts: boolean;
  successGetSparePartsByProyect: boolean;
  successGetSparePartsByDevice: boolean;
  successGetSparePartsByGenericEquipment: boolean;
  successGetGenericEquipmentSpareParts: boolean;
  successPost: boolean;
  successPut: boolean;
  successDelete: boolean;

  error?: string;

  fetchGenericEquipments: (force?: boolean) => Promise<GenericEquipment[]>;
  fetchGenericEquipmentById: (
    id: string,
    force?: boolean
  ) => Promise<GenericEquipment | null>;
  fetchSpareParts: (
    isActive?: boolean,
    force?: boolean
  ) => Promise<SparePart[]>;
  fetchSparePartsByProyectId: (
    idProyect: string,
    force?: boolean
  ) => Promise<SparePart[]>;
  fetchSparePartsByDeviceId: (
    idDevice: string,
    force?: boolean
  ) => Promise<SparePart[]>;
  fetchSparePartsByGenericEquipmentId: (
    idGenericEquipment: string,
    force?: boolean
  ) => Promise<SparePart[]>;
  fetchGenericEquipmentSpareParts: (
    isActive?: boolean,
    force?: boolean
  ) => Promise<GenericEquipmentSparePart[]>;

  createGenericEquipment: (
    payload: GenericEquipmentPost
  ) => Promise<GenericEquipment | null>;
  updateGenericEquipment: (
    payload: GenericEquipmentPut
  ) => Promise<GenericEquipment | null>;
  deleteGenericEquipment: (id: string) => Promise<boolean>;

  createSparePart: (payload: SparePartPost) => Promise<SparePart | null>;
  updateSparePart: (payload: SparePartPut) => Promise<SparePart | null>;
  deleteSparePart: (id: string) => Promise<boolean>;

  createGenericEquipmentSparePart: (
    payload: GenericEquipmentSparePartPost
  ) => Promise<GenericEquipmentSparePart | null>;
  updateGenericEquipmentSparePart: (
    payload: GenericEquipmentSparePartPut
  ) => Promise<GenericEquipmentSparePart | null>;
  deleteGenericEquipmentSparePart: (id: string) => Promise<boolean>;

  setCurrentGenericEquipment: (equipment: GenericEquipment | null) => void;
  clearCurrentGenericEquipment: () => void;
  reset: () => void;
  resetFlags: () => void;
};

export type SetProyectInventoryState = (
  partial:
    | Partial<ProyectInventoryState>
    | ((
        state: ProyectInventoryState
      ) => Partial<ProyectInventoryState>)
) => void;

export type GetProyectInventoryState = () => ProyectInventoryState;
