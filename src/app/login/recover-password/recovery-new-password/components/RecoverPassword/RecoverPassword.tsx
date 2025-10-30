"use client";
import Image from "next/image";

import useChangePassword,{changePasswordFields} from "../../../hooks/useChangePassword/useChangePassword";

import { nesPasswordStyles } from "./styles";

import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import logoDesktop from "@/assets/images/Walpapers/Wallpaper-1.png";
import logoMobile from "@/assets/images/Walpapers/wallpaper-mobile-rp.png"


const RecoverPassword = () => {
  const { handleChange, isLoading } = useChangePassword();

  return (
    <div className={nesPasswordStyles.container}>
      {/* Imagen de fondo */}
      <Image
        src={logoDesktop}
        alt="Fondo DR Security (desktop)"
        fill
        priority
        className={`${nesPasswordStyles.image} hidden sm:block`}
      />
      <Image
        src={logoMobile}
        alt="Fondo DR Security (móvil)"
        fill
        priority
        className={`${nesPasswordStyles.image} block sm:hidden`}
      />

      {/* Overlay azul */}
      <div className={nesPasswordStyles.bgOverlay} />

      {/* Contenido centrado */}
      <div className={nesPasswordStyles.contentCenter}>
        <div className={nesPasswordStyles.card}>
          <DynamicForm
            title=""
            fields={changePasswordFields}
            submitLabel="Guardar"
            onSubmit={handleChange}
            loading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default RecoverPassword;


