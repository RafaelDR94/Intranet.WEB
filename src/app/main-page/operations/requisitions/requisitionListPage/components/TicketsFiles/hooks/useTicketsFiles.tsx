import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { shallow } from "zustand/shallow";

import { Button } from "@/app/components/Button/Button";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import type { FieldModel } from "@/app/components/DynamicForm/types";
import Label from "@/app/components/Label/Label";
import { LabelType } from "@/app/components/Label/types";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import type { BillingImages } from "@/app/mappings/billingimages/billingimages.types";
import { useBillingDocumentsStore } from "@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore";
import { useBillingImagesStore } from "@/app/stores/useBillingImagesStore/useBillingImagesStore";
import { useBillingRequisitionWithEmployeesStore } from "@/app/stores/useBillingRequisitionWithEmployeesStore/useBillingRequisitionWithEmployeesStore";
import { useTutorials } from "@/tutorials/engine/TutorialProvider";
import ImageIcon from "@/assets/icons/Fotos y Videos/media-image.svg";
import ChatIcon from "@/assets/icons/Comunicacion/chat-lines.svg";
import DownloadIcon from "@/assets/icons/acciones/download.svg";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";

import { useRequisitionDocuments } from "../../hooks/useRequisitionDocuments";
import { TicketRow } from "../types";

type TicketOverride = {
  status?: string;
  comments?: string;
};

type ValidationFormValues = {
  requisition_id: string;
  numpersons: number;
  total: number;
};

const DEFAULT_VALIDATION_VALUES: ValidationFormValues = {
  requisition_id: "",
  numpersons: 0,
  total: 0,
};

const normalizeImages = (
  images: BillingImages["images"] | { image?: string }[],
): string[] => {
  if (Array.isArray(images)) {
    return images
      .map((item) => (typeof item === "string" ? item : item?.image ?? ""))
      .filter((item) => !!item);
  }
  return [];
};

