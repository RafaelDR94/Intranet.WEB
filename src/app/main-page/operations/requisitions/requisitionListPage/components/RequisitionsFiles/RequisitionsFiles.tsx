"use client";
import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { shallow } from "zustand/shallow";

import ActionMenuCell from "@/app/components/ActionMenuCell/ActionMenuCell";
import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import Label from "@/app/components/Label/Label";
import { LabelType } from "@/app/components/Label/types";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { actionCell } from "@/app/main-page/accounting/requisitions/requisitionsList/componentes/RequisitionsTable/styles";
import { RequisitionRow } from "@/app/main-page/accounting/requisitions/requisitionsList/componentes/RequisitionsTable/types";
import { useRequisitionsStore } from "@/app/stores/useRequisitionStore/useRequisitionStore";

type RequisitionsFilesProps = {
  /**
   * Forces the table to render even if the `id` param is missing.
   * Useful for tests or embedded views.
   */
  forceVisible?: boolean;
  /** Employee identifier to fetch requisitions for. */
  userId?: string | null;
};

const RequisitionsFiles: React.FC<RequisitionsFilesProps> = ({
  forceVisible = false,
  userId,
}) => {
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
      showSpinner({ message: "Cargando requisiciones…" });
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

  const buildLabel = (prefix: string, name?: string | null) => {
    const normalized = name?.trim();
    return normalized ? `${prefix} ${normalized}` : prefix;
  };

  const onViewDetails = (row: RequisitionRow) => {
    const clean = path.endsWith("/") ? path.slice(0, -1) : path;
    const qs = new URLSearchParams(searchParams.toString());
    qs.set("id", row.id);
    if (row.employeeId || effectiveUserId) {
      qs.set("idEmployee", row.employeeId ?? effectiveUserId ?? "");
    }
    qs.set("label", "Detalle Requisición");
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
    showSpinner({ message: "Espera un momento, el documento se está eliminando" });
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

  const statusBadge = (status?: string) => {
    const normalizedStatus = (status || "").toLowerCase();
    let type: LabelType = "pendiente";
    if (normalizedStatus.includes("cierre de periodo")) type = "actualizado";
    if (normalizedStatus.includes("viaticando")) type = "purple";
    if (normalizedStatus.includes("folio adicional")) type = "prohibido";
    if (normalizedStatus.includes("cerrado")) type = "restringido";
    if (normalizedStatus.includes("valid")) type = "valido";
    if (normalizedStatus.includes("rechaz")) type = "rechazado";

    return <Label type={type} text={status || "En espera"} />;
  };

  const columns: ColumnDefinition<RequisitionRow>[] = useMemo(
    () => [
      { key: "debtorName", label: "Nombre" },
      { key: "projectCode", label: "Proyecto" },
      { key: "snCode", label: "Código SN" },
      {
        key: "status",
        label: "Estatus",
        render: (row) => statusBadge(row.status),
      },
      {
        key: "actions" as unknown as keyof RequisitionRow,
        label: "",
        render: (row) => (
          <div className={actionCell}>
            <ActionMenuCell row={row} onEdit={onViewDetails} onDelete={onDelete} />
          </div>
        ),
        invisible: false,
      },
    ],
    [onDelete, onViewDetails],
  );

  if (!effectiveUserId && !forceVisible) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Selecciona un colaborador para ver sus requisiciones.
      </div>
    );
  }

  const filterOptions = [
      { label: "Cancelada", value: "all" },
      { label: "Cierre Periodo", value: "all" },
      { label: "Folio Adicional", value: "all" },
      { label: "Validación", value: "all" },
      { label: "Viaticando", value: "all" },
    ];

  return (
    <div>
      <PopUp
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="¿Deseas eliminar la requisición seleccionada?"
        content={
          rowToDelete
            ? `Esta acción confirmará la eliminación de ${rowToDelete.snCode}.`
            : "Esta acción confirmará la eliminación."
        }
        showSecondaryButton
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={() => setConfirmOpen(false)}
        showPrimaryButton
        primaryButtonText={removing ? "Eliminando…" : "Eliminar"}
        onPrimaryButtonClick={handleConfirmDelete}
      />

      <DataTable
        showCalendar={true}
        showFilter={true}
        showRefresh={true}
        filterOptions={filterOptions}
        textSize={{ mobile: "c2", desktop: "text-c2" }}
        dataTableTitle="Requisiciones"
        tables={[
          {
            data: rows,
            columns,
            title: "Historial",
            enableCollaps: true,
            enableSelection: false,
            defaultSortKey: "date_created",
            defaultSortDirection: "desc",
          },
        ]}
        showDownloadTable={true}
        showButton={false}
        dateKey={"date_created"}
      />
    </div>
  );
};
export default RequisitionsFiles;
