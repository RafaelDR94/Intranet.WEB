"use client";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { shallow } from "zustand/shallow";

import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { RequisitionRow } from "@/app/main-page/accounting/requisitions/requisitionsList/componentes/RequisitionsTable/types";
import { useRequisitionsStore } from "@/app/stores/useRequisitionStore/useRequisitionStore";

export type UseRequisitionsFilesOptions = {
  forceVisible?: boolean;
  userId?: string | null;
};

const buildLabel = (prefix: string, name?: string | null) => {
  const normalized = name?.trim();
  return normalized ? `${prefix} ${normalized}` : prefix;
};

const useRequisitionsFiles = ({ forceVisible = false, userId }: UseRequisitionsFilesOptions) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const effectiveUserId =
    userId ?? searchParams.get("idEmployee") ?? searchParams.get("id");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<RequisitionRow | null>(null);
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert, hideAlert } = usePrincipalAlert;

  const {
    requisitions,
    loading,
    error,
    warning,
    removing,
    fetchRequisitionsByIdEmployee,
    deleteRequisition,
    resetFlags,
  } = useRequisitionsStore(
    (state) => ({
      requisitions: state.requisitions,
      loading: state.loading,
      error: state.error,
      warning: state.warning,
      removing: state.removing,
      fetchRequisitionsByIdEmployee: state.fetchRequisitionsByIdEmployee,
      deleteRequisition: state.deleteRequisition,
      resetFlags: state.resetFlags,
    }),
    shallow,
  );

  useEffect(() => {
    if (!effectiveUserId) return;
    fetchRequisitionsByIdEmployee(effectiveUserId, true);
  }, [effectiveUserId, fetchRequisitionsByIdEmployee]);

  useEffect(() => {
    if (loading) {
      showSpinner({ message: "Cargando requisiciones..." });
      return;
    }

    hideSpinner();

    if (warning) {
      showAlert({
        type: "warning",
        variant: "filled",
        title: "Sin requisiciones",
        description: warning,
        showPrimaryButton: true,
        primaryLabel: "Entendido",
        onPrimaryClick: hideAlert,
        showSecondaryButton: true,
        secondaryLabel: "Reintentar",
        onSecondaryClick: () => {
          hideAlert();
          if (effectiveUserId) fetchRequisitionsByIdEmployee(effectiveUserId, true);
        },
      });
      resetFlags();
      return;
    }

    if (error) {
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
          if (effectiveUserId) fetchRequisitionsByIdEmployee(effectiveUserId, true);
        },
      });
      resetFlags();
    }
  }, [
    effectiveUserId,
    error,
    fetchRequisitionsByIdEmployee,
    hideAlert,
    hideSpinner,
    loading,
    resetFlags,
    showAlert,
    showSpinner,
    warning,
  ]);

  const rows: RequisitionRow[] = useMemo(
    () =>
      requisitions.map((requisition) => ({
        id: requisition.billingrequisition_id,
        employeeId: requisition.id_Employee,
        snCode: requisition.requisitionkey,
        debtorName: requisition.employeename,
        projectCode: requisition.projectname,
        assignmentDate: requisition.assignmentdate,
        dueDate: requisition.endDate,
        amount: Number(requisition.amountdeposited),
        status: requisition.status,
        state: requisition.state,
        date_created: requisition.date_created,
      })),
    [requisitions],
  );

  const onViewDetails = (row: RequisitionRow) => {
    const clean = path.endsWith("/") ? path.slice(0, -1) : path;
    const qs = new URLSearchParams(searchParams.toString());
    qs.set("id", row.id);
    if (row.employeeId || effectiveUserId) {
      qs.set("idEmployee", row.employeeId ?? effectiveUserId ?? "");
    }
    qs.set("label", "Detalle Requisici�n");
    qs.set("view", "detail");
    qs.set("requisitionsLabel", buildLabel("Requisiciones", row.debtorName));

    router.push(`${clean}?${qs.toString()}`);
  };

  const onDelete = (row: RequisitionRow) => {
    setRowToDelete(row);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    const current = rowToDelete;
    if (!current || !effectiveUserId) {
      setConfirmOpen(false);
      return;
    }

    setConfirmOpen(false);
    showSpinner({ message: "Espera un momento, el documento se est� eliminando" });
    const ok = await deleteRequisition(current.id);
    hideSpinner();
    setRowToDelete(null);

    if (ok) {
      showAlert({
        type: "warning",
        variant: "filled",
        title: "Requisici�n eliminada",
        description: `${current.snCode} fue eliminada correctamente.`,
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
        onClose: hideAlert,
      });
      fetchRequisitionsByIdEmployee(effectiveUserId, true);
      return;
    }

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
  };

  const filterOptions = [
    { label: "Cancelada", value: "all" },
    { label: "Cierre Periodo", value: "all" },
    { label: "Folio Adicional", value: "all" },
    { label: "Validaci�n", value: "all" },
    { label: "Viaticando", value: "all" },
  ];

  const shouldShowEmptyState = !effectiveUserId && !forceVisible;

  return {
    rows,
    filterOptions,
    effectiveUserId,
    confirmOpen,
    setConfirmOpen,
    rowToDelete,
    removing,
    handleConfirmDelete,
    onViewDetails,
    onDelete,
    shouldShowEmptyState,
  };
};

export default useRequisitionsFiles;
