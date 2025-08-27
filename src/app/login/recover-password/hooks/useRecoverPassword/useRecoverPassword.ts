import { useCallback, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { FieldModel } from "@/app/components/DynamicForm/types";
import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";
import { shallow } from "zustand/shallow";
import { PutRecoverPassword } from "@/app/mappings/auth/auth.types";

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

  // Estado local
  const [isLoading, setIsLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  // Evitar doble redirección en renderizados/reintentos
  const didRedirectRef = useRef(false);

  // Store de auth
  const {
    error,
    resetFlags,
    successRecoverPassword,
    recoveringPassword,
    recoverPassword,
  } = useAuthStore(
    (s) => ({
      resetFlags: s.resetFlags,
      error: s.error,
      successRecoverPassword: s.successRecoverPassword,
      recoveringPassword: s.recoveringPassword,
      recoverPassword: s.recoverPassword,
    }),
    shallow
  );

  // Efecto para reaccionar al resultado
  useEffect(() => {
    // Mientras está en curso, mantenemos el loading
    if (recoveringPassword) {
      setIsLoading(true);
      return;
    }

    // Terminó la solicitud (éxito o error), apagamos loading
    setIsLoading(false);

    // Error del flujo
    if (error) {
      // Ajusta el shape de showAlert si tu implementación difiere.
      resetFlags();
      return;
    }

    // Éxito del flujo
    if (successRecoverPassword && submittedEmail && !didRedirectRef.current) {
      didRedirectRef.current = true; // evita dobles pushes

      // Redirige con el email en la query
      router.push(
        `/login/recover-password/recovery-email/?email=${encodeURIComponent(
          submittedEmail
        )}`
      );

      // Importante: resetea flags después de disparar la navegación
      resetFlags();
      return;
    }

    // Si terminó y no hubo error ni éxito (edge cases), limpia flags
    if (!recoveringPassword && !error && !successRecoverPassword) {
      resetFlags();
    }
  }, [
    recoveringPassword,
    error,
    successRecoverPassword,
    submittedEmail,
    router,
    resetFlags,
  ]);

  // Handler de envío
  const handleRecover = useCallback(
    async (values: Record<string, any>) => {
      // Capturamos el email real del formulario
      const email: string = values?.email ?? "";
      setSubmittedEmail(email);

      // Disparamos la acción del store
      const payload: PutRecoverPassword = { username: email };
      recoverPassword(payload);

      // Activamos loading local
      setIsLoading(true);

      // Si mostrabas un alert de "procesando", lo puedes lanzar aquí:
      // showAlert?.("Procesando solicitud...", "info");
    },
    [recoverPassword]
  );

  return { isLoading, handleRecover };
}
