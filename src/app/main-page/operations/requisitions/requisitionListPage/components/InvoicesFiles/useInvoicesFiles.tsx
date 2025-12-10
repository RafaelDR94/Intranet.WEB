import ChatIcon from "@/assets/icons/Comunicacion/chat-lines.svg";
import { Button } from "@/app/components/Button/Button";

const useInvoicesFiles = () => {
  const columns: any = [
    {
      key: "",
      label: "Id",
    },
    {
      key: "",
      label: "Archivos",
    },
    {
      key: "",
      label: "Fecha",
    },
    {
      key: "",
      label: "Categoría",
    },
    {
      key: "",
      label: "Estatus",
    },
    {
      key: "",
      label: "Comentario",
      render: () => (
        <Button
          size="small"
          //   onClick={() => handleOpenDetails(row)}
          variant="ghost"
          hideIcon
        >
          <ChatIcon className="h-6 w-6" />
        </Button>
      ),
    },
    {
      key: "",
      label: "Detalle",
    },
    {
      key: "",
      label: "Vincular",
    },
  ];

  return {
    columns,
  };
};

export default useInvoicesFiles;
