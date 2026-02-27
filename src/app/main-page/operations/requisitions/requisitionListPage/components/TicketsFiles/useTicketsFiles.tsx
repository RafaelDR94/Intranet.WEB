import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/app/components/Button/Button";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import Label from "@/app/components/Label/Label";
import { LabelType } from "@/app/components/Label/types";
import ImageIcon from "@/assets/icons/Fotos y Videos/media-image.svg";
import DownloadIcon from "@/assets/icons/acciones/download.svg";
import ChatIcon from "@/assets/icons/Comunicacion/chat-lines.svg";

import { useRequisitionDocuments } from "../hooks/useRequisitionDocuments";
import { useBillingImagesStore } from "@/app/stores/useBillingImagesStore/useBillingImagesStore";
import { useBillingRequisitionWithEmployeesStore } from "@/app/stores/useBillingRequisitionWithEmployeesStore/useBillingRequisitionWithEmployeesStore";
import type { BillingImages } from "@/app/mappings/billingimages/billingimages.types";
import { shallow } from "zustand/shallow";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";

export type TicketRow = {
  id: string;
  date: string;
  category: string;
  status: string;
  comments: string;
  userComments?: string;
  detail: string;
  imageUrls: string[];
  source: BillingImages;
  attachments?: string[];
};

type TicketOverride = {
  status?: string;
  comments?: string;
};

const normalizeImages = (
  images: BillingImages["images"] | { image?: string }[],
): string[] => {
  if (Array.isArray(images)) {
    return images
      .map((item) => (typeof item === "string" ? item : item?.image ?? ""))
      .filter((item) => Boolean(item));
  }
  return [];
};

const mapTickets = (
  images: BillingImages[],
  overrides?: Record<string, TicketOverride>,
): TicketRow[] =>
  images
    .map((item) => {
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
    })
  

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
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const searchParams = useSearchParams();
  const isBillableFilesView = searchParams.get("view") === "billablefiles";
  const {  employeeId } = useRequisitionDocuments();
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
  const { pendingBillingImages, fetchBillingImagesPendingByEmployee } =
    useBillingRequisitionWithEmployeesStore(
      (state) => ({
        pendingBillingImages: state.pendingBillingImages,
        fetchBillingImagesPendingByEmployee: state.fetchBillingImagesPendingByEmployee,
      }),
      shallow,
    );
  const { rejectBillingImage, rejecting, succesReject, error, resetFlags } =
    useBillingImagesStore(
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
  const [filterValue, setFilterValue] = useState<string>("all");

  useEffect(() => {
    if (isBillableFilesView) {
      if (!employeeId) return;
      fetchBillingImages(employeeId, true);
      return;
    }
    if (!employeeId) return;
    fetchBillingImagesPendingByEmployee(employeeId, true);
  }, [
    employeeId,
    fetchBillingImages,
    fetchBillingImagesPendingByEmployee,
    isBillableFilesView,
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
  }, [error, rejecting]);

  const rows = useMemo(() => {
    const sourceImages = isBillableFilesView ? billingImages : pendingBillingImages;
    return mapTickets(sourceImages, statusOverrides);
  }, [pendingBillingImages, billingImages, isBillableFilesView, statusOverrides]);

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

  const openDetails = useCallback((row: TicketRow) => {
    setDetailRow(row);
    setDetailOpen(true);
  }, []);

  const closeDetails = useCallback(() => {
    setDetailOpen(false);
  }, []);

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
            {row.imageUrls.length > 0 && (
              <Button
                size="xsmall"
                variant="ghost"
                icon={DownloadIcon}
                onClick={() => window.open(row.imageUrls[0], "_blank")}
                aria-label="Descargar"
              />
            )}
            {row.imageUrls.length > 0 && (
              <Button
                size="xsmall"
                variant="ghost"
                icon={ImageIcon}
                onClick={() => openPreview(row.imageUrls, 0)}
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
          <Button size="small" variant="ghost" hideIcon onClick={() => openDetails(row)}>
            Ver Detalles
          </Button>
        ),
      },
    ],
    [openDetails, openPreview],
  );

  return {
    columns,
    rows: filteredRows,
    filterOptions,
    filterValue,
    setFilterValue,
    refresh,
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
    openRejectTicket,
    setOpenRejectTicket,
    handleSubmitReject,
    rejecting,

  };
};

export default useTicketsFiles;
