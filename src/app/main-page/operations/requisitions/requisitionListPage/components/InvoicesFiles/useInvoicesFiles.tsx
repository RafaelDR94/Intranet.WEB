import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/app/components/Button/Button";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import Label from "@/app/components/Label/Label";
import { LabelType } from "@/app/components/Label/types";
import type { BillingDocumentRequisition, Requisition } from "@/app/mappings/requisitions/requisitions.types";
import { Select } from "@/app/components/Select/Select";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { BillingRequisition as BillingRequisitionUrl } from "@/app/configurations/Axios/urls";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { useBillingDocumentsStore } from "@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore";
import { useBillingRequisitionWithEmployeesStore } from "@/app/stores/useBillingRequisitionWithEmployeesStore/useBillingRequisitionWithEmployeesStore";
import { shallow } from "zustand/shallow";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";
import ChatIcon from "@/assets/icons/Comunicacion/chat-lines.svg";
import { useRequisitionDocuments } from "../hooks/useRequisitionDocuments";

type InvoiceRow = {
  id: string;
  uuid: string;
  date: string;
  certificationDate?: string;
  category: string;
  description: string;
  status: string;
  comments: string;
  xmlUrl?: string | null;
  pdfUrl?: string | null;
  attachments?: string;
  requisitionId?: string;
  requisitionKey?: string;
  employeeName?: string;
  rfcEmisor?: string | null;
  rfcReceptor?: string | null;
  claveSat?: string | null;
  subtotal?: number;
  iva?: number;
  total?: number;
};

