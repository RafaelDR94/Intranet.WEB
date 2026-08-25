"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  getPasskeyDeviceName,
  getPasskeyDeviceNameCandidates,
  normalizePasskeyDeviceName,
} from "@/app/services/passkeys/deviceName";
import { isPasskeySupported } from "@/app/services/passkeys/PasskeyService";
import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";
import LogoGc from "@/assets/images/LogosCG/LogoGC.jpeg";

const PASSKEY_PROMPT_SESSION_KEY = "home-announcements-passkey-prompt-dismissed";

const Announcements = () => {
  const [showPasskeyPrompt, setShowPasskeyPrompt] = useState(false);
  const [showPasskeyCreating, setShowPasskeyCreating] = useState(false);
  const [passkeySupported, setPasskeySupported] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const [deviceName, setDeviceName] = useState("Mi dispositivo");
  const [promptEligibilityReady, setPromptEligibilityReady] = useState(false);
  const user = useAuthStore((state) => state.user);
  const userPasskeys = useAuthStore((state) => state.userPasskeys);
  const fetchUserPasskeys = useAuthStore((state) => state.fetchUserPasskeys);
  const registerUserPasskeyOptions = useAuthStore((state) => state.registerUserPasskeyOptions);
  const registeringUserPasskey = useAuthStore((state) => state.registeringUserPasskey);
  const passkeyError = useAuthStore((state) => state.error);

  useEffect(() => {
    setDeviceName(getPasskeyDeviceName());
  }, []);

  useEffect(() => {
    void isPasskeySupported().then((supported) => {
      setPasskeySupported(supported);
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const syncViewport = () => {
      setIsDesktop(mediaQuery.matches);
    };

    syncViewport();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncViewport);
      return () => mediaQuery.removeEventListener("change", syncViewport);
    }

    mediaQuery.addListener(syncViewport);
    return () => mediaQuery.removeListener(syncViewport);
  }, []);

  useEffect(() => {
    if (isDesktop) {
      setPromptEligibilityReady(true);
      setShowPasskeyPrompt(false);
      return;
    }

    if (!user?.idUser) {
      setPromptEligibilityReady(true);
      return;
    }

    let cancelled = false;
    setPromptEligibilityReady(false);

    void (async () => {
      await fetchUserPasskeys(user.idUser);
      if (!cancelled) setPromptEligibilityReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [fetchUserPasskeys, isDesktop, user?.idUser]);

  useEffect(() => {
    if (!promptEligibilityReady) return;
    if (typeof window === "undefined") return;

    const dismissed = sessionStorage.getItem(PASSKEY_PROMPT_SESSION_KEY) === "1";
    const currentDeviceCandidates = getPasskeyDeviceNameCandidates();
    const hasCurrentDevicePasskey = userPasskeys.some(
      (passkey) => currentDeviceCandidates.includes(normalizePasskeyDeviceName(passkey.friendlyName)),
    );

    setShowPasskeyPrompt(!dismissed && !isDesktop && !hasCurrentDevicePasskey);
  }, [isDesktop, promptEligibilityReady, userPasskeys]);

  const dismissPrompt = () => {
    sessionStorage.setItem(PASSKEY_PROMPT_SESSION_KEY, "1");
    setShowPasskeyPrompt(false);
  };

  const handleActivatePasskey = async () => {
    if (!passkeySupported) {
      dismissPrompt();
      return;
    }

    const normalizedDeviceName = deviceName.trim();
    if (!normalizedDeviceName) return;

    setShowPasskeyPrompt(false);
    setShowPasskeyCreating(true);

    const ok = await registerUserPasskeyOptions(normalizedDeviceName);
    if (!ok) {
      setShowPasskeyCreating(false);
      setShowPasskeyPrompt(true);
      return;
    }

    dismissPrompt();
    setShowPasskeyCreating(false);
  };

  return (
    <div style={{ ["--topbar-h" as never]: "130px" }}>
      <section className="relative w-full">
        <div className="fixed inset-0 -z-10">
          <Image
            src="/images/DR_IntranetBackground_Bienvenida-01.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div
          className="
            mx-auto grid
            h-[calc(100vh-var(--topbar-h,0px))]
            supports-[height:100svh]:h-[calc(100svh-var(--topbar-h,0px))]
            max-w-[1020px]
            grid-rows-[1fr_auto]
            px-4
            pb-[calc(24px+env(safe-area-inset-bottom))]
            overflow-y-auto md:overflow-y-clip
          "
        >
          <div className="flex flex-col items-center justify-center py-8 text-center md:py-0">
            <div className="relative mb-5 h-[92px] w-[160px] sm:h-[110px] sm:w-[190px] md:h-[128px] md:w-[220px]">
              <Image
                src={LogoGc}
                alt="Grupo Cantabria"
                fill
                className="object-contain"
                priority
              />
            </div>

            <h1 className="font-display text-h3 leading-[0.98] tracking-[-0.01em] text-blue-90 sm:text-h2 md:text-h1">
              BIENVENIDO A LA INTRANET
            </h1>

            <p className="mt-4 max-w-[860px] font-sans text-b2 font-semibold text-blue-50 sm:mt-5 sm:text-s1">
              Un nuevo espacio donde podras acceder a Información, herramientas y recursos clave.
            </p>

            <p className="mt-3 font-sans text-c1 font-medium text-blue-50 sm:mt-4 sm:text-b2">
              Este es tu espacio. Disfrutalo.
            </p>
          </div>

          <p className="max-w-[1020px] self-start ps-2 font-sans text-c2 text-blue-50 sm:ps-6 sm:text-c1">
            *Seguimos trabajando constantemente para mejorar y ampliar las funcionalidades, con el objetivo de que cada vez sea mas util y practica para todos.
          </p>
        </div>
      </section>

      {showPasskeyPrompt && (
        <div className="fixed inset-0 z-[950] flex items-center justify-center bg-[#124A64]/55 px-4 backdrop-blur-[2px]">
          <div className="relative w-[355px] max-w-full rounded-[16px] bg-white-100 p-6 shadow-[0px_24px_48px_rgba(2,28,43,0.25)] md:w-[465px]">
            <button
              type="button"
              aria-label="Cerrar aviso de autenticación con dispositivo"
              className="absolute right-4 top-4 text-[#5E8EA2] hover:text-[#0B5D84]"
              onClick={dismissPrompt}
            >
              <span className="text-s1 font-semibold">x</span>
            </button>

            <h2 className="text-center text-s1 font-semibold text-[#124A64]">
              Activar autenticación con dispositivo
            </h2>
            <p className="mt-3 text-center text-b3 text-[#5B7585]">
              Registrar este dispositivo puede hacer más fácil y rápido tu próximo inicio de sesión en la intranet.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                className="h-11 rounded-[10px] border border-[#2F9BB5] px-8 text-s2 font-semibold text-[#2F9BB5] hover:bg-[#2F9BB5]/5"
                onClick={dismissPrompt}
              >
                No, gracias
              </button>
              <button
                type="button"
                disabled={registeringUserPasskey}
                className="h-11 rounded-[10px] bg-[#0E506D] px-8 text-s2 font-semibold text-white-100 hover:bg-[#0B435B] disabled:cursor-not-allowed disabled:opacity-70"
                onClick={() => {
                  void handleActivatePasskey();
                }}
              >
                {passkeySupported ? "Registrar dispositivo" : "Entrar con contraseña"}
              </button>
            </div>
            {!passkeySupported && (
              <p className="mt-3 text-center text-b3 text-[#A11E38]">
                Este dispositivo no soporta autenticación con dispositivo.
              </p>
            )}
            {passkeyError && (
              <p className="mt-3 text-center text-b3 text-[#A11E38]">{passkeyError}</p>
            )}
          </div>
        </div>
      )}

      {showPasskeyCreating && (
        <div className="fixed inset-0 z-[950] flex items-center justify-center bg-[#124A64]/55 px-4 backdrop-blur-[2px]">
          <div className="relative w-[355px] max-w-full rounded-[16px] bg-white-100 p-6 shadow-[0px_24px_48px_rgba(2,28,43,0.25)] md:w-[465px]">
            <button
              type="button"
              aria-label="Cerrar aviso de activación de autenticación con dispositivo"
              className="absolute right-4 top-4 text-[#5E8EA2] hover:text-[#0B5D84]"
              onClick={() => {
                if (registeringUserPasskey) return;
                setShowPasskeyCreating(false);
                dismissPrompt();
              }}
            >
              <span className="text-s1 font-semibold">x</span>
            </button>

            <h2 className="text-center text-s1 font-semibold text-[#124A64]">
              Activando autenticación con dispositivo
            </h2>
            <p className="mt-3 text-center text-b3 text-[#5B7585]">
              {registeringUserPasskey
                ? "Registrando el dispositivo, espera un momento por favor..."
                : "La autenticación con dispositivo quedó activada correctamente."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
