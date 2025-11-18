import ContentDataTable from "@/app/components/ContentDataTable/ContentDataTable";
import { Button } from "@/app/components/Button/Button";
import { useState } from "react";
import useAutomobiles from "./hooks/useAutomobiles";

type Column = { key: string; label: string };

const columns: Column[] = [
  { key: "plates", label: "Placas" },
  { key: "brand", label: "Marca" },
  { key: "model", label: "Modelo" },
  { key: "unitType", label: "Tipo de unidad" },
];

const Automobiles = () => {
  const { vehicles, loadingVehicles, handleEditVehicles } = useAutomobiles();
  const [selected, setSelected] = useState<string[]>([]);

  const onSelectRow = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    );
  };

  const onSelectAll = () => {
    if (!vehicles.length) return;
    setSelected((prev) =>
      prev.length === vehicles.length ? [] : vehicles.map((item) => item.id),
    );
  };

  return (
    <div className="space-y-4">
      <ContentDataTable
        columns={columns}
        data={vehicles}
        selectedRows={selected}
        onSelectRow={onSelectRow}
        onSelectAll={onSelectAll}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-c2 text-gray-70">
          {loadingVehicles ? "Cargando vehículos…" : `${vehicles.length} vehículos`}
        </p>
        <Button
          size="medium"
          variant="outline"
          hideIcon
          onClick={handleEditVehicles}
          disabled={!vehicles.length && !loadingVehicles}
        >
          Editar vehículos
        </Button>
      </div>
    </div>
  );
};

export default Automobiles;
