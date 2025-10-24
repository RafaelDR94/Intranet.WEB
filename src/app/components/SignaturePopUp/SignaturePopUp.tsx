'use client';

import { useEffect, useState } from "react";

import { Checkbox } from "../CheckBox/CheckBox";
import DynamicForm from "../DynamicForm/DynamicForm";
import { PopUp } from "../PopUp/PopUp";

import useSignaturePopUp from "./hooks/useSignaturePopUp";
import type { SignaturePopUpProps } from "./types";

const SignaturePopUp: React.FC<SignaturePopUpProps> = ({
  open,
  onClose,
  onAuthorization,
  responsibleGuid,
  externalSignature,
  allowExternalToggle = false,
  onRequestExternalSignature,
  onRequestInternalSignature,
  responsiveRequired = false,
  onResponsiveDownload,
}) => {
  const { fields, handleSubmit } = useSignaturePopUp({
    onClose,
    onAuthorization,
    responsibleGuid,
    externalSignature,
  });

  const [responsiveAccepted, setResponsiveAccepted] =
    useState<boolean>(!responsiveRequired);

  useEffect(() => {
    setResponsiveAccepted(!responsiveRequired);
  }, [responsiveRequired, open]);

  const canSubmit = !responsiveRequired || responsiveAccepted;

  return (
    <PopUp
      open={open}
      onClose={onClose}
      title="Firmar"
      content="Ingresa tu firma para validar"
    >
      <div className="flex flex-col gap-4">
        <DynamicForm
          fields={fields}
          onSubmit={handleSubmit}
          submitLabel="Aceptar"
          showSubmitIf={() => canSubmit}
        >

          {responsiveRequired && (
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-70">
              <Checkbox
                checked={responsiveAccepted}
                onChange={setResponsiveAccepted}
                label="He leido y aceptado la"
                className="text-sm text-gray-70"
              />
              {onResponsiveDownload ? (
                <button
                  type="button"
                  onClick={onResponsiveDownload}
                  className="text-sm text-blue-60 underline"
                >
                  Responsiva Vehicular
                </button>
              ) : (
                <span className="text-sm text-blue-60 underline">
                  Responsiva Vehicular
                </span>
              )}
            </div>
          )}

          {allowExternalToggle &&
            !externalSignature &&
            onRequestExternalSignature && (
              <p className="text-center text-sm text-gray-60">
                Si no tienes cuenta en intranet{" "}
                <button
                  type="button"
                  onClick={onRequestExternalSignature}
                  className="text-blue-60 underline"
                >
                  Firma Aqui
                </button>
              </p>
            )}

          {allowExternalToggle &&
            externalSignature &&
            onRequestInternalSignature && (
              <p className="text-center text-sm text-gray-60">
                Si tienes cuenta en intranet{" "}
                <button
                  type="button"
                  onClick={onRequestInternalSignature}
                  className="text-blue-60 underline"
                >
                  Firma con mi cuenta
                </button>
              </p>
            )}
        </DynamicForm>


      </div>
    </PopUp>
  );
};

export default SignaturePopUp;
