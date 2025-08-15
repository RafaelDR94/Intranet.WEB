import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import logo from "@/assets/images/Walpapers/Wallpaper-1.png";
import Image from "next/image";
import Link from "next/link";
import { recoverEmailStyles } from "./styles";

const RecoverEmail = () => {
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
            <p className={recoverEmailStyles.contentText}>Se ha enviado un correo de recuperación de contraseña a {`${''}`} </p>
        </div>
        <div className={recoverEmailStyles.btnWrapper}> 
            <Link className={recoverEmailStyles.btnTxt} href={''}>¿No recibiste el correo?</Link>
            <Link className={recoverEmailStyles.btnTxtSec} href={''}>Reenviar correo</Link>
        </div>
      </div>
    </div>
  );
};

export default RecoverEmail;
