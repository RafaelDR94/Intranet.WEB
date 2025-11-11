"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";

import { Button } from "@/app/components/Button/Button";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import type { FieldModel } from "@/app/components/DynamicForm/types";
import { Input } from "@/app/components/Input/Input";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";

const BASE_FIELDS: FieldModel[] = [
  {
    name: "newPassword",
    type: "password",
    label: "Nueva contraseña",
    placeholder: "Escribe una nueva contraseña",
    value: "",
    validations: [
      { type: "required" },
      { type: "minLength", value: 6 },
    ],
  },
  {
    name: "confirmPassword",
    type: "password",
    label: "Confirmar nueva contraseña",
    placeholder: "Confirmar nueva contraseña",
    value: "",
    validations: [{ type: "required" }],
  },
];

const Password = () => {
  const [valuesVersion, setValuesVersion] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal();
  const { withLoading } = usePrincipalLoading;
  const { showAlert } = usePrincipalAlert;

  const {
    email,
    currentPassword,
    changePassword,
    successChangePassword,
    error,
    resetFlags,
  } = useAuthStore(
    (state) => {
      const fallbackEmail = state.user?.email ?? state.user?.userName ?? "";

      return {
        email: fallbackEmail,
        currentPassword: state.user?.password ?? "",
        changePassword: state.changePassword,
        successChangePassword: state.successChangePassword,
        error: state.error,
        resetFlags: state.resetFlags,
      };
    },
    shallow
  );

  const fields = useMemo(
    () => BASE_FIELDS.map((field) => ({ ...field })),
    []
  );

  const handleSubmit = useCallback(
    async (values: Record<string, any>) => {
      const { newPassword, confirmPassword } = values;

      if (!newPassword || !confirmPassword) {
        showAlert({
          type: "warning",
          variant: "subtle",
          title: "Campos incompletos",
          description: "Debes ingresar y confirmar tu nueva contraseña.",
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 3000,
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        showAlert({
          type: "error",
          variant: "subtle",
          title: "Las contraseñas no coinciden",
          description: "Verifica que ambas contraseñas sean iguales antes de continuar.",
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 4000,
        });
        return;
      }

      if (!email) {
        showAlert({
          type: "error",
          variant: "subtle",
          title: "No se pudo identificar al usuario",
          description: "Intenta volver a iniciar sesión para actualizar tu contraseña.",
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 4000,
        });
        return;
      }

      await withLoading(
        () =>
          changePassword({
            email,
            newPassword,
            changePassword: true,
          }),
        { message: "Actualizando contraseña" }
      );
    },
    [changePassword, email, showAlert, withLoading]
  );

  const displayPassword = useMemo(() => {
    if (currentPassword && currentPassword.trim().length > 0) {
      return currentPassword;
    }

    return "********";
  }, [currentPassword]);

  useEffect(() => {
    if (!successChangePassword) {
      return;
    }

    showAlert({
      type: "success",
      variant: "subtle",
      title: "Contraseña actualizada",
      description: "Tu contraseña se actualizó correctamente.",
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 3500,
    });

    setValuesVersion((version) => version + 1);
    setIsEditing(false);
    resetFlags();
  }, [successChangePassword, resetFlags, showAlert]);

  useEffect(() => {
    if (!error) {
      return;
    }

    showAlert({
      type: "error",
      variant: "subtle",
      title: "No se pudo actualizar la contraseña",
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
          <h3 className="text-b4 font-medium text-blue-60">Contraseña</h3>
          <p className="text-b4 text-gray-70">
            Ajuste y/o cambio de contraseña
          </p>
        </header>

        {isEditing ? (
          <DynamicForm
            fields={fields}
            onSubmit={handleSubmit}
            submitLabel="Guardar Contraseña"
            marginButton='15px'
            responsiveLayoutMatrix={{ sm: [[10], [10]], md: [[10], [10]] }}
            valuesVersion={valuesVersion}
          />
        ) : (
          <div className="flex flex-1 flex-col gap-6">
            <Input
              label="Contraseña actual"
              type="password"
              value={displayPassword}
              readOnly
              disabled
            />

            <div className="mt-auto">
              <Button
                hideIcon
                className="w-full"
                onClick={() => setIsEditing(true)}
              >
                Cambiar Contraseña
              </Button>
            </div>
          </div>
        )}
      </section>
    </React.Fragment>
  );
};

export default Password;
