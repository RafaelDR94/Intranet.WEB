"use client";
import { recoverPasswordStyles } from "./styles";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import logoDesktop from "@/assets/images/Walpapers/Wallpaper-1.png";
import logoMobile from "@/assets/images/Walpapers/wallpaper-mobile-rp.png"
import Image from "next/image";
import useRecoverPassword, {
  recoverPasswordFields,
} from "./hooks/useRecoverPassword/useRecoverPassword";

const RecoverPassword = () => {
  const { handleRecover, isLoading } = useRecoverPassword();

  return (
    <div className={recoverPasswordStyles.container}>
      {/* Imagen de fondo */}
      <Image
        src={logoDesktop}
        alt="Fondo DR Security (desktop)"
        fill
        priority
        className={`${recoverPasswordStyles.image} hidden sm:block`}
      />
      <Image
        src={logoMobile}
        alt="Fondo DR Security (móvil)"
        fill
        priority
        className={`${recoverPasswordStyles.image} block sm:hidden`}
      />

      {/* Overlay azul */}
      <div className={recoverPasswordStyles.bgOverlay} />

      {/* Contenido centrado */}
      <div className={recoverPasswordStyles.contentCenter}>
        <div className={recoverPasswordStyles.card}>
          <DynamicForm
            title=""
            fields={recoverPasswordFields}
            submitLabel="Restaurar Contraseña"
            onSubmit={handleRecover}
            loading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default RecoverPassword;
