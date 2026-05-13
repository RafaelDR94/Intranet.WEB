"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import ActionMenuCell from "@/app/components/ActionMenuCell/ActionMenuCell";
import { Button } from "@/app/components/Button/Button";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import Label from "@/app/components/Label/Label";
import type { LabelType } from "@/app/components/Label/types";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import type { BillingDocuments } from "@/app/mappings/billingdocuments/billingdocuments.types";
import { useIntranetGatewayStore } from "@/app/stores/system/useIntranetGatewayStore";
import { useBillingAllDocumentsByEmployeeStore } from "@/app/stores/useBillingAllDocumentsByEmployeeStore/useBillingAllDocumentsByEmployeeStore";
import useTutorialAutoRun from "@/tutorials/engine/useTutorialAutoRun";
import ChatIcon from "@/assets/icons/Comunicacion/chat-bubble.svg";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";
import ImageIcon from "@/assets/icons/Fotos y Videos/media-image.svg";
import type { BillingImages } from "@/app/mappings/billingimages/billingimages.types";
import type { BillableFileRow, BillableFileStatus } from "../types";

const normalizeStatus = (status?: string | null): BillableFileStatus => {
  const normalized = String(status ?? "").toLowerCase();
  if (normalized.includes("rechaz")) return "Rechazado";
  if (normalized.includes("valid")) return "Validada";
  return "Pendiente";
};

const statusToLabel = (status: BillableFileStatus): LabelType => {
  if (status === "Rechazado") return "rechazado";
  if (status === "Validada") return "valido";
  return "pendiente";
};

