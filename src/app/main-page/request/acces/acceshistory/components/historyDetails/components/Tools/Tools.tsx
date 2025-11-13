import useTools from "./hooks/useTools";
import ContentDataTable from "@/app/components/ContentDataTable/ContentDataTable";
import { useState } from "react";
import { Button } from "@/app/components/Button/Button";

type Column = { key: string; label: string };

const Tools = () => {
  const { current } = useTools();

  const [selected, setSelected] = useState<string[]>([]);

  const columns: Column[] = [
    { key: "marca", label: "Marca" },
    { key: "descripcion", label: "Descripción" },
    { key: "modelo", label: "Modelo" },
  ];

  const onSelectRow = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const onSelectAll = () => {
    if (!current?.tools) return;

    setSelected((prev) =>
      prev.length === current.tools.length
        ? []
        : current.tools.map((item: any) => item.id),
    );
  };

  return (
    <>
      <ContentDataTable
        columns={columns}
        data={current?.tools ?? []}
        selectedRows={selected}
        onSelectRow={onSelectRow}
        onSelectAll={onSelectAll}
      />
      <div className="flex justify-end">
        <Button
          size="medium"
          variant="outline"
          hideIcon
          style={{ marginBlock: "10px" }}
          onClick={() => {}}
        >
          Agregar Herramienta
        </Button>
      </div>
    </>
  );
};

export default Tools;
