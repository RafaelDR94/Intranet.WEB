"use client";

import { useEffect, useState } from "react";

import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";
import { Button } from "@/app/components/Button/Button";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { Input } from "@/app/components/Input/Input";

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

const DevicesPage = () => {
  const [isNewDevicePopupOpen, setIsNewDevicePopupOpen] = useState(false);
  const [isConfirmIdentityPopupOpen, setIsConfirmIdentityPopupOpen] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const user = useAuthStore((state) => state.user);
  const userPasskeys = useAuthStore((state) => state.userPasskeys);
  const fetchingUserPasskeys = useAuthStore((state) => state.fetchingUserPasskeys);
  const deletingUserPasskey = useAuthStore((state) => state.deletingUserPasskey);
  const registeringUserPasskey = useAuthStore((state) => state.registeringUserPasskey);
  const fetchUserPasskeys = useAuthStore((state) => state.fetchUserPasskeys);
  const deleteUserPasskey = useAuthStore((state) => state.deleteUserPasskey);
  const registerUserPasskeyOptions = useAuthStore((state) => state.registerUserPasskeyOptions);

  useEffect(() => {
    if (!user?.idUser) return;
    void fetchUserPasskeys(user.idUser);
  }, [fetchUserPasskeys, user?.idUser]);

  useEffect(() => {
    setDeviceName(getDynamicDeviceName());
  }, []);

  const handleRegisterDevice = async () => {
    const normalizedDeviceName = deviceName.trim();
    if (!normalizedDeviceName) return;

    const ok = await registerUserPasskeyOptions(normalizedDeviceName);
    if (!ok) return;

    setIsNewDevicePopupOpen(false);
    setIsConfirmIdentityPopupOpen(true);
    if (user?.idUser) {
      void fetchUserPasskeys(user.idUser);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-[#3A97B5] pb-2">
        <button type="button" className="text-b4 font-medium text-[#0B5D84]">
          Administración de dispositivos
        </button>

        <Button
          variant="solid"
          hideIcon
          onClick={() => setIsNewDevicePopupOpen(true)}
        >
          Nuevo dispositivo
        </Button>
      </div>

      <section className="rounded-[10px] bg-white-100 p-6 shadow-[0px_2px_4px_-2px_rgba(19,25,39,0.12),0px_4px_4px_-2px_rgba(19,25,39,0.08)]">
        <h2 className="text-b4 font-medium text-blue-70">Dispositivos con inicio de sesión en la intranet</h2>

        {fetchingUserPasskeys ? (
          <p className="mt-5 text-b4 text-gray-70">Cargando dispositivos...</p>
        ) : userPasskeys.length === 0 ? (
          <p className="mt-5 text-b4 text-gray-70">No hay dispositivos vinculados.</p>
        ) : (
          <div className="mt-5 flex flex-col gap-4">
            {userPasskeys.map((passkey) => (
              <div key={passkey.id} className="flex items-center justify-between gap-4">
                <p className="text-b4 text-blue-70">{passkey.friendlyName || "Dispositivo sin nombre"}</p>

                <Button
                  variant="solid"
                  disabled={deletingUserPasskey}
                  hideIcon
                  onClick={() => {
                    void deleteUserPasskey(passkey.id);
                  }}
                >
                  Desvincular dispositivo
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      <PopUp
        open={isNewDevicePopupOpen}
        onClose={() => setIsNewDevicePopupOpen(false)}
        title="Activar acceso con huella o passkey"
        content="Vamos a registrar este dispositivo para que puedas iniciar sesión con huella, Face ID, Touch ID, Windows Hello o PIN."
        showSecondaryButton
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={() => setIsNewDevicePopupOpen(false)}
        showPrimaryButton
        primaryButtonText={registeringUserPasskey ? "Activando..." : "Aceptar"}
        onPrimaryButtonClick={() => {
          void handleRegisterDevice();
        }}
      >
        <div className="mt-2 mb-6">
          <Input
            placeholder="Nombre del dispositivo"
            value={deviceName}
            disabled={registeringUserPasskey}
            onChange={(event) => setDeviceName(event.target.value)}
          />
        </div>
      </PopUp>

      <PopUp
        open={isConfirmIdentityPopupOpen}
        onClose={() => setIsConfirmIdentityPopupOpen(false)}
        title="Confirma tu identidad"
        content="Sigue las instrucciones de tu dispositivo. Tu huella nunca se comparte con DR Security."
        showSecondaryButton
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={() => setIsConfirmIdentityPopupOpen(false)}
        showPrimaryButton
        primaryButtonText="Aceptar"
        onPrimaryButtonClick={() => setIsConfirmIdentityPopupOpen(false)}
      />
    </div>
  );
};

export default DevicesPage;
