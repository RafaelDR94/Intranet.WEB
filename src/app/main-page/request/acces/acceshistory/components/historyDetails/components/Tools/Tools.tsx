import useTools from "./hooks/useTools";
import ContentDataTable from "@/app/components/ContentDataTable/ContentDataTable";
import { useState } from "react";

type Column = { key: string; label: string };

const Tools = () => {
  const { tools } = useTools();

  const [selected, setSelected] = useState<string[]>([]);

  const columns: Column[] = [
    { key: "quantity", label: "Cantidad" },
    { key: "brand", label: "Marca" },
    { key: "description", label: "Descripción" },
    { key: "model", label: "Modelo" },
  ];

  const onSelectRow = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const onSelectAll = () => {
    if (!tools.length) return;

    setSelected((prev) =>
      prev.length === tools.length ? [] : tools.map((item: any) => item.id),
    );
  };



  return (
    <>
      <ContentDataTable
        columns={columns}
        data={tools}
        selectedRows={selected}
        onSelectRow={onSelectRow}
        onSelectAll={onSelectAll}
      />
    
    </>
  );
};

export default Tools;
