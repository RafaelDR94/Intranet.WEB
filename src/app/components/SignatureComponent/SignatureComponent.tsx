'use client';

import { useCallback, useEffect, useState } from "react";

import SignaturePad from "../SignaturePAD/SignaturePAD";
import SignaturePopUp from "../SignaturePopUp/SignaturePopUp";
import type { SignaturePopUpProps } from "../SignaturePopUp/types";

import useSignatureComponent from "./hooks/useSignatureComponent";

const SignatureComponent: React.FC<SignaturePopUpProps> = ({
  open,
  onClose,
  onAuthorization,
  responsibleGuid,
  externalSignature = false,
  allowExternalToggle = false,
  responsiveRequired = false,
  onResponsiveDownload,
  onRequestExternalSignature: _ignoredExternalRequest,
  onRequestInternalSignature: _ignoredInternalRequest,
  ...rest
}) => {
  const [isExternalSignature, setIsExternalSignature] = useState<boolean>(
    Boolean(externalSignature)
  );

  useEffect(() => {
    setIsExternalSignature(Boolean(externalSignature));
  }, [externalSignature, open]);

  const {
    externalInformation,
    openSignaturePopUp,
    showSignaturePad,
    handleAuthorization,
    handleSignatureSave,
    handleCancel,
    onPopUpClose,
  } = useSignatureComponent({
    open,
    onClose,
    onAuthorization,
    responsibleGuid,
    externalSignature: isExternalSignature,
  });

  const handleSwitchToExternal = useCallback(() => {
    setIsExternalSignature(true);
  }, []);

  const handleSwitchToInternal = useCallback(() => {
    setIsExternalSignature(false);
  }, []);

  return (
    <>
      {showSignaturePad && open && (
        <SignaturePad
          onSignatureSave={handleSignatureSave}
          onCancel={handleCancel}
          name={externalInformation.name}
          workposition={externalInformation.workposition}
        />
      )}

      <SignaturePopUp
        open={openSignaturePopUp}
        onClose={onPopUpClose}
        responsibleGuid={responsibleGuid}
        onAuthorization={handleAuthorization}
        externalSignature={isExternalSignature}
        allowExternalToggle={allowExternalToggle}
        onRequestExternalSignature={
          allowExternalToggle ? handleSwitchToExternal : undefined
        }
        onRequestInternalSignature={
          allowExternalToggle ? handleSwitchToInternal : undefined
        }
        responsiveRequired={responsiveRequired}
        onResponsiveDownload={onResponsiveDownload}
        {...rest}
      />
    </>
  );
};

export default SignatureComponent;