const useBillableFilesPage = () => {
  const router = useRouter();
  const { user, currentPagePermissions } = useAuth();
  const isGatewayReady = useIntranetGatewayStore((s) => s.isReady);
  const isMobile = useIsMobile();
  const [panelOpen, setPanelOpen] = useState(false);
  const [selected, setSelected] = useState<BillingDocuments|BillingImages | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { billingDocumentsByEmployee, loading, fetchBillingAllDocumentsByEmployee } =
    useBillingAllDocumentsByEmployeeStore((s) => ({
      billingDocumentsByEmployee: s.billingDocumentsByEmployee,
      loading: s.loading,
      fetchBillingAllDocumentsByEmployee: s.fetchBillingAllDocumentsByEmployee,
    }));

  useTutorialAutoRun({
    moduleId: "request-ownrequisitions-billablefiles",
    tutorialId: "request-ownrequisitions:billablefiles",
  });

  useEffect(() => {
    if (isGatewayReady && user?.idEmployee) {
      fetchBillingAllDocumentsByEmployee(user.idEmployee, true);
    }
  }, [isGatewayReady, user?.idEmployee, fetchBillingAllDocumentsByEmployee]);

  const rows = useMemo<BillableFileRow[]>(
    () =>
      billingDocumentsByEmployee.map((doc) => ({
        id: doc.id,
        requisitionKey: doc.requisitonkey??"",
        source: doc.billingdocument?doc.billingdocument:doc.billingimage,
        files: {
          xml: Boolean(doc.xml),
          pdf: Boolean(doc.pdf),
          image: Boolean(doc.image),
        },
        date: doc.dateCreated,
        category: doc.category,
        project: doc.proyect,
        status: normalizeStatus(doc.status),
        comments: doc.comments,
      })),
    [billingDocumentsByEmployee],
  );

  const filteredRows = useMemo(() => {
    if (statusFilter === "all") return rows;
    const target = statusFilter.toLowerCase();
    return rows.filter((row) => row.status.toLowerCase() === target);
  }, [rows, statusFilter]);

  const sortedRows = useMemo(
    () => [...filteredRows].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [filteredRows],
  );

  const recentRows = useMemo(() => sortedRows.slice(0, 4), [sortedRows]);
  const historyRows = sortedRows;
  const requisitionId = selected?.requisition?.billingrequisition_id;
  const canRead = currentPagePermissions?.read !== false;

  const handleOpenDetails = useCallback((row: BillableFileRow) => {
    setSelected(row.source);
    setPanelOpen(true);
  }, []);

  const refresh = useCallback(() => {
    if (user?.idEmployee) {
      fetchBillingAllDocumentsByEmployee(user.idEmployee, true);
    }
  }, [fetchBillingAllDocumentsByEmployee, user?.idEmployee]);

  const handleUploadFiles = useCallback(() => {
    router.push("/main-page/request/ownrequisitions/uploadbillablefiles/");
  }, [router]);

  const getRowUid = useCallback((row: BillableFileRow) => {
    const source = row.source as Partial<BillingDocuments> | Partial<BillingImages> | null;
    const requisitionCode =
      source &&
      "requisition" in source &&
      source.requisition &&
      typeof source.requisition === "object" &&
      "requisitionkey" in source.requisition &&
      typeof source.requisition.requisitionkey === "string"
        ? source.requisition.requisitionkey.trim()
        : "";

    return requisitionCode || row.requisitionKey || row.id;
  }, []);

  const getRowUuid = useCallback((row: BillableFileRow) => {
    const source = row.source as Partial<BillingDocuments> | Partial<BillingImages> | null;
    const billingUuid =
      source && "uuid" in source && typeof source.uuid === "string"
        ? source.uuid.trim()
        : "";

    return billingUuid || row.id;
  }, []);

  const mobileColumns = useMemo<ColumnDefinition<BillableFileRow>[]>(
    () => [
      {
        key: "project",
        label: "REQUISICION",
        render: (row) => (
          <div className="min-w-0 py-1">
            <span
              className="block truncate text-[11px] font-medium leading-4 text-blue-95"
              title={getRowUuid(row)}
            >
              {getRowUuid(row)}
            </span>
            <span
              className="mt-1 block truncate text-[10px] leading-4 text-neutral-500"
              title={`${row.project || "-"} - ${getRowUid(row)}`}
            >
              {`${row.project || "-"} - ${getRowUid(row)}`}
            </span>
          </div>
        ),
        headerClass: "min-w-0",
        cellClass: "min-w-0",
      },
      {
        key: "status",
        label: "ESTATUS",
        render: (row) => (
          <div className="flex justify-center">
            <Label
              type={statusToLabel(row.status)}
              text={row.status}
              className="px-2 py-0.5 text-[10px] leading-4"
            />
          </div>
        ),
        headerClass: "w-[88px] text-center",
        cellClass: "w-[88px] text-center",
      },
      {
        key: "details" as unknown as keyof BillableFileRow,
        label: "",
        render: (row) => (
          <div className="flex justify-end" data-tour="ownrequisitions-billablefiles-details">
            <ActionMenuCell
              row={row}
              onEdit={handleOpenDetails}
              editLabel="Ver detalle"
              permissions={{ details: canRead }}
            />
          </div>
        ),
        headerClass: "w-10 text-right",
        cellClass: "w-10 text-right",
      },
    ],
    [canRead, getRowUid, getRowUuid, handleOpenDetails],
  );

  const desktopColumns = useMemo<ColumnDefinition<BillableFileRow>[]>(
    () => [
      {
        key: "files",
        label: "ARCHIVOS",
        render: (row) => (
          <div className="flex items-center justify-center gap-2">
            {row.files.xml && (
              <Button
                size="xsmall"
                variant="ghost"
                icon={XMLIcon}
                iconOnly
                data-tour="ownrequisitions-billablefiles-xml"
              />
            )}
            {row.files.pdf && (
              <Button
                size="xsmall"
                variant="ghost"
                icon={PDFIcon}
                iconOnly
                data-tour="ownrequisitions-billablefiles-pdf"
              />
            )}
            {row.files.image && (
              <Button
                size="xsmall"
                variant="ghost"
                icon={ImageIcon}
                iconOnly
                data-tour="ownrequisitions-billablefiles-image"
              />
            )}
          </div>
        ),
        headerClass: "basis-[140px] flex-none text-center",
        cellClass: "basis-[140px] flex-none text-center",
      },
      {
        key: "date",
        label: "FECHA",
        headerClass: "basis-[140px] flex-none",
        cellClass: "basis-[140px] flex-none whitespace-nowrap",
      },
      {
        key: "category",
        label: "CATEGORIA",
        render: (row) => (
          <span
            className="block w-full overflow-hidden text-ellipsis whitespace-nowrap"
            title={row.category}
          >
            {row.category}
          </span>
        ),
        headerClass: "basis-[260px] flex-none",
        cellClass: "basis-[260px] flex-none pr-6 overflow-hidden",
      },
      {
        key: "project",
        label: "PROYECTO",
        render: (row) => (
          <span className="block truncate" title={row.project}>
            {row.project}
          </span>
        ),
        headerClass: "basis-[180px] flex-none",
        cellClass: "basis-[180px] flex-none whitespace-nowrap",
      },
      {
        key: "status",
        label: "ESTATUS",
        render: (row) => (
          <div className="flex justify-center">
            <Label type={statusToLabel(row.status)} text={row.status} />
          </div>
        ),
        headerClass: "basis-[140px] flex-none text-center",
        cellClass: "basis-[140px] flex-none text-center",
      },
      {
        key: "comments",
        label: "COMENTARIOS",
        render: (row) =>
          row.comments ? (
            <Button
              size="small"
              onClick={() => handleOpenDetails(row)}
              variant="ghost"
              hideIcon
              data-tour="ownrequisitions-billablefiles-comments"
            >
              <ChatIcon className="h-6 w-6" />
            </Button>
          ) : null,
        headerClass: "basis-[140px] flex-none text-center",
        cellClass: "basis-[140px] flex-none text-center",
      },
      {
        key: "details" as unknown as keyof BillableFileRow,
        label: "DETALLES",
        render: (row) => (
          <div className="flex justify-center">
            <Button
              size="small"
              variant="ghost"
              hideIcon
              onClick={() => handleOpenDetails(row)}
              data-tour="ownrequisitions-billablefiles-details"
            >
              Ver Detalle
            </Button>
          </div>
        ),
        headerClass: "basis-[140px] flex-none text-center",
        cellClass: "basis-[140px] flex-none text-center",
      },
    ],
    [handleOpenDetails],
  );

  const statusFilterOptions = useMemo(
    () => [
      { label: "Todos", value: "all" },
      { label: "Rechazado", value: "Rechazado" },
      { label: "Pendiente", value: "Pendiente" },
      { label: "Validado", value: "Validada" },
    ],
    [],
  );

  return {
    columns: isMobile ? mobileColumns : desktopColumns,
    historyRows,
    loading,
    panelOpen,
    recentRows,
    requisitionId,
    selected,
    setPanelOpen,
    statusFilter,
    statusFilterOptions,
    setStatusFilter,
    refresh,
    handleUploadFiles,
  };
};

export default useBillableFilesPage;
