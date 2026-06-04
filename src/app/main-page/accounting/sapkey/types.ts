import type { SAPKey } from "@/app/mappings/sapkeys/sapkeys.types";

export type SAPKeyViewMode = "list" | "new" | "edit";

export type SAPFormValues = {
  internalKey: string;
  descriptionInternalKey: string;
  ivaOptionId: string;
  satKey: string;
  descriptionSatKey: string;
  gtsType: string;
};

export type SAPKeyRow = {
  id: string;
  internalKey: string;
  descriptionInternalKey: string;
  ivaLabel: string;
  satKey: string;
  descriptionSatKey: string;
  gtsType: string;
  gtsTypeLabel: string;
  sapKey: SAPKey;
};
