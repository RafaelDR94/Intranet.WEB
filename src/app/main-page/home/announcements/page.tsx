"use client"

import { useEffect, useState } from "react";
import Image from "next/image";

import { isPasskeySupported } from "@/app/services/passkeys/PasskeyService";
import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";

const Announcements = () => {
  const [showPasskeyPrompt, setShowPasskeyPrompt] = useState(false);
  const [showPasskeyCreating, setShowPasskeyCreating] = useState(false);
  const [passkeySupported, setPasskeySupported] = useState(true);
  const registerUserPasskeyOptions = useAuthStore((state) => state.registerUserPasskeyOptions);
  const registeringUserPasskey = useAuthStore((state) => state.registeringUserPasskey);
  const passkeyError = useAuthStore((state) => state.error);

  useEffect(() => {
    const sessionKey = "home-announcements-passkey-prompt-dismissed";
    const dismissed = sessionStorage.getItem(sessionKey) === "1";
    if (!dismissed) setShowPasskeyPrompt(true);
  }, []);

  useEffect(() => {
    void isPasskeySupported().then((supported) => {
      setPasskeySupported(supported);
    });
  }, []);

  const dismissPrompt = () => {
    sessionStorage.setItem("home-announcements-passkey-prompt-dismissed", "1");
    setShowPasskeyPrompt(false);
  };

  const getDynamicDeviceName = () => {
    if (typeof navigator === "undefined") return "Mi dispositivo";
    const platform = navigator.platform || "Dispositivo";
    const userAgent = navigator.userAgent || "";
    let browser = "Navegador";
    if (userAgent.includes("Edg/")) browser = "Edge";
    else if (userAgent.includes("Chrome/")) browser = "Chrome";
    else if (userAgent.includes("Firefox/")) browser = "Firefox";
    else if (userAgent.includes("Safari/") && !userAgent.includes("Chrome/")) browser = "Safari";
    return `${platform} - ${browser}`;
  };

  const handleActivatePasskey = async () => {
    if (!passkeySupported) {
      dismissPrompt();
      return;
    }

    const deviceName = getDynamicDeviceName().trim();
    if (!deviceName) return;

    setShowPasskeyPrompt(false);
    setShowPasskeyCreating(true);

    const ok = await registerUserPasskeyOptions(deviceName);
    if (!ok) {
      setShowPasskeyCreating(false);
      setShowPasskeyPrompt(true);
      return;
    }

    dismissPrompt();
    setShowPasskeyCreating(false);
  };

  return (
    <div style={{ ["--topbar-h" as any]: "130px" }}>
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
          <div className="flex flex-col items-center justify-center text-center py-8 md:py-0">
            <div className="relative mb-5 h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28">
              <Image
                src="/images/DR_Logo.svg"
                alt="DR Security"
                fill
                className="object-contain"
                priority
              />
            </div>

            <h1 className="font-display leading-[0.98] tracking-[-0.01em] text-blue-90 text-h3 sm:text-h2 md:text-h1">
              BIENVENIDO A LA INTRANET
            </h1>

            <p className="mt-4 sm:mt-5 max-w-[860px] font-sans text-blue-50 text-b2 sm:text-s1 font-semibold">
              Un nuevo espacio donde podras acceder a informacion, herramientas y recursos clave.
            </p>

            <p className="mt-3 sm:mt-4 font-sans text-blue-50 text-c1 sm:text-b2 font-medium">
              Este es tu espacio. Disfrutalo.
            </p>
          </div>

          <p className="self-start ps-2 sm:ps-6 max-w-[1020px] font-sans text-blue-50 text-c2 sm:text-c1">
            *Seguimos trabajando constantemente para mejorar y ampliar las funcionalidades, con el objetivo de que cada vez sea mas util y practica para todos.
          </p>
        </div>
      </section>

      {showPasskeyPrompt && (
        <div className="fixed inset-0 z-[950] flex items-center justify-center bg-[#124A64]/55 px-4 backdrop-blur-[2px]">
          <div className="relative w-[355px] max-w-full rounded-[16px] bg-white-100 p-6 shadow-[0px_24px_48px_rgba(2,28,43,0.25)] md:w-[465px]">
            <button
              type="button"
              aria-label="Cerrar aviso de passkey"
              className="absolute right-4 top-4 text-[#5E8EA2] hover:text-[#0B5D84]"
              onClick={dismissPrompt}
            >
              <span className="text-s1 font-semibold">x</span>
            </button>

            <h2 className="text-center text-s1 font-semibold text-[#124A64]">
              Activar Passkey para este dispositivo
            </h2>
            <p className="mt-3 text-center text-b3 text-[#5B7585]">
              Dar de alta el Passkey para este dispositivo puede hacer mas facil y rapido el inicio de sesion la
              siguiente vez que quieras ingresar a la intranet.
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
                {passkeySupported ? "Activar Passkey" : "Entrar con contraseña"}
              </button>
            </div>
            {!passkeySupported && (
              <p className="mt-3 text-center text-b3 text-[#A11E38]">
                Este dispositivo no soporta passkeys.
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
              aria-label="Cerrar aviso de activacion de passkey"
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
              Activando Passkey para este dispositivo
            </h2>
            <p className="mt-3 text-center text-b3 text-[#5B7585]">
              {registeringUserPasskey
                ? "Creando Passkey, espere un momento por favor..."
                : "Passkey activado correctamente para este dispositivo."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
