import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/app/components/Button/Button";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import Label from "@/app/components/Label/Label";
import { LabelType } from "@/app/components/Label/types";
import type { BillingDocuments } from "@/app/mappings/billingdocuments/billingdocuments.types";
import type { Requisition } from "@/app/mappings/requisitions/requisitions.types";
import { Select } from "@/app/components/Select/Select";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { BillingDocumentsPutMap } from "@/app/mappings/billingdocuments/billingdocuments.mapper";
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
  documents: BillingDocuments[],
  requisitions: Requisition[],
  requisitionId?: string,
  overrides?: Record<string, InvoiceOverride>,
): InvoiceRow[] =>
  documents

    .map((doc) => {
      const requisitionFromDoc =
        doc.requisition?.billingrequisition_id ??
        (doc as any)?.billingrequisition_id ??
        (doc as any)?.requisition_id ??
        (doc as any)?.requisitionId;
      const requisition =
        requisitions.find(
          (item) => item.billingrequisition_id === requisitionFromDoc,
        ) ??
        (requisitionId
          ? requisitions.find(
              (item) => item.billingrequisition_id === requisitionId,
            )
          : undefined);
      const certificationDate = doc.fecha || doc.date_created;
      const claveSat = Array.isArray(doc.conceptos)
        ? doc.conceptos
            .map((item) => item.clave_sat || item.clavesat_description || "")
            .filter((item) => Boolean(item))
            .join(", ")
        : "";
      const baseRow = {
        id: doc.billingdocument_id,
        uuid: doc.uuid ?? doc.billingdocument_id,
        date: formatDate(certificationDate),
        certificationDate,
        category: doc.category?.name ?? "",
        description: doc.description?.name ?? "",
        status: doc.status ?? "",
        comments: doc.comments ?? "",
        xmlUrl: doc.xml || null,
        pdfUrl: doc.pdf || null,
        requisitionId: requisitionFromDoc ?? requisitionId,
        requisitionKey:
          doc.requisition?.requisitionkey ??
          (doc as any)?.requisitionkey ??
          requisition?.requisitionkey ??
          "",
        employeeName:
          doc.requisition?.employeename ??
          (doc as any)?.employeename ??
          requisition?.employeename ??
          "",
        rfcEmisor: doc.rfc_emisor ?? null,
        rfcReceptor: doc.rfc_receptor ?? null,
        claveSat: claveSat || null,
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
  const { requisitions, requisitionId, employeeId } = useRequisitionDocuments();
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
    updateBillingDocument,
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
      updateBillingDocument: s.updateBillingDocument,
    }),
    shallow,
  );
  const {
    pendingBillingDocuments,
    fetchBillingDocumentsPendingByEmployee,
    fetchRequisitionsWithEmployees,
  } = useBillingRequisitionWithEmployeesStore(
    (s) => ({
      pendingBillingDocuments: s.pendingBillingDocuments,
      fetchBillingDocumentsPendingByEmployee:
        s.fetchBillingDocumentsPendingByEmployee,
      fetchRequisitionsWithEmployees: s.fetchRequisitionsWithEmployees,
    }),
    shallow,
  );

  const requisitionOptions = useMemo(() => {
    const map = new Map<string, { label: string; value: string }>();

    requisitions.forEach((item) => {
      const value = item.billingrequisition_id;
      if (!value) return;
      const label = `${item.requisitionkey} - ${item.projectname}`.trim();
      if (!map.has(value)) map.set(value, { label, value });
    });

    pendingBillingDocuments.forEach((doc) => {
      const value =
        doc.requisition?.billingrequisition_id ??
        (doc as any)?.billingrequisition_id ??
        (doc as any)?.requisition_id ??
        (doc as any)?.requisitionId ??
        "";
      if (!value || map.has(value)) return;
      const requisitionKey =
        doc.requisition?.requisitionkey ??
        (doc as any)?.requisitionkey ??
        "";
      const projectName =
        doc.requisition?.projectname ??
        (doc as any)?.projectname ??
        "";
      const label = `${requisitionKey || value} - ${projectName}`.trim();
      map.set(value, { label, value });
    });

    return Array.from(map.values());
  }, [requisitions, pendingBillingDocuments]);

  useEffect(() => {
    if (requisitionOptions.length === 0) return;
    setSelectedRequisitions((prev) => {
      let changed = false;
      const next = { ...prev };
      pendingBillingDocuments.forEach((doc) => {
        const defaultRequisitionId =
          doc.requisition?.billingrequisition_id ?? requisitionId;
        if (!next[doc.billingdocument_id] && defaultRequisitionId) {
          next[doc.billingdocument_id] = defaultRequisitionId;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [pendingBillingDocuments, requisitionId, requisitionOptions.length]);

  useEffect(() => {
    if (!employeeId) return;
    fetchBillingDocumentsPendingByEmployee(employeeId, true);
  }, [employeeId, fetchBillingDocumentsPendingByEmployee]);

  const handleLinkRequisition = useCallback(
    async (invoiceId: string, billingrequisition_id: string) => {
      setLinkingId(invoiceId);
      setSelectedRequisitions((prev) => ({
        ...prev,
        [invoiceId]: billingrequisition_id,
      }));


      showSpinner({ message: "Vinculando requisicion..." });
      try {
        const document = pendingBillingDocuments.find(
          (doc) => doc.billingdocument_id === invoiceId,
        );

        if (!document) {
          showAlert({
            type: "error",
            variant: "filled",
            title: "No se encontro el documento",
            description:
              "No fue posible vincular la requisicion a la factura.",
            showPrimaryButton: true,
            primaryLabel: "Entendido",
            onPrimaryClick: hideAlert,
          });
          return;
        }

        const payload = BillingDocumentsPutMap({
          billingdocument_id: document.billingdocument_id ?? invoiceId,
          requisition_id: billingrequisition_id,
          billingimages_id: document.billingimages_id || null,
          xml: document.xml ?? "",
          pdf: document.pdf ?? "",
          comments: document.comments ?? "",
          description_id:
            document.description?.id_billingdescription ??
            (document as any)?.description_id ??
            "",
          category_id:
            document.category?.id_billingcategory ??
            (document as any)?.category_id ??
            "",
          numpersons: document.numpersons ?? 0,
          numnights: document.numnights ?? 0,
          user_comments: document.user_comments ?? "",
        });

        const updated = await updateBillingDocument(
          payload,
          billingrequisition_id,
        );

        if (!updated) {
          showAlert({
            type: "error",
            variant: "filled",
            title: "No se pudo vincular",
            description:
              "Ocurrio un problema al guardar la requisicion en la factura.",
            showPrimaryButton: true,
            primaryLabel: "Entendido",
            onPrimaryClick: hideAlert,
          });
          return;
        }

        if (employeeId) {
          fetchBillingDocumentsPendingByEmployee(employeeId, true);
        }

        showAlert({
          type: "success",
          variant: "filled",
          title: "Requisicion vinculada",
          description: "La factura se vinculo correctamente.",
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 2000,
          onClose: hideAlert,
        });
      } catch (error) {
        showAlert({
          type: "error",
          variant: "filled",
          title: "No se pudo vincular",
          description:
            String(error) || "Ocurrio un problema al guardar la vinculacion.",
          showPrimaryButton: true,
          primaryLabel: "Entendido",
          onPrimaryClick: hideAlert,
        });
      } finally {
        hideSpinner();
        setLinkingId(null);
      }
    },
    [
      employeeId,
      fetchBillingDocumentsPendingByEmployee,
      hideAlert,
      hideSpinner,
      pendingBillingDocuments,
      requisitions,
      showAlert,
      showSpinner,
      updateBillingDocument,
    ],
  );


  const rows = useMemo(
    () =>{
      const invoices=mapInvoices(
        pendingBillingDocuments,
        requisitions,
        requisitionId,
        statusOverrides,
      );
      console.log("pendingBillingDocuments", pendingBillingDocuments);
      console.log("mapped invoices", invoices);
      return invoices;
    },
    [pendingBillingDocuments, requisitions, requisitionId, statusOverrides],
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
        cellClass: "w-2/14",
        headerClass: "w-2/14",
      },
      {
        key: "date",
        label: "Fecha",
        cellClass: "w-2/14",
        headerClass: "w-2/14",
      },
      {
        key: "category",
        label: "Categoría",
        cellClass: "w-3/14",
        headerClass: "w-3/14",
      },
      {
        key: "status",
        label: "Estatus",
        render: (row) => (
          <Label type={statusToType(row.status)} text={row.status || ""} />
        ),
        cellClass: "w-1/14",
        headerClass: "w-1/14",
      },
      {
        key: "comments",
        label: "Comentario",
        render: (_row) => (<>
           {_row.comments &&(   <Button
            size="small"
            // onClick={() => handleOpenDetails(row)}
            variant="ghost"
            hideIcon
          >
            <ChatIcon className="h-6 w-6" />
          </Button>)}
        </>
    
        ),
        cellClass: "w-2/14",
        headerClass: "w-2/14",
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
        cellClass: "w-2/14",
        headerClass: "w-2/14",
      },
      {
        key: "acciones" as unknown as keyof InvoiceRow,
        label: "VINCULAR",
        render: (row) => (
          <Select
            options={requisitionOptions}
            selected={[
              selectedRequisitions[row.id] ?? row.requisitionId ?? "",
            ].filter(Boolean)}
            placeholder="Selecciona una requisición"
            onChange={(values) => {
              const selectedValue = values[0];
              if (selectedValue) {
                handleLinkRequisition(row.id, selectedValue);
              }
            }}
            size="md"
          />
        ),
        cellClass: "w-2/14",
        headerClass: "w-2/14",
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
