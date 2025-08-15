"use client";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import logo from "@/assets/images/Walpapers/Wallpaper-1.png";
import Image from "next/image";
import { nesPasswordStyles } from "./styles";
import useChangePassword, {
  changePasswordFields,
} from "../hooks/useChangePassword";

const RecoverPassword = () => {
  const { handleChange, isLoading } = useChangePassword();

  return (
    <div className={nesPasswordStyles.container}>
      {/* Imagen de fondo */}
      <Image
        src={logo}
        alt="Fondo DR Security"
        fill
        priority
        className={nesPasswordStyles.image}
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


