import { useMemo } from "react";

import { Button } from "@/app/components/Button/Button";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import Label from "@/app/components/Label/Label";
import { LabelType } from "@/app/components/Label/types";
import type { BillingDocumentRequisition } from "@/app/mappings/requisitions/requisitions.types";
import ImageIcon from "@/assets/icons/Fotos y Videos/media-image.svg";
import DownloadIcon from "@/assets/icons/acciones/download.svg";

import { useRequisitionDocuments } from "../hooks/useRequisitionDocuments";

type TicketRow = {
  id: string;
  date: string;
  category: string;
  status: string;
  comments: string;
  imageUrl?: string | null;
  attachments?: string;
};

const mapTickets = (
  documents: BillingDocumentRequisition[],
): TicketRow[] =>
  documents
    .filter((doc) => doc.image)
    .map((doc) => ({
      id: doc.billingdocument_id,
      date: doc.certification_date ?? doc.date_created,
      category: doc.category ?? "",
      status: doc.status ?? "",
      comments: doc.comments ?? "",
      imageUrl: doc.image,
    }));

const statusToType = (status?: string): LabelType => {
  const normalized = (status ?? "").toLowerCase();
  if (normalized.includes("valid")) return "valido";
  if (normalized.includes("rechaz")) return "rechazado";
  if (normalized.includes("cierre")) return "actualizado";
  if (normalized.includes("cerrado")) return "restringido";
  if (normalized.includes("folio")) return "prohibido";
  if (normalized.includes("viatic")) return "purple";
  return "pendiente";
};

const useTicketsFiles = () => {
  const { documents } = useRequisitionDocuments();

  const rows = useMemo(() => mapTickets(documents), [documents]);

  const columns: ColumnDefinition<TicketRow>[] = useMemo(
    () => [
      // { key: "id", label: "Id", cellClass: "w-1/15 text-left", headerClass: "w-1/15 text-left" },
      {
        key: "attachments",
        label: "Archivos",
        cellClass: "w-2/15 text-left",
        headerClass: "w-2/15 text-left",
        render: (row) => (
          <div className="flex items-center gap-1">
            {row.imageUrl && (
              <Button
                size="xsmall"
                variant="ghost"
                icon={DownloadIcon}
                onClick={() => window.open(row.imageUrl ?? undefined, "_blank")}
                aria-label="Descargar"
              />
            )}
            {row.imageUrl && (
              <Button
                size="xsmall"
                variant="ghost"
                icon={ImageIcon}
                onClick={() => window.open(row.imageUrl ?? undefined, "_blank")}
                aria-label="Abrir ticket"
              />
            )}
          </div>
        ),
      },
      { key: "date", label: "Fecha", cellClass: "w-2/15 text-left", headerClass: "w-2/15 text-left" },
      { key: "category", label: "Categoría", cellClass: "w-4/15 text-left", headerClass: "w-4/15 text-left" },
      {
        key: "status",
        label: "Estatus",
        cellClass: "w-3/15 text-right",
        headerClass: "w-3/15 text-right",
        render: (row) => (
          <Label type={statusToType(row.status)} text={row.status || ""} />
        ),
      },
      { key: "comments", label: "Comentario", cellClass: "w-2/15 text-right", headerClass: "w-2/15 text-right" },
      { key: "category", label: "Detalle", cellClass: "w-2/15 text-right", headerClass: "w-2/15 text-right" },
    ],
    [],
  );

  return {
    columns,
    rows,
  };
};

export default useTicketsFiles;
