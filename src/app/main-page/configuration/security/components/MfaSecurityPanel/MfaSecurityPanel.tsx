"use client";

import clsx from "clsx";
import { useEffect, useMemo } from "react";

import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";

import {
  actionColumn,
  header,
  linkAction,
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
  const user = useAuthStore((state) => state.user);
  const changingMFA = useAuthStore((state) => state.changingMFA);
  const changingMFAMethod = useAuthStore((state) => state.changingMFAMethod);
  const fetchingUserMfaById = useAuthStore((state) => state.fetchingUserMfaById);
  const mfaSmsEnabled = useAuthStore((state) => state.mfaSmsEnabled);
  const mfaEmailEnabled = useAuthStore((state) => state.mfaEmailEnabled);
  const userMfaById = useAuthStore((state) => state.userMfaById);
  const changeMfaStatus = useAuthStore((state) => state.changeMfaStatus);
  const changeMfaMethodStatus = useAuthStore((state) => state.changeMfaMethodStatus);
  const fetchUserMfaById = useAuthStore((state) => state.fetchUserMfaById);
  const mfaEnabled = useMemo(
    () => Boolean(userMfaById?.twoFactorEnabled ?? user?.twoFactorEnabled ?? false),
    [user, userMfaById],
  );

  useEffect(() => {
    if (!user?.idUser) return;
    void fetchUserMfaById(user.idUser);
  }, [fetchUserMfaById, user?.idUser]);

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
        method: "EMAIL",
        isEnabled: true,
      });
    }
  };

  const handleToggleMfaMethod = async (method: "SMS" | "EMAIL", isEnabled: boolean) => {
    if (!user?.idUser || changingMFAMethod) return;
    await changeMfaMethodStatus({
      idUser: user.idUser,
      method,
      isEnabled,
    });
  };

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
              disabled={changingMFAMethod || fetchingUserMfaById || !user?.idUser}
              className={clsx(
                mfaSmsEnabled ? toggleOn : toggleOff,
                (changingMFAMethod || fetchingUserMfaById || !user?.idUser) && "cursor-not-allowed opacity-70",
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
              disabled={changingMFAMethod || fetchingUserMfaById || !user?.idUser}
              className={clsx(
                mfaEmailEnabled ? toggleOn : toggleOff,
                (changingMFAMethod || fetchingUserMfaById || !user?.idUser) && "cursor-not-allowed opacity-70",
              )}
              data-testid="mfa-email-toggle"
              onClick={() => handleToggleMfaMethod("EMAIL", !mfaEmailEnabled)}
            >
              <span className={mfaEmailEnabled ? toggleThumbOn : toggleThumbOff} />
            </button>
          </div>
        </div>

        {/* <div className={row}>
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
              aria-checked={mfaEnabled}
              aria-label="Activar acceso con huella o passkey"
              disabled={changingMFAMethod || fetchingUserMfaById || !user?.idUser}
              className={clsx(
                mfaEnabled ? toggleOn : toggleOff,
                (changingMFAMethod || fetchingUserMfaById || !user?.idUser) && "cursor-not-allowed opacity-70",
              )}
              data-testid="mfa-passkey-toggle"
            >
              <span className={mfaEnabled ? toggleThumbOn : toggleThumbOff} />
            </button>
            <button
              type="button"
              className={linkAction}
              onClick={() => router.push("/main-page/configuration/devices")}
            >
              Administrar dispositivos
            </button>
          </div>
        </div> */}

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

        {/* <div className={row}>
          <div className={rowContent}>
            <h3 className={rowTitle}>Cerrar sesión en este dispositivo</h3>
          </div>

          <button type="button" className={outlineAction}>
            Cerrar sesión
          </button>
        </div> */}

        {/* <div className={row}>
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
        </div> */}
      </div>
    </section>
  );
};

export default MfaSecurityPanel;
