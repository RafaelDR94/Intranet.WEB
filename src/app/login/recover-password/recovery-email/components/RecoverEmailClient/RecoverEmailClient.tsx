"use client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { recoverEmailStyles } from "./styles";

import { intranetClient } from "@/app/configurations/Axios/Clients";
import { basicPut } from "@/app/configurations/Axios/GenericMethods";
import { AuthRecoverPassword } from "@/app/configurations/Axios/urls";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import logoDesktop from "@/assets/images/Walpapers/Wallpaper-1.png";
import logoMobile from "@/assets/images/Walpapers/wallpaper-mobile-rp.png"

const RecoverEmailClient = () => {
    const searchParams = useSearchParams();
    const email = searchParams.get("email") ?? "";
    const { usePrincipalAlert } = usePrincipal();
    const { showAlert, hideAlert } = usePrincipalAlert;

    const handleResend = async () => {
        try {
            await basicPut(
                intranetClient,
                `${AuthRecoverPassword}?username=${encodeURIComponent(email)}`,
                {},
                (response) => {
                    if (response.status !== 200) {
                        throw new Error('No se pudo enviar el correo');
                    }
                }
            );
            // opcional: feedback de éxito
            showAlert({
                type: 'success',
                variant: 'subtle',
                title: 'Correo enviado',
                description: 'Revisa tu bandeja o spam.',
                onPrimaryClick: hideAlert,
                showSecondaryButton: false,
            });
        } catch {
            showAlert({
                type: 'error',
                variant: 'subtle',
                title: 'Error',
                description: 'No se pudo reenviar el correo',
                onPrimaryClick: hideAlert,
                showSecondaryButton: false,
            });
        }
    };

    return (
        <div>
            {/* Imagen de fondo */}
            <Image
                src={logoDesktop}
                alt="Fondo DR Security (desktop)"
                fill
                priority
                className={`${recoverEmailStyles.image} hidden sm:block`}
            />
            <Image
                src={logoMobile}
                alt="Fondo DR Security (móvil)"
                fill
                priority
                className={`${recoverEmailStyles.image} block sm:hidden`}
            />

            {/* Overlay azul */}
            <div className={recoverEmailStyles.bgOverlay} />

            {/* Contenido centrado */}
            <div className={recoverEmailStyles.contentCenter}>
                <div className={recoverEmailStyles.card}>
                    <p className={recoverEmailStyles.contentText}>
                        Se ha enviado un correo de recuperación de contraseña a {email}
                    </p>
                </div>
                <div className={recoverEmailStyles.btnWrapper}>
                    <Link
                        className={recoverEmailStyles.btnTxt}
                        href="/login/recover-password"
                    >
                        ¿No recibiste el correo?
                    </Link>
                    <button
                        className={recoverEmailStyles.btnTxtSec}
                        onClick={handleResend}
                    >
                        Reenviar correo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecoverEmailClient;
