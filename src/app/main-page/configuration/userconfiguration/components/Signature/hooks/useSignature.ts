import { useCallback, useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";

import type { Authorized } from "@/app/components/SignaturePopUp/types";
import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";

import type { UseSignatureReturn } from "../types";

/**
 * Gestiona el estado y la lógica para la tarjeta de configuración de firma digital.
 */
export const useSignature = (): UseSignatureReturn => {
  const { user, signature } = useAuthStore(
    (state) => ({
      user: state.user,
      signature: state.signature,
    }),
    shallow,
  );

  const initialSignature = useMemo(
    () => signature || user?.signature || "",
    [signature, user?.signature],
  );

  const [open, setOpen] = useState(false);
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

  const handleAuthorization = useCallback((authorized: Authorized) => {
    if (authorized?.signature) {
      setPreview(authorized.signature);
    }
  }, []);

  const hasSignature = Boolean(preview);

  return {
    open,
    preview,
    hasSignature,
    responsibleGuid: user?.idEmployee ?? "",
    isButtonDisabled: !user?.idEmployee,
    handleOpen,
    handleClose,
    handleAuthorization,
  };
};