const mapTickets = (
  images: BillingImages[],
  overrides?: Record<string, TicketOverride>,
): TicketRow[] =>
  images.map((item) => {
    const id = item.billing_image_id || item.images?.[0]?.image || "";
    const baseRow = {
      id,
      date: item.dateCreate,
      category: item.category?.name ?? "",
      detail: item.description?.name ?? "",
      status: item.status ?? "",
      comments: item.comments ?? "",
      userComments: item.user_comments ?? "",
      imageUrls: normalizeImages(item.images),
      source: item,
    };
    const override = overrides?.[id];
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

const isPendingStatus = (status?: string): boolean =>
  (status ?? "").trim().toLowerCase().includes("pend")|| (status ?? "").trim().toLowerCase().includes("actualizado");

const useTicketsFiles = () => {
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { activeTutorialId } = useTutorials();
  const isMobile = useIsMobile();
  const isTutorialActive =
    activeTutorialId === "operations-requisitions:files" ||
    activeTutorialId === "operations-requisitions:billablefiles";
  const searchParams = useSearchParams();
  const isBillableFilesView = searchParams.get("view") === "billablefiles";
  const { employeeId, requisitions } = useRequisitionDocuments();
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRow, setDetailRow] = useState<TicketRow | null>(null);
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, TicketOverride>
  >({});
  const [openRejectTicket, setOpenRejectTicket] = useState<{
    state: boolean;
    row: TicketRow | null;
  }>({ state: false, row: null });
  const [openValidateTicket, setOpenValidateTicket] = useState(false);
  const [markAsNotDeductible, setMarkAsNotDeductible] = useState(false);
  const [showValidationForm, setShowValidationForm] = useState(false);
  const [validationValues, setValidationValues] = useState<ValidationFormValues>(
    DEFAULT_VALIDATION_VALUES,
  );
  const [validationFormVersion, setValidationFormVersion] = useState(0);
  const [lastValidatedTicketId, setLastValidatedTicketId] = useState<
    string | null
  >(null);
  const [filterValue, setFilterValue] = useState<string>("all");

  const {
    pendingBillingImages,
    fetchBillingImagesPendingByEmployee,
    fetchBillingDocumentsPendingByEmployee,
  } =
    useBillingRequisitionWithEmployeesStore(
      (state) => ({
        pendingBillingImages: state.pendingBillingImages,
        fetchBillingImagesPendingByEmployee:
          state.fetchBillingImagesPendingByEmployee,
        fetchBillingDocumentsPendingByEmployee:
          state.fetchBillingDocumentsPendingByEmployee,
      }),
      shallow,
    );

  const {
    rejectBillingImage,
    rejecting,
    succesReject,
    error: billingImagesError,
    resetFlags: resetBillingImagesFlags,
  } = useBillingImagesStore(
    (state) => ({
      rejectBillingImage: state.rejectBillingImage,
      rejecting: state.rejecting,
      succesReject: state.succesReject,
      error: state.error,
      resetFlags: state.resetFlags,
    }),
    shallow,
  );

  const { billingImages, fetchBillingImages } = useBillingImagesStore(
    (state) => ({
      billingImages: state.billingImages,
      fetchBillingImages: state.fetchBillingImages,
    }),
    shallow,
  );

  const {
    billingDocumentNotDeductible,
    notDeducting,
    successNotDeductible,
    error: billingDocumentsError,
    resetFlags: resetBillingDocumentsFlags,
  } = useBillingDocumentsStore(
    (state) => ({
      billingDocumentNotDeductible: state.billingDocumentNotDeductible,
      notDeducting: state.notDeducting,
      successNotDeductible: state.successNotDeductible,
      error: state.error,
      resetFlags: state.resetFlags,
    }),
    shallow,
  );

  const resetValidationForm = useCallback(() => {
    setValidationValues(DEFAULT_VALIDATION_VALUES);
    setValidationFormVersion((current) => current + 1);
  }, []);

  useEffect(() => {
    if (isTutorialActive) return;
    if (!employeeId) return;
    if (isBillableFilesView) {
      fetchBillingImages(employeeId, true);
      return;
    }
    fetchBillingImagesPendingByEmployee(employeeId, true);
  }, [
    employeeId,
    fetchBillingImages,
    fetchBillingImagesPendingByEmployee,
    isBillableFilesView,
    isTutorialActive,
  ]);

  useEffect(() => {
    if (rejecting) {
      showSpinner({ message: "Espera un momento, se esta rechazando la imagen." });
      return;
    }

    hideSpinner();

    if (succesReject) {
      showAlert({
        type: "info",
        title: "Ticket rechazado",
        description: "Se ha rechazado correctamente.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
      if (employeeId) {
        if (isBillableFilesView) {
          fetchBillingImages(employeeId, true);
        } else {
          fetchBillingImagesPendingByEmployee(employeeId, true);
        }
      }
    }

    if (billingImagesError) {
      showAlert({
        type: "error",
        title: "Ocurrio un error",
        description:
          String(billingImagesError) || "Hubo un problema desconocido",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
    }

    resetBillingImagesFlags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingImagesError, rejecting, succesReject]);

  useEffect(() => {
    if (notDeducting) {
      showSpinner({
        message:
          "Espera un momento, se esta registrando el ticket como no deducible.",
      });
      return;
    }

    hideSpinner();

    if (successNotDeductible && lastValidatedTicketId) {
      setStatusOverrides((prev) => ({
        ...prev,
        [lastValidatedTicketId]: {
          ...prev[lastValidatedTicketId],
          status: "Validado",
        },
      }));
      setDetailRow((prev) =>
        prev && prev.id === lastValidatedTicketId
          ? { ...prev, status: "Validado" }
          : prev,
      );
      setLastValidatedTicketId(null);
      setMarkAsNotDeductible(false);
      setShowValidationForm(false);
      setOpenValidateTicket(false);
      resetValidationForm();

      if (employeeId) {
        if (isBillableFilesView) {
          fetchBillingImages(employeeId, true);
        } else {
          fetchBillingImagesPendingByEmployee(employeeId, true);
        }
        fetchBillingDocumentsPendingByEmployee(employeeId, true);
      }

      showAlert({
        type: "info",
        title: "Ticket validado",
        description: "Se ha marcado correctamente como no deducible.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
    }

    if (billingDocumentsError) {
      showAlert({
        type: "error",
        title: "Ocurrio un error",
        description:
          String(billingDocumentsError) || "Hubo un problema desconocido",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
    }

    resetBillingDocumentsFlags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    billingDocumentsError,
    fetchBillingDocumentsPendingByEmployee,
    fetchBillingImages,
    fetchBillingImagesPendingByEmployee,
    employeeId,
    isBillableFilesView,
    notDeducting,
    successNotDeductible,
  ]);

  const mockRows = useMemo<TicketRow[]>(() => {
    const demoImage =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P4z8DwHwAFgwJ/lm8X3wAAAABJRU5ErkJggg==";
    return [
      {
        id: "mock-ticket-001",
        date: "2026-02-26",
        category: "Hospedaje",
        detail: "Hotel",
        status: "Pendiente",
        comments: "Evidencia pendiente",
        imageUrls: [demoImage],
        source: {
          billing_image_id: "mock-ticket-001",
          dateCreate: "2026-02-26",
          images: [{ image: demoImage }],
          status: "Pendiente",
          comments: "Evidencia pendiente",
        } as BillingImages,
      },
      {
        id: "mock-ticket-002",
        date: "2026-02-25",
        category: "Transporte",
        detail: "Taxi",
        status: "Validado",
        comments: "OK",
        imageUrls: [demoImage],
        source: {
          billing_image_id: "mock-ticket-002",
          dateCreate: "2026-02-25",
          images: [{ image: demoImage }],
          status: "Validado",
          comments: "OK",
        } as BillingImages,
      },
    ];
  }, []);

  const rows = useMemo(() => {
    const sourceImages = isBillableFilesView ? billingImages : pendingBillingImages;
    const newRows = mapTickets(sourceImages, statusOverrides);
    if (isTutorialActive) return mockRows;
    return newRows;
  }, [
    billingImages,
    isBillableFilesView,
    isTutorialActive,
    mockRows,
    pendingBillingImages,
    statusOverrides,
  ]);

  useEffect(() => {
    if (!detailRow) return;
    const updatedRow = rows.find((row) => row.id === detailRow.id);
    if (updatedRow) {
      setDetailRow(updatedRow);
    }
  }, [rows, detailRow]);

  const filterOptions = useMemo(
    () => [
      { label: "Todos", value: "all" },
      { label: "Pendiente", value: "pendiente" },
      { label: "Rechazado", value: "rechazado" },
      { label: "Validado", value: "validado" },
    ],
    [],
  );

  const requisitionOptions = useMemo(() => {
    const map = new Map<string, { label: string; value: string }>();

    requisitions.forEach((item) => {
      if (!item.billingrequisition_id) return;
      map.set(item.billingrequisition_id, {
        label: `${item.requisitionkey} - ${item.projectname}`.trim(),
        value: item.billingrequisition_id,
      });
    });

    const currentRequisition = detailRow?.source?.requisition;
    if (currentRequisition?.billingrequisition_id) {
      map.set(currentRequisition.billingrequisition_id, {
        label: `${currentRequisition.requisitionkey} - ${currentRequisition.projectname}`.trim(),
        value: currentRequisition.billingrequisition_id,
      });
    }

    return Array.from(map.values());
  }, [detailRow?.source?.requisition, requisitions]);

  const validationFields = useMemo<FieldModel[]>(
    () => [
      {
        type: "select",
        name: "requisition_id",
        label: "Codigo de Solicitud",
        placeholder: "Selecciona una requisicion",
        value: DEFAULT_VALIDATION_VALUES.requisition_id,
        options: requisitionOptions,
        validations: [{ type: "required" }],
        className: "max-w-[420px]",
      },
      {
        type: "numberControl",
        name: "numpersons",
        label: "No. de Personas",
        value: DEFAULT_VALIDATION_VALUES.numpersons,
        min: 0,
        className: "max-w-[220px]",
      },
      {
        type: "input",
        name: "total",
        label: "Total",
        value: String(DEFAULT_VALIDATION_VALUES.total),
        className: "max-w-[220px]",
      },
    ],
    [requisitionOptions],
  );

  const resolveFilterStatus = useCallback((status?: string) => {
    const normalized = (status ?? "").toLowerCase();
    if (normalized.includes("valid")) return "validado";
    if (normalized.includes("rechaz")) return "rechazado";
    return "pendiente";
  }, []);

  const filteredRows = useMemo(() => {
    if (filterValue === "all") return rows;
    return rows.filter((row) => resolveFilterStatus(row.status) === filterValue);
  }, [filterValue, resolveFilterStatus, rows]);

  const refresh = useCallback(() => {
    if (!employeeId) return;
    if (isBillableFilesView) {
      fetchBillingImages(employeeId, true);
    } else {
      fetchBillingImagesPendingByEmployee(employeeId, true);
    }
  }, [
    employeeId,
    fetchBillingImages,
    fetchBillingImagesPendingByEmployee,
    isBillableFilesView,
  ]);

  const openPreview = useCallback((images: string[], index = 0) => {
    setPreviewImages(images);
    setPreviewIndex(index);
  }, []);

  const closePreview = useCallback(() => {
    setPreviewImages([]);
    setPreviewIndex(0);
  }, []);

  const nextPreview = useCallback(() => {
    setPreviewIndex((current) => {
      if (previewImages.length === 0) return 0;
      return (current + 1) % previewImages.length;
    });
  }, [previewImages]);

  const prevPreview = useCallback(() => {
    setPreviewIndex((current) => {
      if (previewImages.length === 0) return 0;
      return (current - 1 + previewImages.length) % previewImages.length;
    });
  }, [previewImages]);

  const openDetails = useCallback(
    (row: TicketRow) => {
      setDetailRow(row);
      setDetailOpen(true);
      setMarkAsNotDeductible(false);
      setShowValidationForm(false);
      setOpenValidateTicket(false);
      resetValidationForm();
    },
    [resetValidationForm],
  );

  const closeDetails = useCallback(() => {
    setDetailOpen(false);
    setMarkAsNotDeductible(false);
    setShowValidationForm(false);
    setOpenValidateTicket(false);
    resetValidationForm();
  }, [resetValidationForm]);

  const openReject = useCallback(() => {
    if (!detailRow) return;
    setOpenRejectTicket({ state: true, row: detailRow });
  }, [detailRow]);

  const handleSubmitReject = useCallback(
    (values: Record<string, unknown>) => {
      const comments = String(values.comments ?? "");
      const row = openRejectTicket.row;
      const rowId = row?.id ?? "";
      if (rowId) {
        setStatusOverrides((prev) => ({
          ...prev,
          [rowId]: {
            ...prev[rowId],
            status: "Rechazado",
            comments,
          },
        }));
      }

      setOpenRejectTicket({ state: false, row: null });
      if (row) {
        setDetailRow({
          ...row,
          status: "Rechazado",
          comments: comments || row.comments,
        });
      }
      const payload = {
        billing_image_id: row?.source.billing_image_id ?? "",
        comments,
      };
      rejectBillingImage(payload);
    },
    [openRejectTicket.row, rejectBillingImage],
  );

  const handleToggleNotDeductible = useCallback(
    (checked: boolean) => {
      setMarkAsNotDeductible(checked);
      setShowValidationForm(checked);
      setOpenValidateTicket(false);
      resetValidationForm();
    },
    [resetValidationForm],
  );

  const handleValidateClick = useCallback(() => {
    if (!detailRow || !markAsNotDeductible || !isPendingStatus(detailRow.status)) {
      return;
    }
    if (!validationValues.requisition_id) return;
    setOpenValidateTicket(true);
  }, [
    detailRow,
    markAsNotDeductible,
    validationValues.requisition_id,
  ]);

  const handleConfirmValidate = useCallback(() => {
    if (!detailRow || !validationValues.requisition_id) return;

    setOpenValidateTicket(false);
    setLastValidatedTicketId(detailRow.id);
    billingDocumentNotDeductible({
      requisition_id: validationValues.requisition_id,
      billingimages_id: detailRow.source.billing_image_id ?? detailRow.id,
      numpersons: Number(validationValues.numpersons ?? 0),
      total: Number(validationValues.total ?? 0),
    });
  }, [billingDocumentNotDeductible, detailRow, validationValues]);

  const isValidateLocked = useMemo(() => {
    if (!detailRow) return true;
    if (!isPendingStatus(detailRow.status)) return true;
    if (!markAsNotDeductible) return true;
    if (notDeducting) return true;
    return !validationValues.requisition_id;
  }, [
    detailRow,
    markAsNotDeductible,
    notDeducting,
    validationValues.requisition_id,
  ]);

  const isToggleLocked = useMemo(
    () => !detailRow || !isPendingStatus(detailRow.status) || notDeducting,
    [detailRow, notDeducting],
  );

  const desktopColumns: ColumnDefinition<TicketRow>[] = useMemo(
    () => [
      {
        key: "attachments",
        label: "Archivos",
        cellClass: "w-2/15 text-left",
        headerClass: "w-2/15 text-left",
        render: (row) => (
          <div className="flex items-center gap-1">
            {row.imageUrls.length > 0 && (
              <Button
                size="xsmall"
                variant="ghost"
                icon={DownloadIcon}
                onClick={() => window.open(row.imageUrls[0], "_blank")}
                aria-label="Descargar"
                data-tour="requisitions-ticket-download"
              />
            )}
            {row.imageUrls.length > 0 && (
              <Button
                size="xsmall"
                variant="ghost"
                icon={ImageIcon}
                onClick={() => openPreview(row.imageUrls, 0)}
                aria-label="Abrir ticket"
                data-tour="requisitions-ticket-preview"
              />
            )}
          </div>
        ),
      },
      {
        key: "date",
        label: "Fecha",
        cellClass: "w-2/15 text-left",
        headerClass: "w-2/15 text-left",
      },
      {
        key: "category",
        label: "Categoría",
        cellClass: "w-4/15 text-left",
        headerClass: "w-4/15 text-left",
      },
      {
        key: "status",
        label: "Estatus",
        cellClass: "w-3/15 text-right",
        headerClass: "w-3/15 text-right",
        render: (row) => (
          <Label type={statusToType(row.status)} text={row.status?.toUpperCase() ?? ""} />
        ),
      },
      {
        key: "comments",
        label: "Comentario",
        cellClass: "w-2/15 text-right",
        headerClass: "w-2/15 text-right",
        render: (row) => {
          const hasComment =
            Boolean(row.comments?.trim()) || Boolean(row.userComments?.trim());
          if (!hasComment) return null;
          return (
            <Button
              size="small"
              variant="ghost"
              hideIcon
              onClick={() => openDetails(row)}
            >
              <ChatIcon className="h-6 w-6" />
            </Button>
          );
        },
      },
      {
        key: "detail",
        label: "Detalle",
        cellClass: "w-2/15 text-right",
        headerClass: "w-2/15 text-right",
        render: (row) => (
          <Button
            size="small"
            variant="ghost"
            hideIcon
            onClick={() => openDetails(row)}
            data-tour="requisitions-ticket-details"
          >
            Ver Detalles
          </Button>
        ),
      },
    ],
    [openDetails, openPreview],
  );

  const mobileColumns: ColumnDefinition<TicketRow>[] = useMemo(
    () => [
      {
        key: "attachments",
        label: "Archivos",
        cellClass: "w-3/12 text-left",
        headerClass: "w-3/12 text-left",
        render: (row) => (
          <div className="flex items-center gap-1">
            {row.imageUrls.length > 0 && (
              <Button
                size="xsmall"
                variant="ghost"
                icon={DownloadIcon}
                onClick={() => window.open(row.imageUrls[0], "_blank")}
                aria-label="Descargar"
                data-tour="requisitions-ticket-download"
              />
            )}
          </div>
        ),
      },
      {
        key: "date",
        label: "Fecha",
        cellClass: "w-3/12 text-left",
        headerClass: "w-3/12 text-left",
      },
      {
        key: "status",
        label: "Estatus",
        cellClass: "w-3/12 text-right",
        headerClass: "w-3/12 text-right",
        render: (row) => (
          <Label
            type={statusToType(row.status)}
            text={row.status || ""}
            className="m-0 px-2 py-0.5 text-[10px]"
          />
        ),
      },
      {
        key: "detail",
        label: "Detalle",
        cellClass: "w-3/12 text-right",
        headerClass: "w-3/12 text-right",
        render: (row) => (
          <Button
            size="xsmall"
            variant="ghost"
            hideIcon
            onClick={() => openDetails(row)}
            data-tour="requisitions-ticket-details"
          >
            Ver
          </Button>
        ),
      },
    ],
    [openDetails],
  );

  const columns = isMobile ? mobileColumns : desktopColumns;

  return {
    columns,
    rows: filteredRows,
    filterOptions,
    filterValue,
    setFilterValue,
    refresh,
    isTutorialActive,
    tutorialMockRow: isTutorialActive ? mockRows[0] ?? null : null,
    previewSrc: previewImages[previewIndex] ?? null,
    previewIndex,
    previewTotal: previewImages.length,
    closePreview,
    nextPreview,
    prevPreview,
    detailOpen,
    detailRow,
    closeDetails,
    openPreview,
    openReject,
    openValidateTicket,
    setOpenValidateTicket,
    openRejectTicket,
    setOpenRejectTicket,
    handleSubmitReject,
    handleValidateClick,
    handleConfirmValidate,
    validationFields,
    validationFormVersion,
    validationValues,
    setValidationValues,
    showValidationForm,
    markAsNotDeductible,
    handleToggleNotDeductible,
    isValidateLocked,
    isToggleLocked,
    rejecting,
    notDeducting,
  };
};

export default useTicketsFiles;
