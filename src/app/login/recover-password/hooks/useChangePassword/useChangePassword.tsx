import { useCallback, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import type { FieldModel } from "@/app/components/DynamicForm/types";
import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";
import { shallow } from "zustand/shallow";
import { PutChangePassword } from "@/app/mappings/auth/auth.types";
/**
 * Hook para evaluar un media query y responder a cambios.
 * @param query Media query CSS (ej: '(max-width: 600px)')
 * @param initialValue Valor inicial antes de la primera evaluación (útil en SSR)
 * @returns `true` si el media query coincide, `false` en caso contrario.
 *
 * Detalles:
 * - Usa `window.matchMedia` y se suscribe a cambios con `addEventListener('change', ...)`.
 * - Fallback para Safari < 14 (`addListener`/`removeListener`).
 * - En SSR o pruebas sin DOM, utiliza `initialValue` y evita acceder a `window`.
 */

/** Campos del formulario para cambiar contraseña */
export const changePasswordFields: FieldModel[] = [
  {
    name: "newPassword",
    type: "password",
    label: "Contraseña Nueva",
    placeholder: "Escribe una nueva contraseña",
    value: "",
    validations: [{ type: "required" }, { type: "minLength", value: 6 }],
  },
  {
    name: "confirmPassword",
    type: "password",
    label: "Confirmar contraseña",
    placeholder: "Confirma tu nueva contraseña",
    value: "",
    validations: [{ type: "required" }],
  },
];

export interface UseChangePassword {
  /** Indica si la solicitud está en curso */
  isLoading: boolean;
  /** Envía la nueva contraseña */
  handleChange: (values: Record<string, any>) => Promise<void>;
}

/**
 * Maneja el cambio de contraseña desde un enlace de recuperación.
 * @param routerOverride Router opcional para pruebas
 * @param searchParamsOverride SearchParams opcional para pruebas
 */
export default function useChangePassword(
  routerOverride?: ReturnType<typeof useRouter>,
  searchParamsOverride?: ReturnType<typeof useSearchParams>
): UseChangePassword {
  const router = routerOverride ?? useRouter();
  const searchParams = searchParamsOverride ?? useSearchParams();
  const email = searchParams.get("user") ?? "";
  const { usePrincipalAlert } = usePrincipal();
  const { showAlert, hideAlert } = usePrincipalAlert;
  const [isLoading, setIsLoading] = useState(false);
  const {
    error,
    resetFlags,
    successRecoverPassword,
    recoveringPassword,
    changePassword,
  } = useAuthStore(
    (s) => ({
      resetFlags: s.resetFlags,
      error: s.error,
      successRecoverPassword: s.successRecoverPassword,
      recoveringPassword: s.recoveringPassword,
      recoverPassword: s.recoverPassword,
      changePassword: s.changePassword,
    }),
    shallow
  );

  useEffect(() => {
    if (recoveringPassword) return; //Falta agregar spinner
    if (error) {
      // Mostrar error
    }
    if (successRecoverPassword) {
      // Mostrar success
    }
    resetFlags();
  }, [recoveringPassword, error, successRecoverPassword]);

  const handleChange = useCallback(
    async (values: Record<string, any>) => {
      if (values.newPassword !== values.confirmPassword) {
        showAlert({
          type: "error",
          variant: "subtle",
          title: "Error",
          description: "Las contraseñas no coinciden",
          onPrimaryClick: hideAlert,
          onSecondaryClick: hideAlert,
        });
        return;
      }
      setIsLoading(true);
      const payload: PutChangePassword = {
        email: email,
        newPassword: values.newPassword,
        changePassword: true,
      };
      changePassword(payload);
    },
    [email, showAlert, hideAlert, router]
  );

  return { isLoading, handleChange };
}
