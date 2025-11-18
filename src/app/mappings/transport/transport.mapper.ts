import { parseISO } from "date-fns";
import type {
  CompleteTransport,
  Transport,
  TransportAssignament,
  TransportAssignamentPost,
  TransportAssignamentPut,
  TransportPost,
  TransportPut,
  TransportStatus,
  VehicleTraking,
  VehicleTrakingPost,
  VehicleTrakingPut,

} from "./transport.types";

const toString = (value: unknown, fallback = "") =>
  value == null ? fallback : String(value);
const toBoolean = (value: unknown, fallback = false) =>
  value == null ? fallback : Boolean(value);
const toNumber = (value: unknown, fallback = 0) => {
  if (value == null || value === "") return fallback;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const normalizeDate = (value: unknown): string => {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  try {
    const parsed = parseISO(String(value));
    return parsed.toISOString();
  } catch {
    return "";
  }
};

export const mapTransport = (raw: any): Transport => ({
  transport_id: toString(raw?.transport_id ?? raw?.id),
  brand: toString(raw?.brand),
  model: toString(raw?.model),
  UnitType: toString(raw?.UnitType ?? raw?.unit_type),
  plates: toString(raw?.plates),
});

export const mapCompleteTransport = (raw: any): CompleteTransport => ({
  transport_id: toString(raw?.transport_id ?? raw?.id),
  is_external: toBoolean(raw?.is_external),
  brand: toString(raw?.brand),
  model: toString(raw?.model),
  Unit_type: toString(raw?.unit_yype ?? raw?.UnitType ?? raw?.unit_type),
  plates: toString(raw?.plates),
  engine_number: toString(raw?.engine_number ?? raw?.engineNumber),
  serial_number: toString(raw?.serial_number ?? raw?.serialNumber),
  insurance_policy: toString(raw?.insurance_policy ?? raw?.insurancePolicy),
  fuel_card: toString(raw?.fuel_card ?? raw?.fuelCard),
  key_copy: toNumber(raw?.key_copy ?? raw?.keyCopy),
  circulation_card: toString(raw?.circulation_card ?? raw?.circulationCard),
  tag_pass: toString(raw?.tag_pass ?? raw?.tagPass),
  year: toString(raw?.year),
  economic_number: toString(raw?.economic_number ?? raw?.economicNumber),
  policy_expiration: toString(
    raw?.policy_expiration ?? raw?.insurance_policy_vigency
  ),
  circulation_card_expiration: toString(
    raw?.circulation_card_expiration ?? raw?.circulation_card_vigency
  ),
  image_plates: toString(raw?.image_plates ?? raw?.plates_image),
  image_circulation_card: toString(
    raw?.image_circulation_card ?? raw?.circulation_card_image
  ),
  front_image: toString(raw?.front_image ?? raw?.frontal_image),
  right_side_image: toString(
    raw?.right_side_image ?? raw?.right_lateral_image
  ),
  left_side_image: toString(raw?.left_side_image ?? raw?.left_lateral_image),
  back_image: toString(raw?.back_image ?? raw?.rear_image),
  insurance_policy_doc: toString(raw?.insurance_policy_doc),
});

export const mapCompleteTransportList = (
  list: any[] | undefined
): CompleteTransport[] =>
  Array.isArray(list) ? list.map(mapCompleteTransport) : [];

export const mapTransportStatus = (raw: any): TransportStatus => ({
  status_id: toString(raw?.status_id ?? raw?.id),
  status: toString(raw?.status),
  description: toString(raw?.description),
});

export const mapVehicleTraking = (raw: any): VehicleTraking => ({
  id: toString(raw?.id),
  idVehicleAssigment: toString(
    raw?.idVehicleAssigment ?? raw?.vehicleAssignmentId
  ),
  vehicleEntryExit: toBoolean(raw?.vehicleEntryExit),
  fuelLevel: toString(raw?.fuelLevel),
  mileage: toString(raw?.mileage),
  circulationcard: toBoolean(raw?.circulationcard),
  fuelCard: toBoolean(raw?.fuelCard),
  tagOrpas: toBoolean(raw?.tagOrpas),
  insurancePolicy: toBoolean(raw?.insurancePolicy),
  platesDelYtra: toBoolean(raw?.platesDelYtra),
  mechanicalOrhydraulicjack: toBoolean(raw?.mechanicalOrhydraulicjack),
  keytoRemoveStuds: toBoolean(raw?.keytoRemoveStuds),
  sparetire: toBoolean(raw?.sparetire),
  remarks: toString(raw?.remarks),
  date: normalizeDate(raw?.date),
});

export const mapVehicleTrakingList = (
  list: any[] | undefined
): VehicleTraking[] =>
  Array.isArray(list) ? list.map(mapVehicleTraking) : [];

export const mapTransportAssignament = (
  raw: any
): TransportAssignament => ({
  vehicleassignments_id: toString(raw?.vehicleassignments_id ?? raw?.id ?? raw?.assignment_id),
  employee_id: toString(raw?.employee_id),
  name: toString(raw?.name ?? raw?.employee_name),
  transport: mapTransport(raw?.transport ?? {}),
  status: mapTransportStatus(raw?.status ?? {}),
  departure_date: normalizeDate(raw?.departure_date),
  arrival_date: normalizeDate(raw?.arrival_date),
  destination: toString(raw?.destination),
  signature_leader: toString(raw?.signature_leader),
  signature_employee: toString(raw?.signature_employee),
  vehicletrackinglist: mapVehicleTrakingList(raw?.vehicletrackinglist),
});

export const mapTransportAssignaments = (
  list: any[]
): TransportAssignament[] => list.map(mapTransportAssignament);

export const mapTransportPost = (payload: any): TransportPost => ({
  brand: toString(payload?.brand),
  model: toString(payload?.model),
  plates: toString(payload?.plates),
  year: toString(payload?.year),
  engine_number: toString(payload?.engine_number),
  serial_number: toString(payload?.serial_number),
  insurance_policy: toString(payload?.insurance_policy),
  policy_expiration: toString(payload?.policy_expiration),
  circulation_card: toString(payload?.circulation_card),
  circulation_card_expiration: toString(
    payload?.circulation_card_expiration
  ),
  image_plates: toString(payload?.image_plates),
  image_circulation_card: toString(payload?.image_circulation_card),
  front_image: toString(payload?.front_image),
  back_image: toString(payload?.back_image),
  right_side_image: toString(payload?.right_side_image),
  left_side_image: toString(payload?.left_side_image),
  insurance_policy_doc: toString(payload?.insurance_policy_doc),
  UnitType: toString(payload?.UnitType),
  fuel_card: toString(payload?.fuel_card),
  key_copy: toNumber(payload?.key_copy),
  tag_pass: toString(payload?.tag_pass),
  economic_number: toString(payload?.economic_number),
  id_external_enterprise: toString(payload?.id_external_enterprise),
});

export const mapTransportPut = (payload: any): TransportPut => ({
  transport_id: toString(payload?.transport_id),
  is_external: toBoolean(payload?.is_external),
  plates: toString(payload?.plates),
  brand: toString(payload?.brand),
  model: toString(payload?.model),
  year: toString(payload?.year),
  engine_number: toString(payload?.engine_number),
  serial_number: toString(payload?.serial_number),
  insurance_policy: toString(payload?.insurance_policy),
  policy_expiration: toString(payload?.policy_expiration),
  circulation_card: toString(payload?.circulation_card),
  circulation_card_expiration: toString(
    payload?.circulation_card_expiration
  ),
  image_plates: toString(payload?.image_plates),
  image_circulation_card: toString(payload?.image_circulation_card),
  front_image: toString(payload?.front_image),
  right_side_image: toString(payload?.right_side_image),
  left_side_image: toString(payload?.left_side_image),
  back_image: toString(payload?.back_image),
  insurance_policy_doc: toString(payload?.insurance_policy_doc),
  UnitType: toString(payload?.UnitType),
  fuel_card: toString(payload?.fuel_card),
  key_copy: toNumber(payload?.key_copy),
  tag_pass: toString(payload?.tag_pass),
  economic_number: toString(payload?.economic_number),
  id_external_enterprise: toString(payload?.id_external_enterprise),
});

export const mapVehicleTrakingPost = (
  payload: any
): VehicleTrakingPost => ({
  idVehicleAssigment: toString(payload?.idVehicleAssigment),
  vehicleEntryExit: toBoolean(payload?.vehicleEntryExit),
  fuelLevel: toString(payload?.fuelLevel),
  mileage: toString(payload?.mileage),
  circulationcard: toBoolean(payload?.circulationcard),
  fuelCard: toBoolean(payload?.fuelCard),
  tagOrpas: toBoolean(payload?.tagOrpas),
  insurancePolicy: toBoolean(payload?.insurancePolicy),
  platesDelYtra: toBoolean(payload?.platesDelYtra),
  mechanicalOrhydraulicjack: toBoolean(payload?.mechanicalOrhydraulicjack),
  keytoRemoveStuds: toBoolean(payload?.keytoRemoveStuds),
  sparetire: toBoolean(payload?.sparetire),
  remarks: toString(payload?.remarks),
  date: normalizeDate(payload?.date),
});

export const mapVehicleTrakingPut = (
  payload: any
): VehicleTrakingPut => ({
  id: toString(payload?.id),
  idVehicleAssigment: toString(payload?.idVehicleAssigment),
  vehicleEntryExit: toBoolean(payload?.vehicleEntryExit),
  fuelLevel: toString(payload?.fuelLevel),
  mileage: toString(payload?.mileage),
  circulationcard: toBoolean(payload?.circulationcard),
  fuelCard: toBoolean(payload?.fuelCard),
  tagOrpas: toBoolean(payload?.tagOrpas),
  insurancePolicy: toBoolean(payload?.insurancePolicy),
  platesDelYtra: toBoolean(payload?.platesDelYtra),
  mechanicalOrhydraulicjack: toBoolean(payload?.mechanicalOrhydraulicjack),
  keytoRemoveStuds: toBoolean(payload?.keytoRemoveStuds),
  sparetire: toBoolean(payload?.sparetire),
  remarks: toString(payload?.remarks),
  date: normalizeDate(payload?.date),
});

export const mapTransportAssignamentPost = (
  payload: any
): TransportAssignamentPost => ({
  transport_id: toString(payload?.transport_id),
  employee_id: toString(payload?.employee_id),
  destination: toString(payload?.destination),
  signature_leader: toString(payload?.signature_leader),
  signature_employee: toString(payload?.signature_employee)
});

export const mapTransportAssignamentPut = (
  payload: any
): TransportAssignamentPut => ({
  transport_id: toString(payload?.transport_id),
  employee_id: toString(payload?.employee_id),
  destination: toString(payload?.destination),
  status_id: toString(payload?.status_id),
  VehicleAssignments_id: toString(payload?.VehicleAssignments_id),
});

