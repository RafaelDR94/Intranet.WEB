export type External = {
  name: string;
  workposition: string;
};

export interface Authorized {
  state: boolean;
  signature: string | null;
  external?: External;
}

export interface SignaturePopUpProps {
  open: boolean;
  onClose: () => void;
  onAuthorization: (authorized: Authorized) => void;
  warningMessage?: string;
  formDisabled?: boolean;
  responsibleGuid: string;
  externalSignature?: boolean;
  allowExternalToggle?: boolean;
  onRequestExternalSignature?: () => void;
  onRequestInternalSignature?: () => void;
  responsiveRequired?: boolean;
  onResponsiveDownload?: () => void;
}

export interface UseSignaturePopUpProps {
  onAuthorization: (authorized: Authorized) => void;
  responsibleGuid: string;
  externalSignature?: boolean;
  onClose: () => void;
}
