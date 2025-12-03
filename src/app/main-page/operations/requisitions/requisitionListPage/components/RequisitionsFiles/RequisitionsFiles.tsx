"use client";
import React, { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { shallow } from "zustand/shallow";

import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import Label from "@/app/components/Label/Label";
import { LabelType } from "@/app/components/Label/types";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
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
  const effectiveUserId = userId ?? searchParams.get("id");
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert, hideAlert } = usePrincipalAlert;

  const {
    requisitions,
    loading,
    error,
    warning,
    fetchRequisitionsByIdEmployee,
    resetFlags,
  } = useRequisitionsStore(
    (state) => ({
      requisitions: state.requisitions,
      loading: state.loading,
      error: state.error,
      warning: state.warning,
      fetchRequisitionsByIdEmployee: state.fetchRequisitionsByIdEmployee,
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

  const statusBadge = (status?: string) => {
    const normalizedStatus = (status || "").toLowerCase();
    let type: LabelType = "pendiente";
    if (normalizedStatus.includes("cierre de periodo")) type = "invalido";
    if (normalizedStatus.includes("viaticando")) type = "purple";
    if (normalizedStatus.includes("folio adicional")) type = "prohibido";
    if (normalizedStatus.includes("cancelada")) type = "restringido";
    if (normalizedStatus.includes("validaci")) type = "valido";

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
    ],
    [],
  );

  if (!effectiveUserId && !forceVisible) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Selecciona un colaborador para ver sus requisiciones.
      </div>
    );
  }

  return (
    <div>
      <DataTable
        showCalendar={false}
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
