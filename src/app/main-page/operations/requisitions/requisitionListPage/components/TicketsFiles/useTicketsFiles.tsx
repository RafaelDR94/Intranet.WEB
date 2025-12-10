const useTicketsFiles = () => {
  const columns: any = [
    {
      key: "",
      label: "Id",
      cellClass: "w-1/15 text-left",
      headerClass: "w-1/15 text-left",
    },
    {
      key: "",
      label: "Archivos",
      cellClass: "w-2/15 text-left",
      headerClass: "w-2/15 text-left",
    },
    {
      key: "",
      label: "Fecha",
      cellClass: "w-2/15 text-left",
      headerClass: "w-2/15 text-left",
    },
    {
      key: "",
      label: "Categoría",
      cellClass: "w-4/15 text-left",
      headerClass: "w-4/15 text-left",
    },
    {
      key: "",
      label: "Estatus",
      cellClass: "w-3/15 text-right",
      headerClass: "w-3/15 text-right",
    },
    {
      key: "",
      label: "Comentario",
      cellClass: "w-2/15 text-right",
      headerClass: "w-2/15 text-right",
    },
    {
      key: "",
      label: "Detalle",
      cellClass: "w-2/15 text-right",
      headerClass: "w-2/15 text-right",
    },
    
  ];

  return {
    columns,
  };
};

export default useTicketsFiles;