type InvoiceOverride = {
  status?: string;
  comments?: string;
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
  requisitions: Requisition[],
  requisitionId?: string,
  overrides?: Record<string, InvoiceOverride>,
): InvoiceRow[] =>
  documents
    .filter((doc) => doc.xml || doc.pdf)
    .map((doc) => {
      const requisition = requisitions.find(
        (item) => item.billingrequisition_id === requisitionId,
      );
      const certificationDate = doc.certification_date ?? doc.date_created;
      const baseRow = {
        id: doc.billingdocument_id,
        uuid: doc.uuid ?? doc.billingdocument_id,
        date: formatDate(certificationDate),
        certificationDate,
        category: doc.category ?? "",
        description: doc.description ?? "",
        status: doc.status ?? "",
        comments: doc.comments ?? "",
        xmlUrl: doc.xml,
        pdfUrl: doc.pdf,
        requisitionId,
        requisitionKey: requisition?.requisitionkey ?? "",
        employeeName: doc.employeename ?? requisition?.employeename ?? "",
        rfcEmisor: doc.rfc_emisor,
        rfcReceptor: doc.rfc_receptor,
        claveSat: doc.conceptos,
        subtotal: doc.subtotal,
        iva: doc.iva,
        total: doc.total,
      };
      const override = overrides?.[doc.billingdocument_id];
      if (!override) return baseRow;
      return {
        ...baseRow,
        status: override.status ?? baseRow.status,
        comments: override.comments ?? baseRow.comments,
      };
    });

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
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRow, setDetailRow] = useState<InvoiceRow | null>(null);
  const [openValidInvoice, setOpenValidInvoice] = useState(false);
  const [openRejectInvoice, setOpenRejectInvoice] = useState(false);
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, InvoiceOverride>
  >({});
  const [lastAction, setLastAction] = useState<{
    id: string;
    status: string;
    comments?: string;
  } | null>(null);
  const [linkingId, setLinkingId] = useState<string | null>(null);
  const [selectedRequisitions, setSelectedRequisitions] = useState<
    Record<string, string>
  >({});
  const {
    validateBillingDocumentOperations,
    rejectBillingDocument,
    validating,
    rejecting,
    succesValidate,
    succesReject,
    resetFlags,
    error,
  } = useBillingDocumentsStore(
    (s) => ({
      validateBillingDocumentOperations: s.validateBillingDocumentOperations,
      rejectBillingDocument: s.rejectBillingDocument,
      validating: s.validating,
      rejecting: s.rejecting,
      succesValidate: s.succesValidate,
      succesReject: s.succesReject,
      resetFlags: s.resetFlags,
      error: s.error,
    }),
    shallow,
  );
  const { fetchRequisitionsWithEmployees } =
    useBillingRequisitionWithEmployeesStore(
      (s) => ({
        fetchRequisitionsWithEmployees: s.fetchRequisitionsWithEmployees,
      }),
      shallow,
    );

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

      const requisition = requisitions.find(
        (item) => item.billingrequisition_id === billingrequisition_id,
      );

      if (!requisition) {
        showAlert({
          type: "error",
          variant: "filled",
          title: "No se encontró la requisición",
          description: "Selecciona una opción válida para continuar.",
          showPrimaryButton: true,
          primaryLabel: "Entendido",
          onPrimaryClick: hideAlert,
        });
        setLinkingId(null);
        return;
      }

      const toNumber = (value: string | number | undefined): number => {
        const parsed = Number(value ?? 0);
        return Number.isFinite(parsed) ? parsed : 0;
      };

      const payload = {
        billingdocument_id: invoiceId,
        billingrequisition_id,
        requisitionkey: requisition.requisitionkey ?? "",
        employeename: requisition.employeename ?? "",
        projectname: requisition.projectname ?? "",
        motive: requisition.motive ?? "",
        state: requisition.state ?? "",
        amountdeposited: toNumber(requisition.amountdeposited),
        provenamount: toNumber(requisition.provenamount),
        amountdifference: toNumber(requisition.amountdifference),
        gts_type: requisition.gts_type ?? "",
      };

      showSpinner({ message: "Vinculando requisición…" });
      try {
        const put = pPut(requireGateway("put"), [200, 204]);
        await put(BillingRequisitionUrl, payload);

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
    [hideAlert, hideSpinner, requisitions, showAlert, showSpinner],
  );

  const rows = useMemo(
    () => mapInvoices(documents, requisitions, requisitionId, statusOverrides),
    [documents, requisitions, requisitionId, statusOverrides],
  );

  useEffect(() => {
    if (!detailRow) return;
    const updatedRow = rows.find((row) => row.id === detailRow.id);
    if (updatedRow) {
      setDetailRow(updatedRow);
    }
  }, [rows, detailRow]);

  const openDetails = useCallback((row: InvoiceRow) => {
    setDetailRow(row);
    setDetailOpen(true);
  }, []);

  const closeDetails = useCallback(() => {
    setDetailOpen(false);
  }, []);

  const handleSubmitValid = useCallback(() => {
    if (!detailRow) return;
    setOpenValidInvoice(false);
    setLastAction({ id: detailRow.id, status: "Validado" });
    validateBillingDocumentOperations([detailRow.id], requisitionId ?? undefined);
  }, [detailRow, requisitionId, validateBillingDocumentOperations]);

  const handleSubmitReject = useCallback(
    (values: Record<string, any>) => {
      if (!detailRow) return;
      setOpenRejectInvoice(false);
      setLastAction({
        id: detailRow.id,
        status: "Rechazado",
        comments: values.comments ?? "",
      });
      const payload = {
        id: detailRow.id,
        comment: values.comments ?? "",
        type: true,
      };
      rejectBillingDocument(payload, requisitionId ?? undefined);
    },
    [detailRow, rejectBillingDocument, requisitionId],
  );

  useEffect(() => {
    if (validating) {
      showSpinner({ message: "Espera un momento, se esta validando la factura." });
      return;
    }
    if (rejecting) {
      showSpinner({ message: "Espera un momento, se esta rechazando la factura." });
      return;
    }

    hideSpinner();

    if (succesValidate) {
      if (lastAction?.status === "Validado") {
        setStatusOverrides((prev) => ({
          ...prev,
          [lastAction.id]: {
            ...prev[lastAction.id],
            status: lastAction.status,
          },
        }));
        fetchRequisitionsWithEmployees(undefined, undefined, true);
        setLastAction(null);
      }
      showAlert({
        type: "info",
        title: "Factura validada",
        description: "Se ha validado correctamente.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
    }

    if (succesReject) {
      if (lastAction?.status === "Rechazado") {
        setStatusOverrides((prev) => ({
          ...prev,
          [lastAction.id]: {
            ...prev[lastAction.id],
            status: lastAction.status,
            comments: lastAction.comments,
          },
        }));
        fetchRequisitionsWithEmployees(undefined, undefined, true);
        setLastAction(null);
      }
      showAlert({
        type: "info",
        title: "Factura rechazada",
        description: "Se ha rechazado correctamente.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
    }

    if (error) {
      showAlert({
        type: "error",
        title: "Ocurrio un error",
        description: String(error) || "Hubo un problema desconocido",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
    }

    resetFlags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    validating,
    rejecting,
    succesValidate,
    succesReject,
    error,
    fetchRequisitionsWithEmployees,
    lastAction,
  ]);

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
        render: (_row) => (
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
            onClick={() => openDetails(row)}
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
        cellClass: "w-60",
        headerClass: "w-60",
      },
    ],
    [handleLinkRequisition, linkingId, openDetails, requisitionOptions, selectedRequisitions],
  );

  return {
    columns,
    rows,
    detailOpen,
    detailRow,
    closeDetails,
    openValidInvoice,
    openRejectInvoice,
    setOpenValidInvoice,
    setOpenRejectInvoice,
    handleSubmitValid,
    handleSubmitReject,
    isStatusLocked: Boolean(
      validating ||
        rejecting ||
      detailRow?.status?.toLowerCase().includes("valid") ||
        detailRow?.status?.toLowerCase().includes("rechaz"),
    ),
  };
};

export default useInvoicesFiles;
