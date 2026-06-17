export type SAPKey = {
  id: string;
  satKey: string;
  descriptionSatKey: string;
  internalKey: string;
  descriptionInternalKey: string;
  gtsType: string;
  iva: number;
  isActive: boolean;
};

export type SAPKeyPost = {
  satKey: string;
  descriptionSatKey: string;
  internalKey: string;
  descriptionInternalKey: string;
  gtsType: string;
  iva: number;
};

export type SAPKeyPut = {
  id: string;
  satKey: string;
  descriptionSatKey: string;
  internalKey: string;
  descriptionInternalKey: string;
  gtsType: string;
  iva: number;
};
