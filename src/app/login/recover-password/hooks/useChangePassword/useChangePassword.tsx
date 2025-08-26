import { useCallback, useState } from "react";
import { AuthChangePassword } from "@/app/configurations/Axios/urls";
import { useRouter, useSearchParams } from "next/navigation";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import type { FieldModel } from "@/app/components/DynamicForm/types";
import { basicPut } from "@/app/configurations/Axios/GenericMethods";
import { intranetClient } from "@/app/configurations/Axios/Clients";

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
      try {
        // ...dentro de handleChange, en el try, después de validar 2xx:
        await basicPut(
          intranetClient,
          `${AuthChangePassword}`,
          {
            email,
            newPassword: values.newPassword,
            changePassword: true,
          },
          (response) => {
            console.log(response);
            
            if (response.status === 200) {
              // >>> Esto hace que MainLayoutClient renderice <Alert {...alert} />
              console.log('entro');
              
              showAlert({
                type: "success",
                variant: "subtle",
                title: "Contraseña actualizada",
                description: "Tu contraseña se cambió correctamente.",
                showPrimaryButton: false, // el layout los respeta si existen
                showSecondaryButton: false, // (o puedes omitirlos)
                // Nota: onPrimaryClick / onSecondaryClick los inyecta el layout con hideAlert
              });
            }
          }
        );
      } catch (error: any) {
        // Alerta
      } finally {
        setIsLoading(false);
      }
    },
    [email, showAlert, hideAlert, router]
  );

  return { isLoading, handleChange };
}