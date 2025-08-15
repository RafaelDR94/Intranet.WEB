"use client";
import { recoverPasswordStyles } from "./styles";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import logo from "@/assets/images/Walpapers/Wallpaper-1.png";
import Image from "next/image";
import useRecoverPassword, {
  recoverPasswordFields,
} from "./hooks/useRecoverPassword";

const RecoverPassword = () => {
  const { handleRecover, isLoading } = useRecoverPassword();

  return (
    <div className={recoverPasswordStyles.container}>
      {/* Imagen de fondo */}
      <Image
        src={logo}
        alt="Fondo DR Security"
        fill
        priority
        className={recoverPasswordStyles.image}
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
