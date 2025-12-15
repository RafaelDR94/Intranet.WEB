import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/app/components/Button/Button";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import Label from "@/app/components/Label/Label";
import { LabelType } from "@/app/components/Label/types";
import type { BillingDocumentRequisition } from "@/app/mappings/requisitions/requisitions.types";
import { Select } from "@/app/components/Select/Select";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { BillingRequisition as BillingRequisitionUrl } from "@/app/configurations/Axios/urls";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";
import ChatIcon from "@/assets/icons/Comunicacion/chat-lines.svg";
import { useRequisitionDocuments } from "../hooks/useRequisitionDocuments";

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
  requisitionId?: string;
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

const mapInvoices = (
  documents: BillingDocumentRequisition[],
  requisitionId?: string,
): InvoiceRow[] =>
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
      requisitionId,
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
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert, hideAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { documents, requisitions, requisitionId } = useRequisitionDocuments();
  const [linkingId, setLinkingId] = useState<string | null>(null);
  const [selectedRequisitions, setSelectedRequisitions] = useState<
    Record<string, string>
  >({});

  const requisitionOptions = useMemo(
    () =>
      requisitions.map((item) => ({
        label: `${item.requisitionkey} - ${item.projectname}`.trim(),
        value: item.billingrequisition_id,
      })),
    [requisitions],
  );

  useEffect(() => {
    setSelectedRequisitions((prev) => {
      const next = { ...prev };
      documents.forEach((doc) => {
        if (!next[doc.billingdocument_id] && requisitionId) {
          next[doc.billingdocument_id] = requisitionId;
        }
      });
      return next;
    });
  }, [documents, requisitionId]);

  const handleLinkRequisition = useCallback(
    async (invoiceId: string, billingrequisition_id: string) => {
      setLinkingId(invoiceId);
      setSelectedRequisitions((prev) => ({
        ...prev,
        [invoiceId]: billingrequisition_id,
      }));

      showSpinner({ message: "Vinculando requisición…" });
      try {
        const put = pPut(requireGateway("put"), [200, 204]);
        await put(BillingRequisitionUrl, {
          billingdocument_id: invoiceId,
          billingrequisition_id,
        });

        showAlert({
          type: "success",
          variant: "filled",
          title: "Requisición vinculada",
          description: "La factura se vinculó correctamente.",
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 2000,
          onClose: hideAlert,
        });
      } catch (error) {
        const normalized = normalizeApiError(error);
        showAlert({
          type: "error",
          variant: "filled",
          title: "No se pudo vincular",
          description: normalized.message,
          showPrimaryButton: true,
          primaryLabel: "Entendido",
          onPrimaryClick: hideAlert,
        });
      } finally {
        hideSpinner();
        setLinkingId(null);
      }
    },
    [hideAlert, hideSpinner, showAlert, showSpinner],
  );

  const rows = useMemo(
    () => mapInvoices(documents, requisitionId),
    [documents, requisitionId],
  );

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
        cellClass: "w-45",
        headerClass: "w-45",
      },
      {
        key: "status",
        label: "Estatus",
        render: (row) => (
          <Label type={statusToType(row.status)} text={row.status || ""} />
        ),
        cellClass: "w-40",
        headerClass: "w-40",
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
        cellClass: "w-50",
        headerClass: "w-50",
      },
      {
        key: "acciones" as unknown as keyof InvoiceRow,
        label: "VINCULAR",
        render: (row) => (
          <Select
            options={requisitionOptions}
            selected={
              selectedRequisitions[row.id]
                ? [selectedRequisitions[row.id]]
                : []
            }
            placeholder="Selecciona una requisición"
            onChange={(values) => {
              const selectedValue = values[0];
              if (selectedValue) {
                handleLinkRequisition(row.id, selectedValue);
              }
            }}
            size="md"
            disabled={linkingId === row.id || requisitionOptions.length === 0}
          />
        ),
        cellClass: "w-40",
        headerClass: "w-40",
      },
    ],
    [handleLinkRequisition, linkingId, requisitionOptions, selectedRequisitions],
  );

  return {
    columns,
    rows,
  };
};

export default useInvoicesFiles;
