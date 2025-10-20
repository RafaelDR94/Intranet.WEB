import { useMemo } from "react";

import { useTransportStore } from "@/app/stores/useTransportStore/useTransportStore";

import type {
  ChecklistOption,
  DocumentChecklistKey,
  ToolChecklistKey,
  TrackingInformation,
  UseInformationResult,
} from "../types";
import type {
  TransportAssignament,
  VehicleTraking,
} from "@/app/mappings/transport/transport.types";

const NUMBER_FORMATTER = new Intl.NumberFormat("es-MX");
const EMPTY_TRACKINGS: VehicleTraking[] = [];

export const TOOL_CHECKLIST: ChecklistOption<ToolChecklistKey>[] = [
  {
    label: "Gato",
    field: "mechanicalOrhydraulicjack",
    value: "mechanicalOrhydraulicjack",
  },
  {
    label: "Llave para quitar birlos",
    field: "keytoRemoveStuds",
    value: "keytoRemoveStuds",
  },
  {
    label: "Llanta de refaccion",
    field: "sparetire",
    value: "sparetire",
  },
];

export const DOCUMENT_CHECKLIST: ChecklistOption<DocumentChecklistKey>[] = [
  {
    label: "Tarjeta de Circulacion",
    field: "circulationcard",
    value: "circulationcard",
  },
  {
    label: "Tarjeta de Combustible",
    field: "fuelCard",
    value: "fuelCard",
  },
  {
    label: "Tag o pase",
    field: "tagOrpas",
    value: "tagOrpas",
  },
  {
    label: "Poliza de seguro",
    field: "insurancePolicy",
    value: "insurancePolicy",
  },
  {
    label: "Ambas placas",
    field: "platesDelYtra",
    value: "platesDelYtra",
  },
];

const simplifyFraction = (numerator: number, denominator: number): string => {
  if (denominator === 0) return "--";
  if (numerator <= 0) return "0/1";
  if (numerator >= denominator) return "1/1";
  let a = numerator;
  let b = denominator;
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  const divisor = a === 0 ? 1 : a;
  const simplifiedNumerator = Math.round(numerator / divisor);
  const simplifiedDenominator = Math.round(denominator / divisor);
  if (simplifiedDenominator === 0) return "--";
  return `${simplifiedNumerator}/${simplifiedDenominator}`;
};

export const formatFuelLevel = (value?: string): string => {
  if (!value) return "--";
  const normalized = value.replace(",", ".").trim();
  const numeric = Number(normalized);
  if (Number.isNaN(numeric)) {
    return value;
  }
  const decimal = numeric > 1 ? numeric / 100 : numeric;
  if (decimal <= 0) return "0/1";
  if (decimal >= 1) return "1/1";
  const denominator = 8;
  const numerator = Math.round(decimal * denominator);
  return simplifyFraction(numerator, denominator);
};

export const formatMileage = (value?: string): string => {
  if (!value) return "--";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return value;
  }
  return NUMBER_FORMATTER.format(numeric);
};

export const formatRemarks = (value?: string): string => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : "Sin observaciones";
};

export const buildVehicleName = (
  assignment?: TransportAssignament
): string => {
  if (!assignment?.transport) return "--";
  const { brand, model, UnitType } = assignment.transport;
  return [brand, model, UnitType].filter(Boolean).join(" ").trim() || "--";
};

const toTrackingInformation = (
  tracking?: VehicleTraking
): TrackingInformation | undefined => {
  if (!tracking) return undefined;

  const toolValues = TOOL_CHECKLIST.filter(
    (option) => Boolean(tracking[option.field])
  ).map((option) => option.value);

  const documentValues = DOCUMENT_CHECKLIST.filter(
    (option) => Boolean(tracking[option.field])
  ).map((option) => option.value);

  return {
    mileage: formatMileage(tracking.mileage),
    fuelLevel: formatFuelLevel(tracking.fuelLevel),
    remarks: formatRemarks(tracking.remarks),
    checklistValues: {
      tools: toolValues,
      documents: documentValues,
    },
    raw: tracking,
  };
};

export const findDepartureAndArrival = (trackings: VehicleTraking[]) => {
  const departure =
    trackings.find((item) => item.vehicleEntryExit === false) ?? trackings[0];
  const arrival =
    trackings.find((item) => item.vehicleEntryExit === true) ??
    (trackings.length > 1 ? trackings[1] : undefined);
  return { departure, arrival };
};

const useInformation = (): UseInformationResult => {
  const { currentAssignment } = useTransportStore();

  const trackings = currentAssignment?.vehicletrackinglist ?? EMPTY_TRACKINGS;
  const { departure, arrival } = useMemo(
    () => findDepartureAndArrival(trackings),
    [trackings]
  );

  const generalRows = useMemo(() => {
    if (!currentAssignment) {
      return [] as UseInformationResult["generalRows"];
    }

    return [
      {
        label: "Destino",
        value: currentAssignment.destination || "--",
      },
      {
        label: "Conductor",
        value: currentAssignment.name || "--",
      },
      {
        label: "Vehiculo",
        value: buildVehicleName(currentAssignment),
      },
    ];
  }, [currentAssignment]);

  const departureInformation = useMemo(
    () => toTrackingInformation(departure),
    [departure]
  );

  const arrivalInformation = useMemo(
    () => toTrackingInformation(arrival),
    [arrival]
  );

  return {
    assignment: currentAssignment,
    generalRows,
    departure: departureInformation,
    arrival: arrivalInformation,
    checklistDefinitions: {
      tools: {
        title: "Check List Herramientas",
        options: TOOL_CHECKLIST,
      },
      documents: {
        title: "Check List Documentos",
        options: DOCUMENT_CHECKLIST,
      },
    },
  };
};

export default useInformation;
