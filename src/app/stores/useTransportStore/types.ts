import type {
  Transport,
  TransportAssignament,
  TransportAssignamentPost,
  TransportAssignamentPut,
  TransportPost,
  TransportPut,
  VehicleTraking,
  VehicleTrakingPost,
  VehicleTrakingPut,
  CompleteTransport
} from "@/app/mappings/transport/transport.types";

export type TransportStoreState = {
  transports: Transport[];
  transport?: CompleteTransport;

  assignments: TransportAssignament[];
  currentAssignment?: TransportAssignament;

  vehicleTrackings: VehicleTraking[];
  vehicleTracking?: VehicleTraking;

  loadingTransports: boolean;
  loadingAssignments: boolean;
  loadingVehicleTracking: boolean;
  creatingTransport: boolean;
  updatingTransport: boolean;
  deletingTransport: boolean;
  creatingAssignment: boolean;
  updatingAssignment: boolean;
  deletingAssignment: boolean;
  creatingVehicleTracking: boolean;
  updatingVehicleTracking: boolean;
  deletingVehicleTracking: boolean;

  successGetTransports: boolean;
  successGetTransport: boolean;
  successCreateTransport: boolean;
  successUpdateTransport: boolean;
  successDeleteTransport: boolean;

  successGetAssignments: boolean;
  successGetAssignment: boolean;
  successCreateAssignment: boolean;
  successUpdateAssignment: boolean;
  successDeleteAssignment: boolean;

  successGetVehicleTrackings: boolean;
  successGetVehicleTracking: boolean;
  successCreateVehicleTracking: boolean;
  successUpdateVehicleTracking: boolean;
  successDeleteVehicleTracking: boolean;

  error?: string;
  warning?: string;

  fetchTransports: (force?: boolean) => Promise<Transport[] | null>;
  fetchTransportById: (id: string, force?: boolean) => Promise<CompleteTransport | null>;
  createTransport: (payload: TransportPost) => Promise<Transport | null>;
  updateTransport: (payload: TransportPut) => Promise<Transport | null>;
  deleteTransport: (id: string) => Promise<boolean>;

  fetchAssignments: (force?: boolean) => Promise<TransportAssignament[] | null>;
  fetchAssignmentById: (id: string, force?: boolean) => Promise<TransportAssignament | null>;
  createAssignment: (payload: TransportAssignamentPost) => Promise<TransportAssignament | null>;
  updateAssignment: (payload: TransportAssignamentPut) => Promise<TransportAssignament | null>;
  deleteAssignment: (id: string) => Promise<boolean>;

  fetchVehicleTrackings: (force?: boolean) => Promise<VehicleTraking[] | null>;
  fetchVehicleTrackingById: (id: string, force?: boolean) => Promise<VehicleTraking | null>;
  createVehicleTracking: (payload: VehicleTrakingPost) => Promise<VehicleTraking | null>;
  updateVehicleTracking: (payload: VehicleTrakingPut) => Promise<VehicleTraking | null>;
  deleteVehicleTracking: (id: string) => Promise<boolean>;

  setCurrentAssignment: (assignment?: TransportAssignament) => void;
  reset: () => void;
  resetFlags: () => void;
  resetCurrentAssignment: () => void;
};

export type SetState = (
  partial:
    | Partial<TransportStoreState>
    | ((state: TransportStoreState) => Partial<TransportStoreState>)
) => void;

export type GetState = () => TransportStoreState;

