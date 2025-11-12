import { useCallback, useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";

import type { FieldModel } from "@/app/components/DynamicForm/types";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";

import type { NipFormValues, UseNipReturn } from "../types";

const BASE_FIELDS: FieldModel[] = [
  {
    name: "nip",
    type: "password",
    label: "NIP",
    placeholder: "Ingresa tu NIP",
    value: "",
    validations: [
      { type: "required" },
      { type: "minLength", value: 4 },
      { type: "maxLength", value: 4 },
    ],
  },
];

/**
 * Encapsula toda la lógica requerida por la tarjeta de configuración del NIP.
 * Maneja el estado del formulario, la interacción con el store de autenticación
 * y los mensajes al usuario a través del `PrincipalContext`.
 */
export const useNip = (): UseNipReturn => {
  const [valuesVersion, setValuesVersion] = useState(0);

  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal();
  const { withLoading } = usePrincipalLoading;
  const { showAlert } = usePrincipalAlert;

  const { userId, currentNip, changeNip, successChangeNIP, error, resetFlags } =
    useAuthStore(
      (state) => ({
        userId: state.user?.idUser ?? "",
        currentNip: state.user?.nip ?? "",
        changeNip: state.changeNip,
        successChangeNIP: state.successChangeNIP,
        error: state.error,
        resetFlags: state.resetFlags,
      }),
      shallow,
    );

  const fields = useMemo(
    () =>
      BASE_FIELDS.map((field) =>
        field.name === "nip"
          ? {
              ...field,
              value: currentNip,
            }
          : { ...field },
      ),
    [currentNip],
  );

  const handleSubmit = useCallback<UseNipReturn["handleSubmit"]>(
    async (values) => {
      const nipValue = (values.nip ?? "").trim();
      const normalizedUserId = userId.trim();

      if (!normalizedUserId) {
        showAlert({
          type: "error",
          variant: "subtle",
          title: "No se pudo identificar al usuario",
          description: "Intenta volver a iniciar sesión para actualizar tu NIP.",
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 4000,
        });
        return;
      }

      if (!nipValue || nipValue.length !== 4) {
        showAlert({
          type: "warning",
          variant: "subtle",
          title: "NIP inválido",
          description: "El NIP debe contener exactamente 4 dígitos.",
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 3500,
        });
        return;
      }

      await withLoading(
        () =>
          changeNip({
            user_id: normalizedUserId,
            nip: nipValue,
          }),
        { message: "Actualizando NIP" },
      );
    },
    [changeNip, showAlert, userId, withLoading],
  );

  useEffect(() => {
    if (!successChangeNIP) {
      return;
    }

    showAlert({
      type: "success",
      variant: "subtle",
      title: "NIP actualizado",
      description: "Tu NIP se actualizó correctamente.",
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 3500,
    });

    setValuesVersion((version) => version + 1);
    resetFlags();
  }, [resetFlags, showAlert, successChangeNIP]);

  useEffect(() => {
    if (!error) {
      return;
    }

    showAlert({
      type: "error",
      variant: "subtle",
      title: "No se pudo actualizar el NIP",
      description: error,
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 4000,
    });

    resetFlags();
  }, [error, resetFlags, showAlert]);

  useEffect(() => () => resetFlags(), [resetFlags]);

  return {
    fields,
    valuesVersion,
    handleSubmit,
  };
};
