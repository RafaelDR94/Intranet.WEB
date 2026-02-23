import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/app/components/Button/Button";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import Label from "@/app/components/Label/Label";
import { LabelType } from "@/app/components/Label/types";
import ImageIcon from "@/assets/icons/Fotos y Videos/media-image.svg";
import DownloadIcon from "@/assets/icons/acciones/download.svg";

import { useRequisitionDocuments } from "../hooks/useRequisitionDocuments";
import { useBillingImagesStore } from "@/app/stores/useBillingImagesStore/useBillingImagesStore";
import type { BillingImagesByEmployee } from "@/app/mappings/billingimages/billingimages.types";
import { useBillingImagesByEmployeeStore } from "@/app/stores/useBillingImagesByEmployeeStore/useBillingImagesByEmployeeStore";
import { shallow } from "zustand/shallow";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";

type TicketRow = {
  id: string;
  date: string;
  category: string;
  status: string;
  comments: string;
  detail: string;
  imageUrls: string[];
  source: BillingImagesByEmployee;
  attachments?: string[];
};

const normalizeImages = (images: BillingImagesByEmployee["images"] | { image?: string }[]): string[] => {
  if (Array.isArray(images)) {
    return images
      .map((item) => (typeof item === "string" ? item : item?.image ?? ""))
      .filter((item) => Boolean(item));
  }
  return [];
};

const mapTickets = (images: BillingImagesByEmployee[]): TicketRow[] =>
  images
    .map((item) => ({
      id: item.billing_image_id,
      date: item.dateCreate,
      category: item.category?.name ?? "",
      detail: item.description?.name ?? "",
      status: item.status ?? "",
      comments: item.comments ?? "",
      imageUrls: normalizeImages(item.images),
      source: item,
    }))
    .filter((item) => item.imageUrls.length > 0);

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
  const { requisitionId, requisition } = useRequisitionDocuments();
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRow, setDetailRow] = useState<TicketRow | null>(null);
  const [openRejectTicket, setOpenRejectTicket] = useState<{
    state: boolean;
    row: TicketRow | null;
  }>({ state: false, row: null });
  const { billingImagesByEmployee, fetchBillingImagesByEmployee } = useBillingImagesByEmployeeStore(
    (state) => ({
      billingImagesByEmployee: state.billingImagesByEmployee,
      fetchBillingImagesByEmployee: state.fetchBillingImagesByEmployee,
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

  useEffect(() => {
    if (!requisition?.id_Employee) return;
    fetchBillingImagesByEmployee(requisition.id_Employee, true);
  }, [fetchBillingImagesByEmployee, requisition?.id_Employee]);

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

  const rows = useMemo(
    () => mapTickets(billingImagesByEmployee),
    [billingImagesByEmployee],
  );

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
      const payload = {
        billing_image_id: openRejectTicket.row?.source.billing_image_id ?? "",
        comments: String(values.comments ?? ""),
      };

      setOpenRejectTicket({ state: false, row: null });
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
      { key: "comments", label: "Comentario", cellClass: "w-2/15 text-right", headerClass: "w-2/15 text-right" },
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
    rows,
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
    toBillingImagesTable: (row: TicketRow) => ({
      id: row.source.billing_image_id,
      billing_image_id: row.source.billing_image_id,
      deudor: row.source.employee?.fullname ?? "",
      proyect: requisition?.projectname ?? "",
      images: row.source.images,
      Image: row.source.images?.[0] ?? "",
      comments: row.source.comments ?? "",
      dateCreate: row.source.dateCreate,
      requisition_id: requisition?.billingrequisition_id ?? requisitionId ?? "",
      category: row.source.category,
      description: row.source.description,
      numpersons: row.source.numpersons,
      numnights: row.source.numnights,
      requisitionkey: requisition?.requisitionkey ?? "",
      categoryName: row.source.category?.name ?? "",
      descriptionName: row.source.description?.name ?? "",
    }),
  };
};

export default useTicketsFiles;
