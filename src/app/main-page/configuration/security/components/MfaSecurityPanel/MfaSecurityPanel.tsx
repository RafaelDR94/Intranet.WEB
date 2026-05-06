"use client";

import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/app/components/Input/Input";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";

import {
  actionColumn,
  dangerAction,
  header,
  linkAction,
  outlineAction,
  panel,
  row,
  rowContent,
  rowDescription,
  rows,
  rowTitle,
  title,
  toggleOff,
  toggleOn,
  toggleOnlyAction,
  toggleThumbOff,
  toggleThumbOn,
} from "./styles";

const MfaSecurityPanel = () => {
  const router = useRouter();
  const [isPasskeyPopupOpen, setIsPasskeyPopupOpen] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const user = useAuthStore((state) => state.user);
  const changingMFA = useAuthStore((state) => state.changingMFA);
  const changingMFAMethod = useAuthStore((state) => state.changingMFAMethod);
  const fetchingUserMfaById = useAuthStore((state) => state.fetchingUserMfaById);
  const mfaSmsEnabled = useAuthStore((state) => state.mfaSmsEnabled);
  const mfaEmailEnabled = useAuthStore((state) => state.mfaEmailEnabled);
  const userMfaById = useAuthStore((state) => state.userMfaById);
  const userPasskeys = useAuthStore((state) => state.userPasskeys);
  const registerUserPasskeyOptions = useAuthStore((state) => state.registerUserPasskeyOptions);
  const registeringUserPasskey = useAuthStore((state) => state.registeringUserPasskey);
  const fetchUserPasskeys = useAuthStore((state) => state.fetchUserPasskeys);
  const error = useAuthStore((state) => state.error);
  const changeMfaStatus = useAuthStore((state) => state.changeMfaStatus);
  const changeMfaMethodStatus = useAuthStore((state) => state.changeMfaMethodStatus);
  const fetchUserMfaById = useAuthStore((state) => state.fetchUserMfaById);
  const mfaEnabled = useMemo(
    () => Boolean(userMfaById?.twoFactorEnabled ?? user?.twoFactorEnabled ?? false),
    [user, userMfaById],
  );
  const mfaPasskeyEnabled = useMemo(
    () => Boolean(userMfaById?.methods.find((method) => method.method === "Passkey")?.isEnabled),
    [userMfaById],
  );

  useEffect(() => {
    if (!user?.idUser) return;
    void fetchUserMfaById(user.idUser);
    void fetchUserPasskeys(user.idUser);
  }, [fetchUserMfaById, fetchUserPasskeys, user?.idUser]);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const platform = navigator.platform || "Dispositivo";
    const userAgent = navigator.userAgent || "";
    let browser = "Navegador";
    if (userAgent.includes("Edg/")) browser = "Edge";
    else if (userAgent.includes("Chrome/")) browser = "Chrome";
    else if (userAgent.includes("Firefox/")) browser = "Firefox";
    else if (userAgent.includes("Safari/") && !userAgent.includes("Chrome/")) browser = "Safari";
    setDeviceName(`${platform} - ${browser}`);
  }, []);

  const handleToggleMfa = async () => {
    if (!user?.idUser || changingMFA) return;
    const nextMfaEnabled = !mfaEnabled;

    await changeMfaStatus({
      idUser: user.idUser,
      twoFactorEnabled: nextMfaEnabled,
    });

    if (nextMfaEnabled && !mfaEmailEnabled) {
      await changeMfaMethodStatus({
        idUser: user.idUser,
        method: "Email",
        isEnabled: true,
        destination: user.email,
      });
    }
  };

  const handleToggleMfaMethod = async (
    method: "SMS" | "Email" | "Passkey",
    isEnabled: boolean,
  ) => {
    if (!user?.idUser || changingMFAMethod) return;
    const methodEntry = userMfaById?.methods.find((item) => item.method === method);
    const firstPasskeyId = userPasskeys[0]?.id;

    await changeMfaMethodStatus({
      idUser: user.idUser,
      method,
      isEnabled,
      ...(method === "Passkey"
        ? { idPasskey: firstPasskeyId }
        : { destination: methodEntry?.destination ?? user.email ?? undefined }),
    });
  };

  const handlePasskeyToggle = async () => {
    if (!user?.idUser || changingMFAMethod) return;

    if (mfaPasskeyEnabled) {
      await handleToggleMfaMethod("Passkey", false);
      return;
    }

    setIsPasskeyPopupOpen(true);
  };

  const handleRegisterPasskeyFromSecurity = async () => {
    if (!user?.idUser) return;
    const normalizedDeviceName = deviceName.trim();
    if (!normalizedDeviceName) return;

    const ok = await registerUserPasskeyOptions(normalizedDeviceName);
    if (!ok) return;

    const latestPasskeys = await fetchUserPasskeys(user.idUser);
    const selectedPasskeyId = latestPasskeys?.[0]?.id;
    if (!selectedPasskeyId) return;

    await changeMfaMethodStatus({
      idUser: user.idUser,
      method: "Passkey",
      isEnabled: true,
      idPasskey: selectedPasskeyId,
    });

    setIsPasskeyPopupOpen(false);
  };
  const isMethodToggleDisabled =
    changingMFAMethod || fetchingUserMfaById || !user?.idUser || !mfaEnabled;

  return (
    <section className={panel}>
      <div className={header}>
        <h2 className={title}>Autenticación de múltiples factores (MFA)</h2>
        <button
          type="button"
          role="switch"
          aria-checked={mfaEnabled}
          aria-label="Activar autenticación de múltiples factores"
          disabled={changingMFA || fetchingUserMfaById || !user?.idUser}
          className={clsx(
            mfaEnabled ? toggleOn : toggleOff,
            (changingMFA || fetchingUserMfaById || !user?.idUser) && "cursor-not-allowed opacity-70",
          )}
          data-testid="mfa-main-toggle"
          onClick={handleToggleMfa}
        >
          <span className={mfaEnabled ? toggleThumbOn : toggleThumbOff} />
        </button>
      </div>

      <div className={rows}>
        <div className={row}>
          <div className={rowContent}>
            <h3 className={rowTitle}>Mensaje de texto</h3>
            <p className={rowDescription}>
              Recibe códigos de verificación de 6 dígitos por SMS o WhatsApp
              según tu código de país
            </p>
          </div>

          <div className={actionColumn}>
            <button
              type="button"
              role="switch"
              aria-checked={mfaSmsEnabled}
              aria-label="Activar método SMS"
              disabled={isMethodToggleDisabled}
              className={clsx(
                mfaSmsEnabled ? toggleOn : toggleOff,
                isMethodToggleDisabled && "cursor-not-allowed opacity-70",
              )}
              data-testid="mfa-sms-toggle"
              onClick={() => handleToggleMfaMethod("SMS", !mfaSmsEnabled)}
            >
              <span className={mfaSmsEnabled ? toggleThumbOn : toggleThumbOff} />
            </button>
            <button type="button" className={linkAction}>
              Cambiar número
            </button>
          </div>
        </div>

        <div className={row}>
          <div className={rowContent}>
            <h3 className={rowTitle}>Mensaje por correo electrónico</h3>
            <p className={rowDescription}>
              Recibe códigos de verificación de 6 dígitos a tu correo
              electrónico empresarial.
            </p>
          </div>

          <div className={toggleOnlyAction}>
            <button
              type="button"
              role="switch"
              aria-checked={mfaEmailEnabled}
              aria-label="Activar método email"
              disabled={isMethodToggleDisabled}
              className={clsx(
                mfaEmailEnabled ? toggleOn : toggleOff,
                isMethodToggleDisabled && "cursor-not-allowed opacity-70",
              )}
              data-testid="mfa-email-toggle"
              onClick={() => handleToggleMfaMethod("Email", !mfaEmailEnabled)}
            >
              <span className={mfaEmailEnabled ? toggleThumbOn : toggleThumbOff} />
            </button>
          </div>
        </div>

        <div className={row}>
          <div className={rowContent}>
            <h3 className={rowTitle}>Acceso con huella o passkey</h3>
            <p className={rowDescription}>
              Inicia sesión con tu dispositivo (huella, Face ID o PIN). Tu
              identidad se valida sin compartir información.
            </p>
          </div>

          <div className={actionColumn}>
            <button
              type="button"
              role="switch"
              aria-checked={mfaPasskeyEnabled}
              aria-label="Activar acceso con huella o passkey"
              disabled={isMethodToggleDisabled}
              className={clsx(
                mfaPasskeyEnabled ? toggleOn : toggleOff,
                isMethodToggleDisabled && "cursor-not-allowed opacity-70",
              )}
              data-testid="mfa-passkey-toggle"
              onClick={() => {
                void handlePasskeyToggle();
              }}
            >
              <span className={mfaPasskeyEnabled ? toggleThumbOn : toggleThumbOff} />
            </button>
            <button
              type="button"
              className={linkAction}
              onClick={() => router.push("/main-page/configuration/devices")}
            >
              Administrar dispositivos
            </button>
          </div>
        </div>

        {/* <div className={row}>
          <div className={rowContent}>
            <h3 className={rowTitle}>Dispositivos de confianza</h3>
            <p className={rowDescription}>
              Cuando inicies sesión en otro dispositivo, se añadirá aquí y podrá
              recibir automáticamente solicitudes de inicio de sesión en el
              dispositivo.
            </p>
          </div>
        </div> */}

        <div className={row}>
          <div className={rowContent}>
            <h3 className={rowTitle}>Cerrar sesión en este dispositivo</h3>
          </div>

          <button type="button" className={outlineAction}>
            Cerrar sesión
          </button>
        </div>

        <div className={row}>
          <div className={rowContent}>
            <h3 className={rowTitle}>
              Cerrar sesión en todos los dispositivos
            </h3>
            <p className={rowDescription}>
              Cerrar sesión en todos los dispositivos con sesiones activas,
              incluida la actual. El cierre en otros dispositivos puede tardar
              hasta 30 minutos.
            </p>
          </div>

          <button type="button" className={dangerAction}>
            Cerrar todas las sesiones
          </button>
        </div>
      </div>

      <PopUp
        open={isPasskeyPopupOpen}
        onClose={() => setIsPasskeyPopupOpen(false)}
        title="Activar acceso con huella o passkey"
        content="Registra este dispositivo para que puedas iniciar sesión con huella, Face ID, Touch ID, Windows Hello o PIN."
        showSecondaryButton
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={() => setIsPasskeyPopupOpen(false)}
        showPrimaryButton
        primaryButtonText={registeringUserPasskey ? "Registrando..." : "Registrar dispositivo"}
        onPrimaryButtonClick={() => {
          void handleRegisterPasskeyFromSecurity();
        }}
      >
        <div className="mt-2 mb-4">
          <Input
            placeholder="Nombre del dispositivo"
            value={deviceName}
            disabled={registeringUserPasskey}
            onChange={(event) => setDeviceName(event.target.value)}
          />
        </div>
        {error && <p className="mt-2 text-center text-b3 text-[#A11E38]">{error}</p>}
      </PopUp>
    </section>
  );
};

export default MfaSecurityPanel;
