import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import type { FieldModel } from "@/app/components/DynamicForm/types";
import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";
import { shallow } from "zustand/shallow";
import {PutRecoverPassword} from "@/app/mappings/auth/auth.types"
/** Campos del formulario de recuperación de contraseña */
export const recoverPasswordFields: FieldModel[] = [
  {
    name: "email",
    type: "email",
    label: "Usuario",
    placeholder: "usuario@drsecurity.net",
    value: "",
    validations: [{ type: "required" }, { type: "email" }],
  },
];

export interface UseRecoverPassword {
  /** Indica si la solicitud está en curso */
  isLoading: boolean;
  /** Envía el correo para recuperar la contraseña */
  handleRecover: (values: Record<string, any>) => Promise<void>;
}

/**
 * Maneja el flujo de recuperación de contraseña.
 * @param routerOverride Router opcional para pruebas
 * @returns Estado y acciones del proceso
 */
export default function useRecoverPassword(
  routerOverride?: ReturnType<typeof useRouter>
): UseRecoverPassword {
  const router = routerOverride ?? useRouter();
  const { usePrincipalAlert } = usePrincipal();
  const { showAlert, hideAlert } = usePrincipalAlert;
  const [isLoading, setIsLoading] = useState(false);
  const { error, resetFlags, successRecoverPassword, recoveringPassword, recoverPassword } = useAuthStore(
    (s) => ({
      resetFlags: s.resetFlags,
      error: s.error,
      successRecoverPassword: s.successRecoverPassword,
      recoveringPassword: s.recoveringPassword,
      recoverPassword: s.recoverPassword,
    }),
    shallow
  );

  useEffect(() => {
    if(recoveringPassword) return; //Falta agregar spinner
    if(error) {
      // Mostrar error
    } 
    if(successRecoverPassword) {
      // Mostrar success
    }
    resetFlags();
  }, [recoveringPassword, error, successRecoverPassword]);

  const handleRecover = useCallback(
    async (values: Record<string, any>) => {
      const payload:PutRecoverPassword = { username: values.email };
      recoverPassword(payload);
      setIsLoading(true);
    },
    [router, showAlert, hideAlert]
  );

  return { isLoading, handleRecover };
}
