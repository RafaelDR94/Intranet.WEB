"use client";
import logo from "@/assets/images/Walpapers/Wallpaper-1.png";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { recoverEmailStyles } from "./styles";

const RecoverEmail = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const { usePrincipalAlert } = usePrincipal();
  const { showAlert, hideAlert } = usePrincipalAlert;

  const handleResend = async () => {
    try {
      const res = await fetch(
        `https://localhost:7040/Auth/RecoverPassword?username=${encodeURIComponent(
          email
        )}`
      );
      if (!res.ok) throw new Error();
      showAlert({
        type: "info",
        variant: "subtle",
        title: "Correo reenviado",
        description: "Se reenvió el correo de recuperación",
        onPrimaryClick: hideAlert,
        showSecondaryButton: false,
      });
    } catch {
      showAlert({
        type: "error",
        variant: "subtle",
        title: "Error",
        description: "No se pudo reenviar el correo",
        onPrimaryClick: hideAlert,
        showSecondaryButton: false,
      });
    }
  };

  return (
    <div>
      {/* Imagen de fondo */}
      <Image
        src={logo}
        alt="Fondo DR Security"
        fill
        priority
        className={recoverEmailStyles.image}
      />

      {/* Overlay azul */}
      <div className={recoverEmailStyles.bgOverlay} />

      {/* Contenido centrado */}
      <div className={recoverEmailStyles.contentCenter}>
        <div className={recoverEmailStyles.card}>
            <p className={recoverEmailStyles.contentText}>Se ha enviado un correo de recuperación de contraseña a {email}</p>
        </div>
        <div className={recoverEmailStyles.btnWrapper}>
            <Link className={recoverEmailStyles.btnTxt} href='/login/recover-password'>¿No recibiste el correo?</Link>
            <button className={recoverEmailStyles.btnTxtSec} onClick={handleResend}>Reenviar correo</button>
        </div>
      </div>
    </div>
  );
};

export default RecoverEmail;
