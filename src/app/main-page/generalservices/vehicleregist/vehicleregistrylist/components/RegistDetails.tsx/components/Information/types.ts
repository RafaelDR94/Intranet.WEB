import type {
  TransportAssignament,
  VehicleTraking,
} from "@/app/mappings/transport/transport.types";

export type ToolChecklistKey =
  | "mechanicalOrhydraulicjack"
  | "keytoRemoveStuds"
  | "sparetire";

export type DocumentChecklistKey =
  | "circulationcard"
  | "fuelCard"
  | "tagOrpas"
  | "insurancePolicy"
  | "platesDelYtra";

export type InformationRow = {
  label: string;
  value: string;
};

export type ChecklistOption<Key extends keyof VehicleTraking> = {
  label: string;
  field: Key;
  value: Key;
};

export type ChecklistGroup<Key extends keyof VehicleTraking> = {
  title: string;
  options: ChecklistOption<Key>[];
};

export type TrackingChecklistValues = {
  tools: ToolChecklistKey[];
  documents: DocumentChecklistKey[];
};

export type TrackingInformation = {
  mileage: string;
  fuelLevel: string;
  remarks: string;
  checklistValues: TrackingChecklistValues;
  raw?: VehicleTraking;
};

export type UseInformationResult = {
  assignment?: TransportAssignament;
  generalRows: InformationRow[];
  departure?: TrackingInformation;
  arrival?: TrackingInformation;
  checklistDefinitions: {
    tools: ChecklistGroup<ToolChecklistKey>;
    documents: ChecklistGroup<DocumentChecklistKey>;
  };
};
