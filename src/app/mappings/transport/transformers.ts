import {
  CompleteTransport,
} from "./transport.types";
import {
  mapCompleteTransport,
  mapCompleteTransportList,
  mapTransportAssignament,
  mapTransportAssignamentPost,
  mapTransportAssignamentPut,
  mapTransportAssignaments,
  mapTransportPost,
  mapTransportPut,
  mapVehicleTraking,
  mapVehicleTrakingList,
  mapVehicleTrakingPost,
  mapVehicleTrakingPut,
} from "./transport.mapper";

export const transportTransformer = {
  mapCompleteTransport,
  mapCompleteTransportList,
  mapTransport:mapCompleteTransport,
  mapTransportList: (list: any[]): CompleteTransport[] => list.map(mapCompleteTransport),
  mapTransportPost,
  mapTransportPut,
  mapVehicleTraking,
  mapVehicleTrakingList,
  mapVehicleTrakingPost,
  mapVehicleTrakingPut,
  mapTransportAssignament,
  mapTransportAssignaments,
  mapTransportAssignamentPost,
  mapTransportAssignamentPut,
};

export type TransportTransformer = typeof transportTransformer;

