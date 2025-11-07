'use client';

import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";

import SignaturePad from "../SignaturePAD/SignaturePAD";
import SignaturePopUp from "../SignaturePopUp/SignaturePopUp";
import type { SignaturePopUpProps } from "../SignaturePopUp/types";

import useSignatureComponent from "./hooks/useSignatureComponent";

export type SignatureComponentProps = SignaturePopUpProps & {
  /**
   * Avoids the authorization popup step and opens the signature pad directly.
   * Useful for internal flows where the employee is already authenticated.
   */
  skipAuthorization?: boolean;
  /**
   * Displays the signature pad in an overlay that covers the full viewport.
   */
  fullScreenPad?: boolean;
};

const SignatureComponent: React.FC<SignatureComponentProps> = ({
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
  skipAuthorization = false,
  fullScreenPad = false,
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
    skipAuthorization,
  });

  const handleSwitchToExternal = useCallback(() => {
    setIsExternalSignature(true);
  }, []);

  const handleSwitchToInternal = useCallback(() => {
    setIsExternalSignature(false);
  }, []);

  const signaturePad = (
    <SignaturePad
      onSignatureSave={handleSignatureSave}
      onCancel={handleCancel}
      name={externalInformation.name}
      workposition={externalInformation.workposition}
      fullScreen={fullScreenPad}
    />
  );

  const shouldShowSignaturePad = open && (skipAuthorization || showSignaturePad);
  const shouldRenderPopUp = !skipAuthorization && openSignaturePopUp;

  return (
    <>
      {shouldShowSignaturePad &&
        (fullScreenPad ? (
          <div
            className={clsx(
              "fixed inset-0 z-[9999] flex items-center justify-center bg-gray-90/70 p-4",
              "backdrop-blur-sm"
            )}
          >
            <div className="mx-auto w-full max-w-4xl">
              {signaturePad}
            </div>
          </div>
        ) : (
          signaturePad
        ))}

      {shouldRenderPopUp && (
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
      )}
    </>
  );
};

export default SignatureComponent;
