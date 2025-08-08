import { ColumnDefinition } from "@/app/components/DataTable/types";
import { Button } from "@/app/components/Button/Button";
import ImageIcon from "@/assets/icons/Fotos y Videos/media-image.svg";
import DownloadIcon from "@/assets/icons/acciones/download.svg";
import HorizonIncon from "@/assets/icons/navegacion/more-horiz.svg";
import { DataTable } from "@/app/components/DataTable/DataTable";
const PictureTable = () => {
  type ImagenTicket = {
    id: string;
    imgIcon?: string;
    deudor: string;
    proyecto: string;
    fecha: string;
  };

  const columns: ColumnDefinition<ImagenTicket>[] = [
    {
      key: "imgIcon",
      headerRender: () => <span>IMG</span>,
      render: (row) => (
        <Button
          icon={ImageIcon}
          variant="ghost"
          onClick={() => console.log(row)}
        />
      ),
      cellClass: "w-20 text-center",
      headerClass: "w-20 text-center",
    },
    {
      key: "deudor",
      label: "DEUDOR",
      cellClass: "flex-1 text-left",
      headerClass: "flex-1 text-left",
    },
    {
      key: "proyecto",
      label: "PROYECTO",
    },
    {
      key: "acciones" as unknown as keyof ImagenTicket,
      headerRender: () => <HorizonIncon />,
      render: (row) => (
        <Button
          icon={DownloadIcon}
          variant="ghost"
          onClick={() => console.log(row)}
        />
      ),
      cellClass: "w-10 text-right",
      headerClass: "w-10 text-right",
    },
  ];

  const imagenes: ImagenTicket[] = [
    {
      id: "1",
      deudor: "Tania Guerrero",
      proyecto: "VISITAX",
      fecha: "08/08/2025",
    },
    {
      id: "2",
      deudor: "José Martínez",
      proyecto: "VISITAX",
      fecha: "07/08/2025",
    },
    {
      id: "3",
      deudor: "Karla López",
      proyecto: "VISITAX",
      fecha: "06/08/2025",
    },
    {
      id: "4",
      deudor: "Miguel Ángel Ruiz",
      proyecto: "VISITAX",
      fecha: "05/08/2025",
    },
    {
      id: "5",
      deudor: "Daniela Pérez",
      proyecto: "VISITAX",
      fecha: "04/08/2025",
    },
    {
      id: "6",
      deudor: "Luis Hernández",
      proyecto: "VISITAX",
      fecha: "03/08/2025",
    },
    {
      id: "7",
      deudor: "Ana Sofía Torres",
      proyecto: "VISITAX",
      fecha: "02/08/2025",
    },
    {
      id: "8",
      deudor: "Carlos Ramírez",
      proyecto: "VISITAX",
      fecha: "01/08/2025",
    },
    {
      id: "9",
      deudor: "Fernanda Sánchez",
      proyecto: "VISITAX",
      fecha: "31/07/2025",
    },
    {
      id: "10",
      deudor: "Roberto Gómez",
      proyecto: "VISITAX",
      fecha: "30/07/2025",
    },
    {
      id: "11",
      deudor: "Paola Castillo",
      proyecto: "VISITAX",
      fecha: "29/07/2025",
    },
    {
      id: "12",
      deudor: "Alejandro Ortega",
      proyecto: "VISITAX",
      fecha: "28/07/2025",
    },
    {
      id: "13",
      deudor: "Gabriela Mendoza",
      proyecto: "VISITAX",
      fecha: "27/07/2025",
    },
    {
      id: "14",
      deudor: "Sergio Vargas",
      proyecto: "VISITAX",
      fecha: "26/07/2025",
    },
    {
      id: "15",
      deudor: "Mariana Flores",
      proyecto: "VISITAX",
      fecha: "25/07/2025",
    },
    {
      id: "16",
      deudor: "Juan Pablo Navarro",
      proyecto: "VISITAX",
      fecha: "24/07/2025",
    },
    {
      id: "17",
      deudor: "Verónica Salinas",
      proyecto: "VISITAX",
      fecha: "23/07/2025",
    },
    {
      id: "18",
      deudor: "Ricardo Domínguez",
      proyecto: "VISITAX",
      fecha: "22/07/2025",
    },
    {
      id: "19",
      deudor: "Laura Cabrera",
      proyecto: "VISITAX",
      fecha: "21/07/2025",
    },
    {
      id: "20",
      deudor: "Héctor Morales",
      proyecto: "VISITAX",
      fecha: "20/07/2025",
    },
    {
      id: "21",
      deudor: "Andrea Pineda",
      proyecto: "VISITAX",
      fecha: "19/07/2025",
    },
    {
      id: "22",
      deudor: "Óscar Rojas",
      proyecto: "VISITAX",
      fecha: "18/07/2025",
    },
    {
      id: "23",
      deudor: "Sofía Camacho",
      proyecto: "VISITAX",
      fecha: "17/07/2025",
    },
  ];

  return (
    <DataTable
      onSearchChange={(value) => console.log("Buscando:", value)}
      onCalendarClick={() => console.log("Calendario")}
      onFilterClick={() => console.log("Filtro")}
      onSearch={() => console.log("Agregar")}
      actionLabel="Descargar"
      enableInternalSearch={true}
      dateKey="fecha"
      tables={[
        {
          columns,
          data: imagenes,
          enableSelection: true,
          title: "Imágenes de Tickets",
          enableCollaps: true,
        },
      ]}
    />
  );
};
export default PictureTable;
