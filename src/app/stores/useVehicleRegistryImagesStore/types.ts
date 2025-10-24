export type VehicleImageSlotBase = {
  id: string;
  title: string;
  uploadLabel: string;
};

export type VehicleImageSlot = VehicleImageSlotBase & {
  imageSrc: string;
  file: File | null;
};

export type VehicleRegistryImagesState = {
  slots: VehicleImageSlot[];
  signature: string;
  signatureResponsibleId: string;
  setSlotImage: (
    slotId: string,
    payload: {
      file: File | null;
      imageSrc: string;
    }
  ) => void;
  resetSlot: (slotId: string) => void;
  setSignature: (signature: string, responsibleId: string) => void;
  resetSignature: () => void;
  resetAll: () => void;
  initializeSlots: (slots?: VehicleImageSlotBase[]) => void;
};
