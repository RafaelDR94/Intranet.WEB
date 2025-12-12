import { useMemo } from "react";

import { Button } from "@/app/components/Button/Button";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import Label from "@/app/components/Label/Label";
import { LabelType } from "@/app/components/Label/types";
import type { BillingDocumentRequisition } from "@/app/mappings/requisitions/requisitions.types";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";
import ChatIcon from "@/assets/icons/Comunicacion/chat-lines.svg";
import { useRequisitionDocuments } from "../hooks/useRequisitionDocuments";
import { Input } from "@/app/components/Input/Input";

type InvoiceRow = {
  id: string;
  uuid: string;
  date: string;
  category: string;
  status: string;
  comments: string;
  xmlUrl?: string | null;
  pdfUrl?: string | null;
  attachments?: string;
};

/**
 * Formatea una fecha ISO a DD/MM/YYYY
 */
const formatDate = (value?: string): string => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const mapInvoices = (documents: BillingDocumentRequisition[]): InvoiceRow[] =>
  documents
    .filter((doc) => doc.xml || doc.pdf)
    .map((doc) => ({
      id: doc.billingdocument_id,
      uuid: doc.uuid ?? doc.billingdocument_id,
      date: formatDate(doc.certification_date ?? doc.date_created),
      category: doc.category ?? "",
      status: doc.status ?? "",
      comments: doc.comments ?? "",
      xmlUrl: doc.xml,
      pdfUrl: doc.pdf,
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

const useInvoicesFiles = () => {
  const { documents } = useRequisitionDocuments();

  const rows = useMemo(() => mapInvoices(documents), [documents]);

  const columns: ColumnDefinition<InvoiceRow>[] = useMemo(
    () => [
      // { key: "uuid", label: "Id" },
      {
        key: "attachments",
        label: "Archivos",
        render: (row) => (
          <div className="flex items-center gap-1">
            {row.xmlUrl && (
              <Button
                size="xsmall"
                variant="ghost"
                icon={XMLIcon}
                onClick={() => window.open(row.xmlUrl ?? undefined, "_blank")}
                aria-label="Abrir XML"
              />
            )}
            {row.pdfUrl && (
              <Button
                size="xsmall"
                variant="ghost"
                icon={PDFIcon}
                onClick={() => window.open(row.pdfUrl ?? undefined, "_blank")}
                aria-label="Abrir PDF"
              />
            )}
          </div>
        ),
        cellClass: "w-30",
        headerClass: "w-30",
      },
      {
        key: "date",
        label: "Fecha",
        cellClass: "w-30",
        headerClass: "w-30",
      },
      {
        key: "category",
        label: "Categoría",
        cellClass: "w-30",
        headerClass: "w-30",
      },
      {
        key: "status",
        label: "Estatus",
        render: (row) => (
          <Label type={statusToType(row.status)} text={row.status || ""} />
        ),
        cellClass: "w-30",
        headerClass: "w-30",
      },
      {
        key: "comments",
        label: "Comentario",
        render: (row) => (
          <Button
            size="small"
            // onClick={() => handleOpenDetails(row)}
            variant="ghost"
            hideIcon
          >
            <ChatIcon className="h-6 w-6" />
          </Button>
        ),
        cellClass: "w-38",
        headerClass: "w-40 ",
      },
      {
        key: "acciones" as unknown as keyof InvoiceRow,
        label: "DETALLE",
        render: (row) => (
          <Button
            size="small"
            // onClick={() => handleOpenDetails(row)}
            variant="ghost"
            hideIcon
          >
            Ver Detalles
          </Button>
        ),
        cellClass: "w-30",
        headerClass: "w-30",
      },
      {
        key: "acciones" as unknown as keyof InvoiceRow,
        label: "VINCULAR",
        render: (row) => (
          <Input></Input>
        ),
        cellClass: "w-30",
        headerClass: "w-30",
      },
    ],
    [],
  );

  return {
    columns,
    rows,
  };
};

export default useInvoicesFiles;
