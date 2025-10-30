import {
  Transport,
} from "./transport.types";
import {
  mapCompleteTransport,
  mapCompleteTransportList,
  mapTransport,
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
  mapTransport,
  mapTransportList: (list: any[]): Transport[] => list.map(mapTransport),
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

