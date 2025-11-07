"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";

import { Button } from "@/app/components/Button/Button";
import SignatureComponent from "@/app/components/SignatureComponent/SignatureComponent";
import type { Authorized } from "@/app/components/SignaturePopUp/types";
import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";

const Signature = () => {
  const [open, setOpen] = useState(false);

  const { user, signature } = useAuthStore(
    (state) => ({
      user: state.user,
      signature: state.signature,
    }),
    shallow
  );

  const initialSignature = useMemo(
    () => signature || user?.signature || "",
    [signature, user?.signature]
  );

  const [preview, setPreview] = useState(initialSignature);

  useEffect(() => {
    setPreview(initialSignature);
  }, [initialSignature]);

  const handleOpen = useCallback(() => {
    if (!user?.idEmployee) {
      return;
    }
    setOpen(true);
  }, [user?.idEmployee]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleAuthorization = useCallback(
    (authorized: Authorized) => {
      if (authorized?.signature) {
        setPreview(authorized.signature);
      }
    },
    []
  );

  const hasSignature = Boolean(preview);

  return (
    <React.Fragment>
      <section className="flex h-full flex-col gap-6 rounded-2xl border border-gray-30 bg-white-100 p-6 shadow-sm">
        <header className="flex flex-col gap-1">
          <h3 className="text-b4 font-medium text-blue-60">Firma digital</h3>
          <p className="text-b4 text-gray-70">
            La firma se insertará en los documentos después de haber autorizado una acción
          </p>
        </header>

        <div className="flex flex-col gap-4">
          <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-gray-30 bg-gray-10 px-4">
            {hasSignature ? (
              <img
                src={preview}
                alt="Firma digital"
                className="max-h-24 w-auto max-w-full object-contain"
              />
            ) : (
              <span className="text-b3 text-gray-50">Aún no tienes una firma registrada.</span>
            )}
          </div>

          <Button
            onClick={handleOpen}
            variant="solid"
            hideIcon
            disabled={!user?.idEmployee}
          >
            Actualizar firma
          </Button>
        </div>

        <SignatureComponent
          open={open}
          onClose={handleClose}
          onAuthorization={handleAuthorization}
          responsibleGuid={user?.idEmployee ?? ""}
        />
      </section>
    </React.Fragment>
  );
};

export default Signature;
