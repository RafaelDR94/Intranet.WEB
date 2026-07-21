"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { shallow } from "zustand/shallow";

import type { RequisitionRow } from "../types";

import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import type { Requisition } from "@/app/mappings/requisitions/requisitions.types";
import { useIntranetGatewayStore } from "@/app/stores/system/useIntranetGatewayStore";
import { useBillingRequisitionWithEmployeesStore } from "@/app/stores/useBillingRequisitionWithEmployeesStore/useBillingRequisitionWithEmployeesStore";
import { currentDate } from "@/app/utilities/DatesHelper/Dateshelper";
import { useTutorials } from "@/tutorials/engine/TutorialProvider";

/**
 * Handles data loading, filtering and row actions for the requisitions table.
 */
export const useRequisitionTable = () => {
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert, hideAlert } = usePrincipalAlert;
  const { activeTutorialId } = useTutorials();
  const isTutorialActive = activeTutorialId === "operations-requisitions:list";
  const [lastDates, setLastDates] = useState<{
    startDate: string;
    endDate: string;
  }>({ startDate: currentDate(), endDate: currentDate() });
  const isGatewayReady = useIntranetGatewayStore((s) => s.isReady);
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasIdParam =
    typeof (searchParams as any)?.has === "function"
      ? (searchParams as any).has("id")
      : new URLSearchParams((searchParams as any) ?? "").has("id");
  const {
    requisitions,
    loading,
    error,
    removing,
    fetchRequisitionsWithEmployees,
    deleteRequisition,
    resetFlags,
  } = useBillingRequisitionWithEmployeesStore(
    (s) => ({
      requisitions: s.requisitions,
      loading: s.loading,
      error: s.error,
      removing: s.removing,
      fetchRequisitionsWithEmployees: s.fetchRequisitionsWithEmployees,
      deleteRequisition: s.deleteRequisition,
      resetFlags: s.resetFlags,
    }),
    shallow,
  );

  // Prefetch
  useEffect(() => {
    if (isTutorialActive) return;
    if (isGatewayReady && !hasIdParam)
      fetchRequisitionsWithEmployees(
        lastDates.startDate,
        lastDates.endDate,
        true,
      );
  }, [
    isGatewayReady,
    hasIdParam,
    fetchRequisitionsWithEmployees,
    lastDates.startDate,
    lastDates.endDate,
    isTutorialActive,
  ]);

  // Alert de error general de carga
  useEffect(() => {
    if (isTutorialActive) return;
    if (loading) {
      showSpinner({ message: "Cargando requisiciones…" });
      return;
    }
    hideSpinner();
    resetFlags();
    if (!error) return;
    showAlert({
      type: "error",
      variant: "filled",
      title: "No se pudieron cargar las requisiciones",
      description: String(error),
      showPrimaryButton: true,
      primaryLabel: "Entendido",
      onPrimaryClick: hideAlert,
      showSecondaryButton: true,
      secondaryLabel: "Reintentar",
      onSecondaryClick: () => {
        hideAlert();
        fetchRequisitionsWithEmployees(
          lastDates.startDate,
          lastDates.endDate,
          true,
        );
      },
    });
  }, [
    error,
    loading,
    hideSpinner,
    resetFlags,
    showAlert,
    showSpinner,
    hideAlert,
    fetchRequisitionsWithEmployees,
    lastDates.startDate,
    lastDates.endDate,
    isTutorialActive,
  ]);

  const [query, setQuery] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<RequisitionRow | null>(null);
  const mockRows = useMemo<RequisitionRow[]>(() => {
    const today = currentDate();
    const demoAvatar =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P4z8DwHwAFgwJ/lm8X3wAAAABJRU5ErkJggg==";
    return [
      {
        id: "mock-req-001",
        employeeId: "EMP-001",
        snCode: "REQ-2026-001",
        employeename: "Maria Gonzalez",
        debtorName: "Maria Gonzalez",
        projectCode: "Proyecto Atlas",
        assignmentDate: today,
        dueDate: today,
        amount: 12500,
        status: "En revision",
        state: "Pendiente",
        phone_number: "55 1234 5678",
        email: "maria.gonzalez@demo.com",
        image_url: demoAvatar,
        date_created: today,
      },
      {
        id: "mock-req-002",
        employeeId: "EMP-002",
        snCode: "REQ-2026-002",
        employeename: "Carlos Hernandez",
        debtorName: "Carlos Hernandez",
        projectCode: "Proyecto Delta",
        assignmentDate: today,
        dueDate: today,
        amount: 9800,
        status: "Pendiente",
        state: "Pendiente",
        phone_number: "55 8765 4321",
        email: "carlos.hernandez@demo.com",
        image_url: demoAvatar,
        date_created: today,
      },
    ];
  }, []);
  const isMockRow = (row: RequisitionRow) => row.id.startsWith("mock-");

  const rows: RequisitionRow[] = useMemo(() => {
    const base = requisitions.map((r) => {
      const requisition = r as Partial<Requisition>;
      const benefit = r as {
        id_employee?: string;
        id_requisition?: string;
        fullname?: string;
        email?: string;
        phone_number?: string;
        image_url?: string;
      };
      const employeename = requisition.employeename ?? benefit.fullname ?? "";
      const employeeId = requisition.id_Employee ?? benefit.id_employee ?? "";
      const requisitionId =
        requisition.billingrequisition_id ??
        benefit.id_requisition ??
        employeeId;

      return {
        id: requisitionId ?? "",
        employeeId,
        snCode: requisition.requisitionkey ?? "",
        employeename,
        debtorName: employeename,
        // Prefer project ID/code to match visual sample
        projectCode: requisition.projectname ?? "",
        assignmentDate: requisition.assignmentdate,
        dueDate: requisition.endDate,
        amount: requisition.amountdeposited
          ? Number(requisition.amountdeposited)
          : undefined,
        status: requisition.status,
        state: requisition.state,
        phone_number: requisition.phone_number ?? benefit.phone_number ?? "",
        email: requisition.email ?? benefit.email ?? "",
        image_url: requisition.image_url ?? benefit.image_url ?? "",
        date_created: requisition.date_created,
      };
    });
    const merged = isTutorialActive ? [...mockRows, ...base] : base;
    if (!query) return merged;
    const q = query.toLowerCase();
    return merged.filter(
      (r) =>
        r.snCode.toLowerCase().includes(q) ||
        r.employeename?.toLowerCase().includes(q) ||
        r.debtorName.toLowerCase().includes(q) ||
        r.projectCode.toLowerCase().includes(q),
    );
  }, [requisitions, query, mockRows, isTutorialActive]);

  const onEdit = (row: RequisitionRow) => {
    const clean = path.endsWith("/") ? path.slice(0, -1) : path; // quita slash final si viene
    const qs = new URLSearchParams(searchParams.toString()); // clona params actuales
    qs.delete("label"); // remueve label previo de vistas de archivos/requisiciones
    qs.set("id", row.id); // añade/reemplaza id
    router.push(`${clean}?${qs.toString()}`);
  };

  const getFirstName = (name?: string | null) => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    return parts[0] || "";
  };

  const buildLabel = (prefix: string, name?: string | null) => {
    const firstName = getFirstName(name);
    return firstName ? `${prefix} ${firstName}` : prefix;
  };

  const onViewFiles = (row: RequisitionRow) => {
    const isOperationsContext =
      path.startsWith(
        "/main-page/operations/requisitions/requisitionListPage",
      ) ||
      path.startsWith(
        "/main-page/operations/expenserequisitions/beneficiaryhistory",
      );

    // `RequisitionsTable` is shared by Operations and Accounting.
    // Keep the original Operations behavior (same-page view switch) when used there.
    if (isOperationsContext) {
      const clean = path.endsWith("/") ? path.slice(0, -1) : path;
      const qs = new URLSearchParams(searchParams.toString());
      const resolvedId = row.id || row.employeeId || "";
      qs.set("id", resolvedId);
      if (row.employeeId) {
        qs.set("idEmployee", row.employeeId);
      }
      qs.set("label", buildLabel("Archivos", row.debtorName));
      router.push(`${clean}?${qs.toString()}`);
      return;
    }

    // Accounting behavior: jump to validate invoices with employee context.
    const qs = new URLSearchParams();
    const employeeId = row.employeeId || row.id;
    if (employeeId) {
      qs.set("idEmployee", employeeId);
    }
    if (row.debtorName) {
      qs.set("employeeName", row.debtorName);
    }
    router.push(
      `/main-page/accounting/invoices/validateinvoices?${qs.toString()}`,
    );
  };

  const onViewRequisitions = (row: RequisitionRow) => {
    const clean = path.endsWith("/") ? path.slice(0, -1) : path;
    const qs = new URLSearchParams(searchParams.toString());
    const requisitionsLabel = buildLabel("Requisiciones", row.debtorName);
    qs.set("id", row.employeeId ?? row.id);
    qs.set("idEmployee", row.employeeId ?? row.id);
    qs.set("label", requisitionsLabel);
    qs.set("requisitionsLabel", requisitionsLabel);
    router.push(`${clean}?${qs.toString()}`);
  };

  const onDelete = (row: RequisitionRow) => {
    if (isTutorialActive && isMockRow(row)) {
      showAlert({
        type: "info",
        variant: "filled",
        title: "Acción de demostración",
        description: "Este registro es de ejemplo para el tutorial.",
        showPrimaryButton: true,
        primaryLabel: "Entendido",
        onPrimaryClick: hideAlert,
      });
      return;
    }
    setRowToDelete(row);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    const current = rowToDelete;
    if (!current) return;
    setConfirmOpen(false);

    showSpinner({
      message: "Espera un momento, el documento se está eliminando",
    });
    const ok = await deleteRequisition(current.id);
    hideSpinner();
    setRowToDelete(null);

    if (ok) {
      showAlert({
        type: "warning",
        variant: "filled",
        title: "Requisición eliminada",
        description: `${current.snCode} fue eliminada correctamente.`,
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
        onClose: hideAlert,
      });
    } else {
      showAlert({
        type: "error",
        variant: "filled",
        title: "No se pudo eliminar",
        description: "Intenta de nuevo en unos segundos.",
        showPrimaryButton: true,
        primaryLabel: "Entendido",
        onPrimaryClick: hideAlert,
        showSecondaryButton: true,
        secondaryLabel: "Reintentar",
        onSecondaryClick: () => {
          hideAlert();
          onDelete(current);
        },
      });
    }
  };

  const refresh = (start?: Date, end?: Date) => {
    const startDate = start ? currentDate(start) : lastDates.startDate;
    const endDate = end ? currentDate(end) : lastDates.endDate;
    if (start || end) {
      setLastDates({ startDate, endDate });
    }
    if (isTutorialActive) return;
    fetchRequisitionsWithEmployees(startDate, endDate, true);
  };

  // columns estático si en algún punto deseas moverlo aquí (dejo ejemplo):
  const columns = [] as const;

  return {
    // tabla
    rows,
    query,
    setQuery,
    columns,
    // borrar
    confirmOpen,
    setConfirmOpen,
    rowToDelete,
    removing,
    handleConfirmDelete,
    // acciones
    onEdit,
    onViewFiles,
    onViewRequisitions,
    onDelete,
    refresh,
    hasIdParam,
  };
};
