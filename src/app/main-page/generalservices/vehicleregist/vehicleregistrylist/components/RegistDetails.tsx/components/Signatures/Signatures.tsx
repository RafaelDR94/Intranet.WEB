import React from "react";

import SignatureBox from "@/app/components/SignatureBox/SignatureBox";

import useSignatures from "./hooks/useSignatures";

const Signatures: React.FC = () => {
  const {
    loading,
    error,
    hasAssignment,
    signatureUrl,
    driverName,
    arrivalDateLabel,
  } = useSignatures();

  if (!hasAssignment) {
    return (
      <div className="w-full text-center text-gray-70 text-b3">
        Selecciona un registro para ver la firma.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full text-center text-gray-70 text-b3">
        Cargando firma...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center text-gray-70 text-b3">
        No fue posible cargar la firma. {error}
      </div>
    );
  }

  if (!signatureUrl) {
    return (
      <div className="w-full text-center text-gray-70 text-b3">
        No se encontró la firma registrada.
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <SignatureBox
        title={driverName ?? "Conductor"}
        captionTop="Firma de llegada"
        captionBottom={
          arrivalDateLabel ? `Registrada el ${arrivalDateLabel}` : undefined
        }
        imageUrl={signatureUrl}
      />
    </div>
  );
};

export default Signatures;

