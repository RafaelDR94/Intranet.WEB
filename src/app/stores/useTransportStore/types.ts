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

export type ChangeDriverPayload = {
  id_vehicleAssignments: string;
  id_newEmployee: string;
};

export type TransportStoreState = {
  transports: CompleteTransport[];
  transport?: CompleteTransport;

  assignments: TransportAssignament[];
  currentAssignment?: TransportAssignament;

  vehicleTrackings: VehicleTraking[];
  vehicleTracking?: VehicleTraking;

  vehicleReassignmentsByEmployee: TransportAssignament[];

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
  changingDriver: boolean;
  approvingVehicleReassignment: boolean;
  rejectingVehicleReassignment: boolean;
  loadingVehicleReassignmentsByEmployee: boolean;

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
  successChangeDriver: boolean;
  successApproveVehicleReassignment: boolean;
  successRejectVehicleReassignment: boolean;
  successGetVehicleReassignmentsByEmployee: boolean;

  error?: string;
  warning?: string;

  fetchTransports: (force?: boolean) => Promise<Transport[] | null>;
  fetchTransportById: (id: string, force?: boolean) => Promise<CompleteTransport | null>;
  fetchTransportsByEnterprise: (enterpriseId: string, force?: boolean) => Promise<CompleteTransport[] | null>;
  createTransport: (payload: TransportPost) => Promise<CompleteTransport | null>;
  createExternalTransport: (payload: TransportPost) => Promise<CompleteTransport | null>;
  updateTransport: (payload: TransportPut) => Promise<CompleteTransport | null>;
  deleteTransport: (id: string) => Promise<boolean>;

  fetchAssignments: (force?: boolean) => Promise<TransportAssignament[] | null>;
  fetchAssignmentById: (id: string, force?: boolean) => Promise<TransportAssignament | null>;
  createAssignment: (payload: TransportAssignamentPost) => Promise<TransportAssignament | null>;
  updateAssignment: (payload: TransportAssignamentPut) => Promise<TransportAssignament | null>;
  deleteAssignment: (id: string) => Promise<boolean>;

  fetchVehicleTrackings: (force?: boolean) => Promise<VehicleTraking[] | null>;
  fetchVehicleTrackingById: (id: string, force?: boolean) => Promise<VehicleTraking | null>;
  createVehicleTracking: (payload: VehicleTrakingPost) => Promise<VehicleTraking | VehicleTrakingPost |null>;
  updateVehicleTracking: (payload: VehicleTrakingPut) => Promise<VehicleTraking | null>;
  deleteVehicleTracking: (id: string) => Promise<boolean>;

  changeDriver: (payload: ChangeDriverPayload) => Promise<boolean>;
  vehicleReassignmentApprove: (payload: VehicleReassignmentApprovePayload) => Promise<boolean>;
  vehicleReassignmentReject: (vehicleReassignment: string, comment: string) => Promise<boolean>;
  fetchVehicleReassignmentsByEmployee: (idEmployee: string) => Promise<TransportAssignament[] | null>;

  setCurrentAssignment: (assignment?: TransportAssignament) => void;
  reset: () => void;
  resetFlags: () => void;
  resetCurrentAssignment: () => void;
};

export type VehicleReassignmentApprovePayload = {
  id: string;
  comment: string;
  front_image: string;
  back_image: string;
  right_side_image: string;
  left_side_image: string;
  circulation_card_image: string;
  signature: string;
};

export type SetState = (
  partial:
    | Partial<TransportStoreState>
    | ((state: TransportStoreState) => Partial<TransportStoreState>)
) => void;

export type GetState = () => TransportStoreState;

