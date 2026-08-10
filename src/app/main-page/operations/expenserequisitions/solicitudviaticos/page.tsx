"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import type { FieldModel } from "@/app/components/DynamicForm/types";
import {
  getFirstProgressItemValues,
  mapCalculationConceptsJsonToViaticsRows,
  toDateInputValue,
} from "@/app/main-page/accounting/requisitions/requisitionRequest/utilities/requisitionRequestHelpers";
import { RequisitionEditorView } from "@/app/main-page/operations/expenserequisitions/travelexpenserequest/components/RequisitionEditorView";
import { RequisitionEvidence } from "@/app/sharedComponents/RequisitionEvidence/RequisitionEvidence";
import { EditableViaticsTable } from "@/app/sharedComponents/EditableViaticsTable/EditableViaticsTable";
import { useTravelExpensesStore } from "@/app/stores/useTravelExpensesStore/useTravelExpensesStore";

import { RequisitionRequestsTable } from "./components/RequisitionRequestsTable";
import { useOperationsRequisitionRequests } from "./hooks/useOperationsRequisitionRequests";

const OperationsRequisitionRequestsPage = () => {
  const { error, fetchRequests, loading, rows } =
    useOperationsRequisitionRequests();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const detailId = searchParams.get("id");
  const current = useTravelExpensesStore(
    (state) => state.currentRequisitionRequest,
  );
  const loadingDetail = useTravelExpensesStore(
    (state) => state.loadingRequisitionRequestDetail,
  );
  const fetchById = useTravelExpensesStore(
    (state) => state.fetchRequisitionRequestById,
  );

  useEffect(() => {
    if (detailId) void fetchById(detailId);
  }, [detailId, fetchById]);

  const fields = useMemo<FieldModel[]>(() => {
    if (!current) return [];
    const progress = getFirstProgressItemValues(current);
    return [
      {
        type: "input",
        name: "company",
        label: "Empresa",
        value: current.company,
        disabled: true,
      },
      {
        type: "input",
        name: "project",
        label: "Código de proyecto",
        value: current.proyectkey || current.projectname,
        disabled: true,
      },
      {
        type: "input",
        name: "state",
        label: "Estado",
        value: current.state,
        disabled: true,
      },
      {
        type: "input",
        name: "motive",
        label: "Motivo",
        value: progress.motive || current.motive,
        disabled: true,
      },
      {
        type: "date",
        name: "start",
        label: "Fecha inicio",
        value: toDateInputValue(progress.startDate || current.assignmentdate),
        disabled: true,
      },
      {
        type: "date",
        name: "end",
        label: "Fecha termino",
        value: toDateInputValue(progress.endDate || current.enddate),
        disabled: true,
      },
      {
        type: "input",
        name: "employee",
        label: "Personal asignado",
        value: current.employeename,
        disabled: true,
      },
    ];
  }, [current]);

  const isRejected = (current?.status_name ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .includes("rechaz");

  if (detailId) {
    if (current && isRejected) {
      return (
        <RequisitionEditorView
          requisitionRequestId={detailId}
          travelExpense={current}
          onCompleted={fetchRequests}
        />
      );
    }

    const imageUrls =
      current?.requisition_requests[0]?.image_urls ?? current?.image_urls ?? [];
    return (
      <FormsLayout
        title={`Presupuesto de requisición ${current?.requisitionkey ?? ""}`}
        primaryLabel=""
        showPrimaryButton={false}
        onPrimaryClick={() => undefined}
        enableCollapse={false}
        showBackground={false}
        cardClassName="!block !p-0"
      >
        {current ? (
          <div className="flex flex-col gap-4">
            <RequisitionEvidence
              imageUrls={imageUrls}
              status={current.status_name || "Pendiente"}
              comment={current.comments}
            />
            <section className="bg-white-100 rounded-lg p-6 shadow-sm">
              <DynamicForm
                fields={fields}
                onSubmit={() => undefined}
                showSubmitIf={() => false}
                responsiveLayoutMatrix={{
                  sm: [[10], [10], [10], [10], [10], [10], [10]],
                  md: [
                    [2.5, 2.5, 2.5, 2.5],
                    [3.33, 3.33, 3.34],
                  ],
                  lg: [
                    [2.5, 2.5, 2.5, 2.5],
                    [3.33, 3.33, 3.34],
                  ],
                }}
              />
              <EditableViaticsTable
                value={mapCalculationConceptsJsonToViaticsRows(current)}
                onChange={() => undefined}
                readOnly
                allowAddConcept={false}
              />
            </section>
          </div>
        ) : (
          <p className="p-4">
            {loadingDetail
              ? "Cargando solicitud..."
              : "No se encontró la solicitud."}
          </p>
        )}
      </FormsLayout>
    );
  }

  return (
    <FormsLayout
      title="Estatus Aprobación de requisiciones"
      primaryLabel=""
      showPrimaryButton={false}
      onPrimaryClick={() => undefined}
      showBackground={false}
      cardClassName="!block !p-0"
    >
      {error ? <p className="text-alert-red-100 text-b3 p-4">{error}</p> : null}
      {loading && rows.length === 0 ? (
        <p className="text-gray-80 text-b3 p-4">Cargando solicitudes...</p>
      ) : (
        <RequisitionRequestsTable
          rows={rows}
          onRefresh={() => fetchRequests()}
          onViewDetails={(row) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("id", row.requisition_requests[0]?.id || row.id);
            router.push(`${pathname}?${params.toString()}`);
          }}
        />
      )}
    </FormsLayout>
  );
};

export default OperationsRequisitionRequestsPage;
