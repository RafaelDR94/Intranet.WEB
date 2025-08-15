import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import logo from "@/assets/images/Walpapers/Wallpaper-1.png";
import Image from "next/image";
import { nesPasswordStyles } from "./styles";

const RecoverPassword = () => {
  const fields = [
    {
      name: "email",
      label: "Contraseña Nueva",
      type: "input",
      inputType: "email",
      helperText: "",
      inputSize: "lg",
      placeholder: "Escribe una nueva contraseña",
      value: "",
      validations: [
        { type: "required", message: "El correo es obligatorio" },
        { type: "email", message: "Formato de correo inválido" },
      ],
    },
    {
      name: "email",
      label: "Confirmar contraseña",
      type: "input",
      inputType: "email",
      helperText: "",
      inputSize: "lg",
      placeholder: "Confirmar nueva contraseña",
      value: "",
      validations: [
        { type: "required", message: "El correo es obligatorio" },
        { type: "email", message: "Formato de correo inválido" },
      ],
    },
  ];

  const handleSubmit = (values: any) => {
    console.log("Valores enviados:", values);
    // Lógica de restaurar contraseña
  };

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
            fields={fields}
            submitLabel="Guardar"
            // onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default RecoverPassword;


