import type { Authorized } from '@/app/components/SignaturePopUp/types';
import type { VehicleImageSlot } from '@/app/stores/useVehicleRegistryImagesStore/types';

export type ImagesComponentProps = {
  formId: string;
};

export type LabeledOption = {
  label: string;
  value: string;
};

export type SignatureBoxData = {
  title: string;
  imageUrl: string;
};

export type UseImagesComponentParams = ImagesComponentProps;

export type UseImagesComponentReturn = {
  isSignatureOpen: boolean;
  openSignature: () => void;
  closeSignature: () => void;
  slots: VehicleImageSlot[];
  signatureBox: SignatureBoxData | null;
  shouldShowSignatureButton: boolean;
  selectedDriverId: string;
  handleSignatureAuthorization: (authorized: Authorized) => void;
  handleImageSelect: (
    slotId: string
  ) => (file: File | null) => Promise<void>;
  handleRemoveImage: (slotId: string) => void;
};
