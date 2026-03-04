"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/app/components/Button/Button";
import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import Label from "@/app/components/Label/Label";
import type { LabelType } from "@/app/components/Label/types";
import DetailsPanel from "@/app/main-page/request/ownrequisitions/componentes/RequisitionsDetails/components/DetailsPanel/DetailsPanel";
import ChatIcon from "@/assets/icons/Comunicacion/chat-bubble.svg";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";
import ImageIcon from "@/assets/icons/Fotos y Videos/media-image.svg";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import type { BillingDocuments } from "@/app/mappings/billingdocuments/billingdocuments.types";
import { useIntranetGatewayStore } from "@/app/stores/system/useIntranetGatewayStore";
import { useBillingAllDocumentsByEmployeeStore } from "@/app/stores/useBillingAllDocumentsByEmployeeStore/useBillingAllDocumentsByEmployeeStore";

type BillableFileRow = {
  id: string;
  requisitionKey?: string;
  source: BillingDocuments;
  files: {
    xml?: boolean;
    pdf?: boolean;
    image?: boolean;
  };
  date: string;
  category: string;
  project?: string;
  status: "Pendiente" | "Rechazado" | "Validada";
  comments?: string;
};

const normalizeStatus = (status?: string | null): BillableFileRow["status"] => {
  const normalized = String(status ?? "").toLowerCase();
  if (normalized.includes("rechaz")) return "Rechazado";
  if (normalized.includes("valid")) return "Validada";
  return "Pendiente";
};

const statusToLabel = (status: BillableFileRow["status"]): LabelType => {
  if (status === "Rechazado") return "rechazado";
  if (status === "Validada") return "valido";
  return "pendiente";
};

const BillableFilesPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const isGatewayReady = useIntranetGatewayStore((s) => s.isReady);
  const [panelOpen, setPanelOpen] = useState(false);
  const [selected, setSelected] = useState<BillingDocuments | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { billingDocumentsByEmployee, loading, fetchBillingAllDocumentsByEmployee } =
    useBillingAllDocumentsByEmployeeStore((s) => ({
      billingDocumentsByEmployee: s.billingDocumentsByEmployee,
      loading: s.loading,
      fetchBillingAllDocumentsByEmployee: s.fetchBillingAllDocumentsByEmployee,
    }));

  useEffect(() => {
    if (isGatewayReady && user?.idEmployee) {
      fetchBillingAllDocumentsByEmployee(user.idEmployee, true);
    }
  }, [isGatewayReady, user?.idEmployee, fetchBillingAllDocumentsByEmployee]);

  const rows = useMemo<BillableFileRow[]>(() => {
    return billingDocumentsByEmployee.map((doc) => ({
      id: doc.billingdocument_id || doc.id,
      requisitionKey: doc.requisition?.requisitionkey ?? "",
      source: doc,
      files: {
        xml: Boolean(doc.xml),
        pdf: Boolean(doc.pdf),
        image: Boolean(doc.image),
      },
      date: doc.date_created || doc.fecha || "",
      category: doc.category?.name ?? "",
      project: doc.requisition?.projectname ?? "",
      status: normalizeStatus(doc.status),
      comments: doc.user_comments || doc.comments || undefined,
    }));
  }, [billingDocumentsByEmployee]);

  const filteredRows = useMemo(() => {
    if (statusFilter === "all") return rows;
    const target = statusFilter.toLowerCase();
    return rows.filter((row) => row.status.toLowerCase() === target);
  }, [rows, statusFilter]);

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [filteredRows]);

  const recentRows = useMemo(() => sortedRows.slice(0, 4), [sortedRows]);
  const historyRows = sortedRows;
  const requisitionId = selected?.requisition?.billingrequisition_id;

  const handleOpenDetails = (row: BillableFileRow) => {
    setSelected(row.source);
    setPanelOpen(true);
  };

  const columns = useMemo<ColumnDefinition<BillableFileRow>[]>(
    () => [
      {
        key: "files",
        label: "ARCHIVOS",
        render: (row) => (
          <div className="flex items-center justify-center gap-2">
            {row.files.xml && (
              <Button size="xsmall" variant="ghost" icon={XMLIcon} iconOnly />
            )}
            {row.files.pdf && (
              <Button size="xsmall" variant="ghost" icon={PDFIcon} iconOnly />
            )}
            {row.files.image && (
              <Button size="xsmall" variant="ghost" icon={ImageIcon} iconOnly />
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
            >
              Ver Detalle
            </Button>
          </div>
        ),
        headerClass: "basis-[140px] flex-none text-center",
        cellClass: "basis-[140px] flex-none text-center",
      },
    ],
    [],
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

  return (
    <div className="space-y-8 overflow-auto">
      <DataTable
        dataTableTitle="Archivos Recientes"
        showCalendar
        textSize={{ mobile: "c2", desktop: "text-b3" }}
        showFilter
        filterTitle="Filtrar estatus"
        filterOptions={statusFilterOptions}
        filterValue={statusFilter}
        onFilterChange={(value) => setStatusFilter(value)}
        showRefresh
        showButton
        actionLabel="Subir Archivos"
        onTableActionClick={() =>
          router.push("/main-page/accounting/billablefiles/billablefiles/")
        }
        onCalendarClick={() => undefined}
        onFilterClick={() => undefined}
        onRefreshPage={() => {
          if (user?.idEmployee) fetchBillingAllDocumentsByEmployee(user.idEmployee, true);
        }}
        searchableKeys={["id", "date", "category", "project", "status"]}
        tables={[
          {
            data: recentRows,
            columns,
            enableSelection: false,
            title: "Archivos Recientes",
            enableCollaps: true,
            defaultSortKey: "date",
            defaultSortDirection: "desc",
          },
        ]}
        dateKey="date"
      />

      <DataTable
        dataTableTitle="Historial"
        showCalendar
        showFilter
        filterTitle="Filtrar estatus"
        filterOptions={statusFilterOptions}
        filterValue={statusFilter}
        onFilterChange={(value) => setStatusFilter(value)}
        showRefresh
        showButton={false}
        textSize={{ mobile: "c2", desktop: "text-b3" }}
        onCalendarClick={() => undefined}
        onFilterClick={() => undefined}
        onRefreshPage={() => {
          if (user?.idEmployee) fetchBillingAllDocumentsByEmployee(user.idEmployee, true);
        }}
        searchableKeys={["id", "date", "category", "project", "status"]}
        tables={[
          {
            data: historyRows,
            columns,
            enableSelection: false,
            title: "Historial",
            enableCollaps: true,
            defaultSortKey: "date",
            defaultSortDirection: "desc",
          },
        ]}
        dateKey="date"
      />
      {loading && null}
      <DetailsPanel
        panelOpen={panelOpen}
        setPanelOpen={setPanelOpen}
        selected={selected}
        operations
        reqisition={requisitionId}
      />
    </div>
  );
};

export default BillableFilesPage;
