"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";

const DevicesPage = () => {
  const user = useAuthStore((state) => state.user);
  const userPasskeys = useAuthStore((state) => state.userPasskeys);
  const fetchingUserPasskeys = useAuthStore((state) => state.fetchingUserPasskeys);
  const deletingUserPasskey = useAuthStore((state) => state.deletingUserPasskey);
  const fetchUserPasskeys = useAuthStore((state) => state.fetchUserPasskeys);
  const deleteUserPasskey = useAuthStore((state) => state.deleteUserPasskey);

  useEffect(() => {
    if (!user?.idUser) return;
    void fetchUserPasskeys(user.idUser);
  }, [fetchUserPasskeys, user?.idUser]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-[#3A97B5] pb-2">
        <button type="button" className="text-b4 font-medium text-[#0B5D84]">
          Administración de dispositivos
        </button>

        <button
          type="button"
          className="h-10 rounded-[14px] bg-[#3A97B5] px-8 text-s2 font-semibold text-white-100"
        >
          Nuevo dispositivo
        </button>
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

                <button
                  type="button"
                  disabled={deletingUserPasskey}
                  className="h-10 min-w-[230px] rounded-[10px] border border-[#3A97B5] px-6 text-s2 font-semibold text-[#2F9BB5] disabled:cursor-not-allowed disabled:opacity-70"
                  onClick={() => {
                    void deleteUserPasskey(passkey.id);
                  }}
                >
                  Desvincular dispositivo
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DevicesPage;
