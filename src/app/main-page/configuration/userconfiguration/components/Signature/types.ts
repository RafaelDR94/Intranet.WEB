import type { Authorized } from "@/app/components/SignaturePopUp/types";

export type SignatureProps = {
  className?: string;
};

export type UseSignatureReturn = {
  open: boolean;
  preview: string;
  hasSignature: boolean;
  responsibleGuid: string;
  isButtonDisabled: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  handleAuthorization: (authorized: Authorized) => void;
};
