"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/app/components/Button/Button";
import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import type {
  FieldModel,
  ResponsiveLayoutMatrix,
} from "@/app/components/DynamicForm/types";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import { Label } from "@/app/components/Label/Label";
import type { LabelType } from "@/app/components/Label/types";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { TravelExpenseCalculationsMap } from "@/app/mappings/travelExpenseCalculations/travelExpenseCalculations.mapper";
import type { TravelExpense } from "@/app/mappings/travelExpenses/travelExpenses.types";
import { ContextualInfoForm } from "@/app/sharedComponents/ContextualInfoForm/ContextualInfoForm";
import { useTravelExpensesStore } from "@/app/stores/useTravelExpensesStore/useTravelExpensesStore";
import UserPlus from "@/assets/icons/Users/Users/add-user.svg";

type DetailStatusKind = "pending" | "validated" | "rejected";

const formatDate = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const toDateInputValue = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toISOString().slice(0, 10);
};

const toFormString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const toIsoDate = (value: unknown) => {
  const dateValue = toFormString(value);
  if (!dateValue) return "";

  const date = new Date(`${dateValue}T00:00:00`);
  return Number.isNaN(date.getTime()) ? dateValue : date.toISOString();
};

const normalizeStatus = (status: string) =>
  status
    .trim()
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const normalizeStatusType = (status: string): LabelType => {
  const normalized = normalizeStatus(status);

  if (normalized.includes("aprobad") || normalized.includes("valid")) {
    return "validado";
  }

  if (normalized.includes("rechaz")) {
    return "rechazado";
  }

  if (normalized.includes("cancel")) {
    return "restringido";
  }

  if (normalized.includes("borrador")) {
    return "borrador";
  }

  return "pendiente";
};

const getDetailStatusKind = (status: string): DetailStatusKind => {
  const normalized = normalizeStatus(status);

  if (normalized.includes("rechaz")) return "rejected";
  if (normalized.includes("aprobad") || normalized.includes("valid")) {
    return "validated";
  }

  return "pending";
};

const getDetailStatusText = (status: string) => {
  const kind = getDetailStatusKind(status);
  if (kind === "validated") return "Aprobada";
  if (kind === "rejected") return "Rechazado";
  return status || "Pendiente";
};

const detailContextualLayout: ResponsiveLayoutMatrix = {
  sm: [[10], [10], [10]],
  md: [[2.2, 2.2, 2.2]],
  lg: [[2.2, 2.2, 2.2]],
};

const detailFormLayout: ResponsiveLayoutMatrix = {
  sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
  md: [
    [3.05, 3.05, 3.05],
    [3.05, 3.05],
    [3.05, 3.05],
    [3.05, 3.05],
  ],
  lg: [
    [3.05, 3.05, 3.05],
    [3.05, 3.05],
    [3.05, 3.05],
    [3.05, 3.05],
  ],
};

const requestStatusFormLayout: ResponsiveLayoutMatrix = {
  sm: [[10], [10], [10], [10], [10], [10], [10], [10]],
  md: [
    [3.05, 3.05, 3.05],
    [3.05, 3.05],
    [3.05, 3.05, 3.05],
  ],
  lg: [
    [3.05, 3.05, 3.05],
    [3.05, 3.05],
    [3.05, 3.05, 3.05],
  ],
};

const getTravelExpenseIdentifier = (row: TravelExpense) =>
  row.id || row.billingrequisition_id || row.requisitionkey;

const TravelExpenseHistoryPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const selectedId = searchParams.get("id");
  const isEditMode = view === "edit";
  const [editValues, setEditValues] = useState<Record<string, unknown>>({});
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert } = usePrincipalAlert;
  const { hideSpinner, showSpinner } = usePrincipalLoading;
  const travelExpenses = useTravelExpensesStore(
    (state) => state.travelExpenses,
  );
  const fetchTravelExpenses = useTravelExpensesStore(
    (state) => state.fetchTravelExpenses,
  );
  const cancelOrResendTravelExpense = useTravelExpensesStore(
    (state) => state.cancelOrResendTravelExpense,
  );
  const updateTravelExpense = useTravelExpensesStore(
    (state) => state.updateTravelExpense,
  );
  const updatingTravelExpense = useTravelExpensesStore(
    (state) => state.updating,
  );
  const cancelingOrResending = useTravelExpensesStore(
    (state) => state.cancelingOrResending,
  );

  useEffect(() => {
    fetchTravelExpenses(true);
  }, [fetchTravelExpenses]);

  const selectedTravelExpense = useMemo(
    () =>
      selectedId
        ? (travelExpenses.find(
            (item) =>
              getTravelExpenseIdentifier(item) === selectedId ||
              item.id === selectedId ||
              item.billingrequisition_id === selectedId ||
              item.requisitionkey === selectedId,
          ) ?? null)
        : null,
    [selectedId, travelExpenses],
  );

  const handleViewDetails = (row: TravelExpense) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", "detail");
    params.set("id", getTravelExpenseIdentifier(row));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleEditDetails = () => {
    if (!selectedTravelExpense) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("view", "edit");
    params.set("id", getTravelExpenseIdentifier(selectedTravelExpense));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCancelEdit = () => {
    if (!selectedTravelExpense) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("view", "detail");
    params.set("id", getTravelExpenseIdentifier(selectedTravelExpense));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleResendRequest = async () => {
    if (!selectedTravelExpense) return;

    const idTravelExpense = getTravelExpenseIdentifier(selectedTravelExpense);
    if (!idTravelExpense) return;

    showSpinner({ message: "Actualizando solicitud de viáticos..." });
    const calculationConcepts = TravelExpenseCalculationsMap(
      Array.isArray(selectedTravelExpense.travel_expenses_calculations)
        ? selectedTravelExpense.travel_expenses_calculations
        : [],
    ).map((item) => ({
      concept: item.concept,
      national_quoted: Number(item.national_quoted) || 0,
      foreign_quoted: Number(item.foreign_quoted) || 0,
      people_number: Number(item.people) || 0,
      days_number: Number(item.days) || 0,
      subtotal: Number(item.subtotal) || 0,
      observations: item.observations,
    }));
    const updated = await updateTravelExpense({
      id: idTravelExpense,
      employee_id:
        toFormString(editValues.assignedPerson) ||
        selectedTravelExpense.employee_id,
      companions: selectedTravelExpense.companions.map((companion) => ({
        employee_id: companion.id_employee,
        full_name: companion.employee_name,
      })),
      calculation_concepts: calculationConcepts,
      project_id:
        toFormString(editValues.project) || selectedTravelExpense.project_id,
      department_id: selectedTravelExpense.department_id,
      enterprise_id: selectedTravelExpense.enterprise_id,
      assignmentdate: toIsoDate(
        editValues.startDate || selectedTravelExpense.assignmentdate,
      ),
      enddate: toIsoDate(editValues.endDate || selectedTravelExpense.enddate),
      state: toFormString(editValues.state) || selectedTravelExpense.state,
      motive: toFormString(editValues.motive) || selectedTravelExpense.motive,
    });

    if (!updated) {
      hideSpinner();
      showAlert({
        type: "error",
        title: "No se pudo actualizar",
        description:
          useTravelExpensesStore.getState().error ||
          "Hubo un problema al actualizar la solicitud de viáticos.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2500,
      });
      return;
    }

    showSpinner({ message: "Reenviando solicitud de viáticos..." });
    const success = await cancelOrResendTravelExpense(
      idTravelExpense,
      "resend",
    );
    hideSpinner();

    if (!success) {
      showAlert({
        type: "error",
        title: "No se pudo reenviar",
        description:
          useTravelExpensesStore.getState().error ||
          "Hubo un problema al reenviar la solicitud de viáticos.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2500,
      });
      return;
    }

    showAlert({
      type: "success",
      title: "Solicitud reenviada",
      description: "La solicitud de viáticos fue reenviada correctamente.",
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 1800,
    });
    handleCancelEdit();
  };

  const handleCancelRequest = async () => {
    if (!selectedTravelExpense) return;

    const idTravelExpense = getTravelExpenseIdentifier(selectedTravelExpense);
    if (!idTravelExpense) return;

    showSpinner({ message: "Cancelando solicitud de viáticos..." });
    const success = await cancelOrResendTravelExpense(
      idTravelExpense,
      "cancel",
    );
    hideSpinner();

    if (!success) {
      showAlert({
        type: "error",
        title: "No se pudo cancelar",
        description:
          useTravelExpensesStore.getState().error ||
          "Hubo un problema al cancelar la solicitud de viáticos.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2500,
      });
      return;
    }

    showAlert({
      type: "success",
      title: "Solicitud cancelada",
      description: "La solicitud de viáticos fue cancelada correctamente.",
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 1800,
    });
    router.push(pathname);
  };

  const columns = useMemo<ColumnDefinition<TravelExpense>[]>(
    () => [
      {
        key: "employeename",
        label: "NOMBRE",
        headerClass: "flex-[1.35]",
        cellClass: "flex-[1.35] text-gray-80",
      },
      {
        key: "projectname",
        label: "PROYECTO",
        headerClass: "flex-[1.05]",
        cellClass: "flex-[1.05] text-gray-80",
      },
      {
        key: "state",
        label: "ESTADO",
        headerClass: "flex-[1.05]",
        cellClass: "flex-[1.05] text-gray-80",
      },
      {
        key: "assignmentdate",
        label: "FECHA INICIO",
        render: (row) => formatDate(row.assignmentdate),
        headerClass: "flex-[0.9]",
        cellClass: "flex-[0.9] text-gray-80",
      },
      {
        key: "enddate",
        label: "FECHA TERMINO",
        render: (row) => formatDate(row.enddate),
        headerClass: "flex-[0.9]",
        cellClass: "flex-[0.9] text-gray-80",
      },
      {
        key: "status_employee_name",
        label: "ESTATUS",
        render: (row) => (
          <Label
            type={normalizeStatusType(row.status_employee_name || row.status)}
            text={row.status_employee_name || row.status || "Pendiente"}
            className="min-w-[82px]"
          />
        ),
        headerClass: "flex-[0.9]",
        cellClass: "flex-[0.9]",
      },
      {
        key: "billingrequisition_id",
        label: "",
        sortable: false,
        showSortIndicator: false,
        render: (row) => (
          <Button
            size="xsmall"
            variant="ghost"
            hideIcon
            type="button"
            onClick={() => handleViewDetails(row)}
          >
            Ver más
          </Button>
        ),
        headerClass: "flex-[0.65]",
        cellClass: "flex-[0.65] justify-end",
      },
    ],
    [handleViewDetails],
  );

  const detailFields = useMemo<FieldModel[]>(
    () =>
      selectedTravelExpense
        ? [
            {
              type: "date",
              name: "requestDate",
              label: "Fecha de solicitud",
              value: toDateInputValue(selectedTravelExpense.date_created),
              disabled: !isEditMode,
            },
            {
              type: "input",
              name: "requester",
              label: "Solicitante",
              value: selectedTravelExpense.employeename,
              disabled: !isEditMode,
            },
            {
              type: "input",
              name: "area",
              label: "Área",
              value: selectedTravelExpense.area,
              disabled: !isEditMode,
            },
            {
              type: "select",
              name: "assignedPerson",
              label: "Personal asignado",
              value: selectedTravelExpense.employee_id,
              options: [
                {
                  label: selectedTravelExpense.employeename,
                  value: selectedTravelExpense.employee_id,
                },
              ],
              disabled: !isEditMode,
            },
            {
              type: "input",
              name: "phone",
              label: "Teléfono",
              value: selectedTravelExpense.phone_number,
              disabled: !isEditMode,
            },
            {
              type: "date",
              name: "startDate",
              label: "Fecha Inicio",
              value: toDateInputValue(selectedTravelExpense.assignmentdate),
              disabled: !isEditMode,
            },
            {
              type: "date",
              name: "endDate",
              label: "Fecha Termino",
              value: toDateInputValue(selectedTravelExpense.enddate),
              disabled: !isEditMode,
            },
            {
              type: "select",
              name: "state",
              label: "Estado",
              value: selectedTravelExpense.state,
              options: [
                {
                  label: selectedTravelExpense.state,
                  value: selectedTravelExpense.state,
                },
              ],
              disabled: !isEditMode,
            },
            {
              type: "input",
              name: "motive",
              label: "Motivo",
              value: selectedTravelExpense.motive,
              disabled: !isEditMode,
            },
          ]
        : [],
    [isEditMode, selectedTravelExpense],
  );

  const requestStatusFields = useMemo<FieldModel[]>(
    () =>
      selectedTravelExpense
        ? [
            {
              type: "date",
              name: "startDate",
              label: "Fecha Inicio",
              value: toDateInputValue(selectedTravelExpense.assignmentdate),
              disabled: !isEditMode,
            },
            {
              type: "date",
              name: "endDate",
              label: "Fecha Termino",
              value: toDateInputValue(selectedTravelExpense.enddate),
              disabled: !isEditMode,
            },
            {
              type: "select",
              name: "project",
              label: "Proyecto",
              value: selectedTravelExpense.project_id,
              options: [
                {
                  label: selectedTravelExpense.projectname,
                  value: selectedTravelExpense.project_id,
                },
              ],
              disabled: !isEditMode,
            },
            {
              type: "select",
              name: "state",
              label: "Estado",
              value: selectedTravelExpense.state,
              options: [
                {
                  label: selectedTravelExpense.state,
                  value: selectedTravelExpense.state,
                },
              ],
              disabled: !isEditMode,
            },
            {
              type: "input",
              name: "motive",
              label: "Motivo",
              value: selectedTravelExpense.motive,
              disabled: !isEditMode,
            },
            {
              type: "select",
              name: "assignedPerson",
              label: "Personal asignado",
              value: selectedTravelExpense.employee_id,
              options: [
                {
                  label: selectedTravelExpense.employeename,
                  value: selectedTravelExpense.employee_id,
                },
              ],
              disabled: !isEditMode,
            },
            {
              type: "input",
              name: "phone",
              label: "Teléfono",
              value: selectedTravelExpense.phone_number,
              disabled: !isEditMode,
            },
          ]
        : [],
    [isEditMode, selectedTravelExpense],
  );

  if (selectedTravelExpense) {
    const detailStatusKind = getDetailStatusKind(selectedTravelExpense.status);
    const detailStatusType = normalizeStatusType(selectedTravelExpense.status);
    const showValidatedDetail = detailStatusKind === "validated";
    const showRejectedDetail = detailStatusKind === "rejected";

    return (
      <section className="bg-gray-10 w-full py-4">
        <div className="flex w-full flex-col gap-3">
          <FormsLayout
            title={
              isEditMode
                ? "Editar solicitud de requisiciones"
                : "Estatus requisición solicitada"
            }
            primaryLabel={
              isEditMode
                ? updatingTravelExpense || cancelingOrResending
                  ? "Reenviando..."
                  : "Reenviar solicitud"
                : "Editar solicitud"
            }
            showPrimaryButton={showRejectedDetail || isEditMode}
            primaryDisabled={updatingTravelExpense || cancelingOrResending}
            onPrimaryClick={
              isEditMode ? handleResendRequest : handleEditDetails
            }
            showSecondaryButton={showRejectedDetail || isEditMode}
            secondaryLabel={
              isEditMode ? "Cancelar edición" : "Cancelar solicitud"
            }
            secondaryDisabled={updatingTravelExpense || cancelingOrResending}
            onSecondaryClick={
              isEditMode ? handleCancelEdit : handleCancelRequest
            }
            cardClassName="!block !p-0"
            showBackground={false}
          >
            <div
              className={`bg-white-100 flex min-h-9 items-center rounded-lg px-4 py-2 shadow-sm ${
                showRejectedDetail ? "justify-between gap-4" : "justify-end"
              }`}
            >
              {showRejectedDetail && (
                <p className="text-c2 text-gray-80">
                  {selectedTravelExpense.comments ||
                    "No se registró comentario de rechazo."}
                </p>
              )}
              <Label
                type={detailStatusType}
                text={getDetailStatusText(selectedTravelExpense.status)}
                className="min-w-[82px]"
              />
            </div>

            {showValidatedDetail ? (
              <>
                <ContextualInfoForm
                  variant="travelExpenseDetail"
                  values={{
                    projectCode: selectedTravelExpense.projectname,
                    company: selectedTravelExpense.company,
                    requisitionCode: selectedTravelExpense.requisitionkey,
                  }}
                  variants={{
                    travelExpenseDetail: {
                      fields: [
                        { id: "projectCode", label: "Código de proyecto" },
                        { id: "company", label: "Empresa" },
                        {
                          id: "requisitionCode",
                          label: "Código de requisición",
                        },
                      ],
                    },
                  }}
                  contextualInfoLayout={detailContextualLayout}
                  dataTestId="travel-expense-detail-context"
                />

                <section className="bg-white-100 ring-gray-20 mt-5 rounded-lg p-6 shadow-sm ring-1">
                  <h2 className="text-b3 text-blue-60 mb-4 font-medium">
                    Información de requisición
                  </h2>
                  <DynamicForm
                    disabled={!isEditMode}
                    fields={detailFields}
                    onSubmit={() => undefined}
                    onValuesChange={setEditValues}
                    responsiveLayoutMatrix={detailFormLayout}
                    rowClassName="mb-4 gap-x-5 gap-y-4"
                    showSubmitIf={() => false}
                    dataTestId="travel-expense-detail-form"
                  />
                </section>
              </>
            ) : (
              <section className="bg-white-100 ring-gray-20 rounded-lg p-6 shadow-sm ring-1">
                <DynamicForm
                  disabled={!isEditMode}
                  fields={requestStatusFields}
                  onSubmit={() => undefined}
                  onValuesChange={setEditValues}
                  responsiveLayoutMatrix={requestStatusFormLayout}
                  rowClassName="mb-4 gap-x-5 gap-y-4"
                  showSubmitIf={() => false}
                  dataTestId="travel-expense-status-form"
                >
                  <Button
                    disabled={!isEditMode}
                    icon={UserPlus}
                    type="button"
                    variant="ghost"
                  >
                    Agregar acompañante
                  </Button>
                </DynamicForm>
              </section>
            )}
          </FormsLayout>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-10 w-full py-4">
      <div className="flex w-full flex-col gap-5">
        <FormsLayout
          title="Historial solicitud de viáticos"
          primaryLabel=""
          showPrimaryButton={false}
          cardClassName="!block !p-0"
          showBackground={false}
        >
          <DataTable<TravelExpense>
            showButton={false}
            showCalendar
            showRefresh
            onRefreshPage={() => fetchTravelExpenses(true)}
            enableInternalSearch
            searchableKeys={[
              "employeename",
              "projectname",
              "state",
              "status",
              "requisitionkey",
            ]}
            dateKey="assignmentdate"
            rowsPerPage={12}
            dataTableTitle="Historial solicitud de viáticos"
            tables={[
              {
                title: "Historial solicitud de viáticos",
                hidetitle: true,
                hideHeader: true,
                data: travelExpenses,
                columns,
                enableSelection: false,
                enableCollaps: false,
                defaultSortKey: "assignmentdate",
                defaultSortDirection: "desc",
                textSize: {
                  desktop: "b3",
                  tablet: "c2",
                  mobile: "c2",
                },
              },
            ]}
          />
        </FormsLayout>
      </div>
    </section>
  );
};

export default TravelExpenseHistoryPage;
