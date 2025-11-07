"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";

import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import type { FieldModel } from "@/app/components/DynamicForm/types";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";

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

const Nip = () => {
  const [valuesVersion, setValuesVersion] = useState(0);

  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal();
  const { withLoading } = usePrincipalLoading;
  const { showAlert } = usePrincipalAlert;

  const { idUser, changeNip, successChangeNIP, error, resetFlags } = useAuthStore(
    (state) => ({
      idUser: state.user?.idUser,
      changeNip: state.changeNip,
      successChangeNIP: state.successChangeNIP,
      error: state.error,
      resetFlags: state.resetFlags,
    }),
    shallow
  );

  const fields = useMemo(
    () => BASE_FIELDS.map((field) => ({ ...field })),
    []
  );

  const handleSubmit = useCallback(
    async (values: Record<string, any>) => {
      const nipValue: string = values.nip ?? "";
      const parsedId = Number(idUser ?? 0);

      if (!parsedId) {
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
            idUser: parsedId,
            nip: nipValue,
          }),
        { message: "Actualizando NIP" }
      );
    },
    [changeNip, idUser, showAlert, withLoading]
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

  return (
    <React.Fragment>
      <section className="flex h-full flex-col gap-6 rounded-2xl border border-gray-30 bg-white-100 p-6 shadow-sm">
        <header className="flex flex-col gap-1">
          <h3 className="text-h6 font-semibold text-gray-90">NIP</h3>
          <p className="text-b3 text-gray-60">
            El NIP autoriza tus firmas digitales en los documentos oficiales.
          </p>
        </header>

        <DynamicForm
          fields={fields}
          onSubmit={handleSubmit}
          submitLabel="Guardar NIP"
          responsiveLayoutMatrix={{ sm: [[10]], md: [[10]] }}
          valuesVersion={valuesVersion}
        />
      </section>
    </React.Fragment>
  );
};

export default Nip;
