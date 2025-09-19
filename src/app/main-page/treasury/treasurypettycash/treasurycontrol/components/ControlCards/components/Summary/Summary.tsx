import React from "react";

import { Button } from "@/app/components/Button/Button";
// Ajusta esta ruta a donde tengas tu componente Donut
import Donut from "@/app/components/Donut/Donut";

type SummaryProps = {
  title?: string;
  date?: Date | string | null;
  assigned?: number;
  available?: number;
  percent?: number;
  className?: string;
};

/**
 * Tarjeta estilo "Control de Fondo Fijo de Caja Chica".
 */
export default function Summary({
  title = "Control de Fondo Fijo de Caja Chica",
  date = null,
  assigned = 0,
  available = 0,
  percent = 0,
  className = "",
}: SummaryProps) {
  const percentValue =
    typeof percent === "number" && !Number.isNaN(percent) ? percent : 0;
  const percentClamped = Math.max(0, Math.min(100, percentValue));

  const formatCurrency = (n?: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(typeof n === "number" && !Number.isNaN(n) ? n : 0);

  const capitalize = (s?: string) =>
    (s?.charAt(0)?.toUpperCase() || "") + (s?.slice(1) || "");

  const formatDateEs = (d: SummaryProps["date"]) => {
    if (!d) return "—";
    const dateObj = typeof d === "string" ? new Date(d) : d;
    if (!(dateObj instanceof Date) || Number.isNaN(dateObj.getTime())) {
      return "—";
    }
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("es-MX", { month: "long" });
    return `${day} de ${capitalize(month)}`;
  };

  const show = false; // controla si aparece el header extra

  return (
    <div className={`${show} ? h-[230px] : h-[184px]`}>
      {/* Header opcional con animación */}
      <div
        className={[
          "overflow-hidden transition-[max-height,margin] duration-300 ease-in-out",
          show ? "max-h-12 mb-3" : "max-h-0 mb-0",
        ].join(" ")}
      >
        <div className="flex items-center justify-between">
          <p className="text-blue-60 text-b4">Control de Fondo</p>
          <div className="w-[26px] h-[1px] bg-blue-60" />
          <Button hideIcon variant="outline">Editar</Button>
          <Button hideIcon variant="outline">Guardar Ajustes</Button>
        </div>
      </div>

      {/* Card principal */}
      <div className={`rounded-lg bg-white p-2 h-full flex flex-col ${className}`}>
        {/* Título */}
        <h2 className="text-s1 font-semibold text-green-100">{title}</h2>

        <div className="flex items-start justify-between gap-6 mt-1 flex-1">
          {/* Texto */}
          <div>
            <p className="text-d3 text-gray-90 mt-3">
              <span className="text-d3 font-medium">Fecha:</span>{" "}
              {formatDateEs(date)}
            </p>

            <div className="mt-5 space-y-2">
              <div>
                <p className="text-d3 text-gray-90">Fondo fijo asignado:</p>
                <p className="text-s1 font-semibold text-green-100">
                  {formatCurrency(assigned)}
                </p>
              </div>

              <div className="text-alert-green-100 flex items-baseline gap-1">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 5l9 14H3z" />
                </svg>
                <span className="text-s1 text-alert-green-100 font-semibold">
                  {formatCurrency(available)}
                </span>
              </div>
              <p className="text-d3 text-gray-90 -mt-1 font-medium">
                Disponibles
              </p>
            </div>
          </div>

          {/* Donut */}
          <div className="relative shrink-0" aria-label="Porcentaje disponible">
            <Donut
              percentage={percentClamped}
              size={140}
              thickness={30}
              innerRadius={40}
              showLabel
              sizeLabel="text-s1"
              colorLabel="text-green-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
