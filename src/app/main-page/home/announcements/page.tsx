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
import LogoGc from "@/assets/images/LogosCG/LogoGC.png";

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
        <div
          className="
            mx-auto flex flex-col items-center justify-center
            min-h-[calc(100vh-var(--topbar-h,0px))]
            supports-[height:100svh]:min-h-[calc(100svh-var(--topbar-h,0px))]
            px-4 sm:px-6 lg:px-8 py-12
            relative
            overflow-y-auto overflow-x-hidden
          "
        >
          {/* Animated Background Glow */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 flex items-center justify-center">
            {/* Cyan glow */}
            <div className="absolute w-[90vw] h-[90vw] max-w-[800px] max-h-[800px] rounded-full bg-[#2F9BB5]/30 blur-[100px] md:blur-[150px] dark:bg-[#2F9BB5]/20 translate-x-1/3 -translate-y-1/4 animate-pulse [animation-duration:10s]" />
            {/* Darker Blue glow */}
            <div className="absolute w-[80vw] h-[80vw] max-w-[700px] max-h-[700px] rounded-full bg-[#0E506D]/30 blur-[100px] md:blur-[150px] dark:bg-[#0E506D]/40 -translate-x-1/3 translate-y-1/4 animate-pulse [animation-duration:7s] [animation-delay:1s]" />
            {/* Teal/Light glow */}
            <div className="absolute w-[70vw] h-[70vw] max-w-[600px] max-h-[600px] rounded-full bg-[#5E8EA2]/30 blur-[100px] md:blur-[150px] dark:bg-[#5E8EA2]/20 animate-pulse [animation-duration:8s] [animation-delay:2s]" />
          </div>

          {/* Glassmorphism Card */}
          <div className="relative w-full max-w-4xl mx-auto rounded-[32px] sm:rounded-[48px] bg-white-100/40 dark:bg-[#0B141A]/30 backdrop-blur-3xl border border-white-100/50 dark:border-[#FFFFFF]/10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.3)] overflow-hidden">
            
            {/* Inner subtle glow for the card */}
            <div className="absolute inset-0 bg-gradient-to-br from-white-100/40 to-transparent dark:from-[#FFFFFF]/5 dark:to-transparent pointer-events-none" />
            
            <div className="relative px-6 py-12 sm:px-16 sm:py-20 md:py-24 flex flex-col items-center text-center">
              <div className="relative mb-10 group">
                {/* Logo glow effect that intensifies on hover */}
                <div className="absolute inset-0 rounded-full bg-[#2F9BB5]/20 dark:bg-[#2F9BB5]/10 blur-[40px] md:blur-[60px] transition-all duration-700 group-hover:bg-[#2F9BB5]/40 group-hover:scale-125" />
                
                <div className="relative h-[100px] w-[180px] sm:h-[130px] sm:w-[240px] md:h-[150px] md:w-[260px] transform transition-transform duration-700 group-hover:scale-105">
                  <Image
                    src={LogoGc}
                    alt="Grupo Cantabria"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>

              <h1 className="relative font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#0E506D] to-[#2F9BB5] dark:from-[#FFFFFF] dark:to-[#8ACDE0] drop-shadow-sm mb-6">
                BIENVENIDO A LA INTRANET
              </h1>

              <p className="relative max-w-[700px] font-sans text-lg sm:text-xl font-medium text-[#124A64]/80 dark:text-[#FFFFFF]/80 mb-8 leading-relaxed">
                Un nuevo espacio digital diseñado para ti. Accede rápidamente a toda la 
                <span className="text-[#0E506D] dark:text-[#FFFFFF] font-semibold"> información, herramientas y recursos clave </span> 
                que necesitas en tu día a día.
              </p>

              {/* Decorative Features Section */}
              <div className="relative flex justify-center gap-4 sm:gap-6 mt-4 w-full flex-wrap">
                {['Información Centralizada', 'Herramientas Útiles', 'Recursos Clave'].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white-100/50 dark:bg-[#FFFFFF]/5 border border-white-100/60 dark:border-[#FFFFFF]/10 shadow-sm backdrop-blur-md hover:bg-white-100/80 dark:hover:bg-[#FFFFFF]/20 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-[#2F9BB5]" />
                    <span className="text-sm font-medium text-[#124A64] dark:text-[#FFFFFF]/90">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Footer inside card */}
            <div className="relative border-t border-white-100/40 dark:border-[#FFFFFF]/10 px-6 py-6 sm:px-16 bg-white-100/30 dark:bg-[#0B141A]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <p className="font-sans text-sm sm:text-base font-semibold text-[#124A64]/90 dark:text-[#FFFFFF]/90">
                Este es tu espacio. ¡Disfrútalo!
              </p>
              <p className="font-sans text-xs sm:text-sm text-[#124A64]/60 dark:text-[#FFFFFF]/50 max-w-sm">
                *Seguimos trabajando para mejorar y ampliar las funcionalidades.
              </p>
            </div>
          </div>
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
