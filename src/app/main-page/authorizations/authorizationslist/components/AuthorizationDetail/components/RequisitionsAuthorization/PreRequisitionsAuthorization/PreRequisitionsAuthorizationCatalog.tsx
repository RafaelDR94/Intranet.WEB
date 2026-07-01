"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { shallow } from "zustand/shallow";

import { Button } from "@/app/components/Button/Button";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import type {
  FieldModel,
  ResponsiveLayoutMatrix,
} from "@/app/components/DynamicForm/types";
import { Input } from "@/app/components/Input/Input";
import { PopUp } from "@/app/components/PopUp/PopUp";
import SignaturePopUp from "@/app/components/SignaturePopUp/SignaturePopUp";
import type { Authorized } from "@/app/components/SignaturePopUp/types";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import {
  getFirstProgressItemValues,
  mapCalculationConceptsJsonToViaticsRows,
} from "@/app/main-page/accounting/requisitions/requisitionRequest/utilities/requisitionRequestHelpers";
import { EditableViaticsTable } from "@/app/sharedComponents/EditableViaticsTable/EditableViaticsTable";
import { useAuthorizationsStore } from "@/app/stores/useAuthorizationsStore/useAuthorizationsStore";
import { useTravelExpensesStore } from "@/app/stores/useTravelExpensesStore/useTravelExpensesStore";

const toDateInputValue = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toISOString().slice(0, 10);
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const toDisplayString = (value: unknown) =>
  value == null ? "" : String(value).trim();

const getPathValue = (
  record: Record<string, unknown> | undefined,
  path: string,
): unknown => {
  if (!record) return undefined;

  return path.split(".").reduce<unknown>((current, key) => {
    if (!isRecord(current)) return undefined;
    return current[key];
  }, record);
};

const pickString = (
  records: Array<Record<string, unknown> | undefined>,
  paths: string[],
) => {
  for (const record of records) {
    for (const path of paths) {
      const value = toDisplayString(getPathValue(record, path));
      if (value) return value;
    }
  }

  return "";
};

const getNestedRecord = (
  record: Record<string, unknown> | undefined,
  paths: string[],
) => {
  for (const path of paths) {
    const value = getPathValue(record, path);
    if (isRecord(value)) return value;
  }

  return undefined;
};

const getPersonName = (record: Record<string, unknown>) =>
  pickString(
    [record],
    [
      "fullname",
      "fullName",
      "employee_name",
      "employeeName",
      "employeename",
      "name",
    ],
  ) ||
  [record.firstname, record.secondname, record.lastname, record.motherlast_name]
    .map(toDisplayString)
    .filter(Boolean)
    .join(" ");

const getPeopleNames = (value: unknown) =>
  Array.isArray(value)
    ? value
        .map((item) =>
          isRecord(item) ? getPersonName(item) : toDisplayString(item),
        )
        .filter(Boolean)
    : [];

const reviewFormLayout: ResponsiveLayoutMatrix = {
  sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
  md: [
    [2.5, 2.5, 2.5, 2.5],
    [2.38, 2.38, 2.38],
  ],
  lg: [
    [2.5, 2.5, 2.5, 2.5],
    [2.38, 2.38, 2.38],
  ],
};

/**
 * Catalogo manual de la vista de autorizacion de prerequisiciones.
 */
const PreRequisitionsAuthorizationCatalog = () => {
  const searchParams = useSearchParams();
  const authorizationId =
    searchParams.get("authorization_id") || searchParams.get("id") || "";
  const { user } = useAuth();
  const [rejectCommentOpen, setRejectCommentOpen] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [rejectCommentError, setRejectCommentError] = useState<string | null>(
    null,
  );
  const [signatureOpen, setSignatureOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "approve" | "reject" | null
  >(null);

  const {
    authorizations,
    approveAuthorization,
    rejectAuthorization,
    getAuthorizations,
    getAuthorizationsByIdAuthorizer,
    updatingStatus,
  } = useAuthorizationsStore(
    (state) => ({
      authorizations: state.authorizations,
      approveAuthorization: state.approveAuthorization,
      rejectAuthorization: state.rejectAuthorization,
      getAuthorizations: state.getAuthorizations,
      getAuthorizationsByIdAuthorizer: state.getAuthorizationsByIdAuthorizer,
      updatingStatus: state.updatingStatus,
    }),
    shallow,
  );

  const {
    currentRequisitionRequest,
    fetchRequisitionRequestById,
    approvingTravelExpense,
    rejectingTravelExpense,
    loadingRequisitionRequestDetail,
  } = useTravelExpensesStore(
    (state) => ({
      currentRequisitionRequest: state.currentRequisitionRequest,
      fetchRequisitionRequestById: state.fetchRequisitionRequestById,
      approvingTravelExpense: state.approving,
      rejectingTravelExpense: state.rejecting,
      loadingRequisitionRequestDetail: state.loadingRequisitionRequestDetail,
    }),
    shallow,
  );

  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert, hideAlert } = usePrincipalAlert;

  const authorization = useMemo(
    () =>
      authorizationId
        ? authorizations.find(
            (item) => item.authorization_id === authorizationId,
          )
        : undefined,
    [authorizationId, authorizations],
  );

  const idRequisitionRequest =
    searchParams.get("event_id") || authorization?.event_id || "";
  const selectedTravelExpense = currentRequisitionRequest;

  const authorizerId =
    authorization?.authorizer?.employee_id ||
    authorization?.authorizer?.id ||
    "";

  const authorizationRaw = authorization?.raw;
  const requisitionRaw = getNestedRecord(authorizationRaw, [
    "requisition_request",
    "requisitionRequest",
    "requisition",
    "billing_requisition",
    "billingRequisition",
    "travel_expense",
    "travelExpense",
    "event",
  ]);
  const projectRaw = getNestedRecord(authorizationRaw, [
    "project",
    "proyect",
    "requisition_request.project",
    "requisitionRequest.project",
    "travel_expense.project",
    "travelExpense.project",
  ]);
  const enterpriseRaw = getNestedRecord(authorizationRaw, [
    "enterprise",
    "requisition_request.enterprise",
    "requisitionRequest.enterprise",
    "travel_expense.enterprise",
    "travelExpense.enterprise",
  ]);
  const assignedEmployeeRaw = getNestedRecord(authorizationRaw, [
    "employee",
    "assigned_employee",
    "assignedEmployee",
    "requisition_request.employee",
    "requisitionRequest.employee",
    "travel_expense.employee",
    "travelExpense.employee",
  ]);
  const selectedTravelExpenseRecord = selectedTravelExpense
    ? (selectedTravelExpense as unknown as Record<string, unknown>)
    : undefined;
  const progressValues = selectedTravelExpense
    ? getFirstProgressItemValues(selectedTravelExpense)
    : {
        requisitionCode: "",
        startDate: "",
        endDate: "",
        motive: "",
      };
  const detailRecords = [
    selectedTravelExpenseRecord,
    requisitionRaw,
    authorizationRaw,
  ];
  const authorizationDetail = {
    company: pickString(
      [
        selectedTravelExpenseRecord,
        requisitionRaw,
        enterpriseRaw,
        authorizationRaw,
      ],
      [
        "company",
        "enterprise_name",
        "enterpriseName",
        "enterprisename",
        "name",
      ],
    ),
    projectCode: pickString(
      [
        selectedTravelExpenseRecord,
        requisitionRaw,
        projectRaw,
        authorizationRaw,
      ],
      [
        "projectname",
        "project_name",
        "projectName",
        "proyectKey",
        "projectKey",
        "name",
      ],
    ),
    requisition_code:
      progressValues.requisitionCode ||
      pickString(detailRecords, [
        "requisition_code",
        "requisitionCode",
        "requisitionkey",
        "requisitionKey",
      ]),
    state: pickString(detailRecords, ["state", "status_name", "status.name"]),
    motive:
      progressValues.motive ||
      pickString(detailRecords, ["motive", "reason", "comments", "comment"]),
    startDate:
      progressValues.startDate ||
      pickString(detailRecords, [
        "assignmentdate",
        "assignmentDate",
        "startDate",
        "start_date",
      ]),
    endDate:
      progressValues.endDate ||
      pickString(detailRecords, [
        "enddate",
        "endDate",
        "end_date",
        "finishDate",
      ]),
    assignedPerson:
      (assignedEmployeeRaw ? getPersonName(assignedEmployeeRaw) : "") ||
      pickString(detailRecords, [
        "employeename",
        "employee_name",
        "employeeName",
        "assigned_person",
        "assignedPerson",
      ]),
  };
  const collaboratorNames = [
    ...(selectedTravelExpense?.companions ?? [])
      .map((companion) => companion.employee_name)
      .filter(Boolean),
    ...getPeopleNames(getPathValue(requisitionRaw, "companions")),
    ...getPeopleNames(getPathValue(requisitionRaw, "collaborators")),
    ...getPeopleNames(getPathValue(authorizationRaw, "companions")),
    ...getPeopleNames(getPathValue(authorizationRaw, "collaborators")),
  ].filter((name, index, names) => names.indexOf(name) === index);

  useEffect(() => {
    if (!authorizationId) return;
    if (authorization) return;
    if (user?.idEmployee) {
      getAuthorizationsByIdAuthorizer(user.idEmployee, true);
      return;
    }
    getAuthorizations();
  }, [
    authorization,
    authorizationId,
    getAuthorizations,
    getAuthorizationsByIdAuthorizer,
    user?.idEmployee,
  ]);

  useEffect(() => {
    if (!idRequisitionRequest) return;
    fetchRequisitionRequestById(idRequisitionRequest);
  }, [fetchRequisitionRequestById, idRequisitionRequest]);

  const reviewFields = useMemo<FieldModel[]>(
    () =>
      authorizationDetail.company ||
      authorizationDetail.projectCode ||
      authorizationDetail.state ||
      authorizationDetail.motive ||
      authorizationDetail.startDate ||
      authorizationDetail.endDate ||
      authorizationDetail.assignedPerson
        ? [
            {
              type: "input",
              name: "company",
              label: "Empresa",
              value: authorizationDetail.company,
              disabled: true,
            },
            {
              type: "input",
              name: "projectname",
              label: "Codigo de Proyecto",
              value: authorizationDetail.projectCode,
              disabled: true,
            },
            {
              type: "input",
              name: "state",
              label: "Estado",
              value: authorizationDetail.state,
              disabled: true,
            },
            {
              type: "input",
              name: "motive",
              label: "Motivo",
              value: authorizationDetail.motive,
              disabled: true,
            },
            {
              type: "date",
              name: "startDate",
              label: "Fecha Inicio",
              value: toDateInputValue(authorizationDetail.startDate),
              disabled: true,
            },
            {
              type: "date",
              name: "endDate",
              label: "Fecha Termino",
              value: toDateInputValue(authorizationDetail.endDate),
              disabled: true,
            },
            {
              type: "input",
              name: "assignedPerson",
              label: "Personal asignado",
              value: authorizationDetail.assignedPerson,
              disabled: true,
            },
          ]
        : [],
    [
      authorizationDetail.assignedPerson,
      authorizationDetail.company,
      authorizationDetail.endDate,
      authorizationDetail.motive,
      authorizationDetail.projectCode,
      authorizationDetail.startDate,
      authorizationDetail.state,
    ],
  );

  const viaticsRows = useMemo(
    () =>
      selectedTravelExpense
        ? mapCalculationConceptsJsonToViaticsRows(selectedTravelExpense)
        : [],
    [selectedTravelExpense],
  );

  const showMissingAuthorizationAlert = useCallback(() => {
    showAlert({
      type: "error",
      variant: "filled",
      title: "No se puede continuar",
      description: "No se encontro el identificador de la autorizacion.",
      showPrimaryButton: true,
      primaryLabel: "Entendido",
      onPrimaryClick: hideAlert,
    });
  }, [hideAlert, showAlert]);

  const showMissingAuthorizerAlert = useCallback(() => {
    showAlert({
      type: "error",
      variant: "filled",
      title: "No se puede continuar",
      description: "No se encontro el autorizador.",
      showPrimaryButton: true,
      primaryLabel: "Entendido",
      onPrimaryClick: hideAlert,
    });
  }, [hideAlert, showAlert]);

  const handleApprove = useCallback(async () => {
    if (!authorizationId) {
      showMissingAuthorizationAlert();
      return;
    }

    showSpinner({ message: "Aprobando autorizacion..." });
    const success = await approveAuthorization(authorizationId);
    hideSpinner();

    if (success) {
      await getAuthorizations(true);
      if (idRequisitionRequest) {
        await fetchRequisitionRequestById(idRequisitionRequest);
      }
    }

    showAlert({
      type: success ? "success" : "error",
      variant: "filled",
      title: success ? "Autorizacion aprobada" : "No se pudo aprobar",
      description: success
        ? "La autorizacion fue aprobada correctamente."
        : "Ocurrio un error al aprobar la autorizacion.",
      showPrimaryButton: true,
      primaryLabel: "Entendido",
      onPrimaryClick: hideAlert,
    });
  }, [
    approveAuthorization,
    authorizationId,
    fetchRequisitionRequestById,
    getAuthorizations,
    hideAlert,
    hideSpinner,
    showAlert,
    showMissingAuthorizationAlert,
    showSpinner,
    idRequisitionRequest,
  ]);

  const handleStartApproval = useCallback(() => {
    if (!authorizationId) {
      showMissingAuthorizationAlert();
      return;
    }

    if (!authorizerId) {
      showMissingAuthorizerAlert();
      return;
    }

    setPendingAction("approve");
    setSignatureOpen(true);
  }, [
    authorizationId,
    authorizerId,
    showMissingAuthorizationAlert,
    showMissingAuthorizerAlert,
  ]);

  const handleRejectStart = useCallback(() => {
    if (!authorizationId) {
      showMissingAuthorizationAlert();
      return;
    }

    if (!authorizerId) {
      showMissingAuthorizerAlert();
      return;
    }

    setPendingAction("reject");
    setSignatureOpen(true);
  }, [
    authorizationId,
    authorizerId,
    showMissingAuthorizationAlert,
    showMissingAuthorizerAlert,
  ]);

  const handleSignatureAuthorization = useCallback(
    (authorized: Authorized) => {
      if (!authorized?.state) {
        setSignatureOpen(false);
        setPendingAction(null);
        return;
      }

      setSignatureOpen(false);

      if (pendingAction === "approve") {
        void handleApprove();
        setPendingAction(null);
        return;
      }

      if (pendingAction === "reject") {
        setRejectCommentOpen(true);
      }
    },
    [handleApprove, pendingAction],
  );

  const handleRejectCommentCancel = useCallback(() => {
    setRejectCommentOpen(false);
    setRejectComment("");
    setRejectCommentError(null);
    setPendingAction(null);
  }, []);

  const handleRejectCommentChange = useCallback(
    (value: string) => {
      setRejectComment(value);
      if (rejectCommentError) setRejectCommentError(null);
    },
    [rejectCommentError],
  );

  const handleRejectCommentSubmit = useCallback(async () => {
    const trimmed = rejectComment.trim();
    if (!trimmed) {
      setRejectCommentError("Agrega un comentario para continuar.");
      return;
    }

    showSpinner({ message: "Rechazando autorizacion..." });
    const success = await rejectAuthorization(authorizationId, trimmed);
    hideSpinner();

    if (success) {
      await getAuthorizations(true);
      if (idRequisitionRequest) {
        await fetchRequisitionRequestById(idRequisitionRequest);
      }
    }

    showAlert({
      type: success ? "success" : "error",
      variant: "filled",
      title: success ? "Autorizacion rechazada" : "No se pudo rechazar",
      description: success
        ? "La autorizacion fue rechazada correctamente."
        : "Ocurrio un error al rechazar la autorizacion.",
      showPrimaryButton: true,
      primaryLabel: "Entendido",
      onPrimaryClick: hideAlert,
    });

    setRejectCommentOpen(false);
    setRejectComment("");
    setRejectCommentError(null);
    setPendingAction(null);
  }, [
    authorizationId,
    fetchRequisitionRequestById,
    getAuthorizations,
    hideAlert,
    hideSpinner,
    rejectAuthorization,
    rejectComment,
    showAlert,
    showSpinner,
    idRequisitionRequest,
  ]);

  const actionsDisabled =
    reviewFields.length === 0 ||
    approvingTravelExpense ||
    rejectingTravelExpense ||
    updatingStatus;

  return (
    <div className="bg-gray-10 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <h1 className="text-b3 text-blue-60 shrink-0 font-medium">
            Presupuesto de requisicion
            {authorizationDetail.requisition_code
              ? ` ${authorizationDetail.requisition_code}`
              : ""}
          </h1>
          <div className="bg-blue-30 h-px flex-1" />
        </div>
        <div className="flex shrink-0 gap-3">
          <Button
            hideIcon
            type="button"
            variant="outline"
            className="border-alert-red-100 text-alert-red-100 hover:bg-alert-red-10 min-w-[112px]"
            disabled={actionsDisabled}
            onClick={handleRejectStart}
          >
            Rechazar
          </Button>
          <Button
            hideIcon
            type="button"
            className="min-w-[112px]"
            disabled={actionsDisabled}
            onClick={handleStartApproval}
          >
            Aprobar
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-4">
        {reviewFields.length > 0 ? (
          <>
            <section className="bg-white-100 ring-gray-20 rounded-lg p-6 shadow-sm ring-1">
              <DynamicForm
                disabled
                fields={reviewFields}
                onSubmit={() => undefined}
                responsiveLayoutMatrix={reviewFormLayout}
                rowClassName="mb-3 gap-x-5 gap-y-3"
                showSubmitIf={() => false}
                dataTestId="travel-expense-review-form"
              />
              {collaboratorNames.length > 0 ? (
                <p className="text-c2 text-blue-60">
                  Colaboradores incluidos: {collaboratorNames.join(", ")}
                </p>
              ) : null}
            </section>

            <EditableViaticsTable
              readOnly
              value={viaticsRows}
              onChange={() => undefined}
              dataTestId="travel-expense-viatics-table"
            />
          </>
        ) : (
          <p className="text-b3 text-gray-80">
            {loadingRequisitionRequestDetail
              ? "Cargando solicitud de viaticos..."
              : "No se encontro la solicitud seleccionada."}
          </p>
        )}
      </div>

      <SignaturePopUp
        open={signatureOpen}
        onClose={() => {
          setSignatureOpen(false);
          setPendingAction(null);
        }}
        onAuthorization={handleSignatureAuthorization}
        responsibleGuid={authorizerId}
      />

      <PopUp
        open={rejectCommentOpen}
        onClose={handleRejectCommentCancel}
        title="Denegar solicitud"
        content="Esta accion denegara la solicitud. Escribe aqui los motivos de la negativa."
        showSecondaryButton
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={handleRejectCommentCancel}
        showPrimaryButton
        primaryButtonText="Enviar"
        onPrimaryButtonClick={handleRejectCommentSubmit}
      >
        <Input
          as="textarea"
          placeholder="Escribir aqui"
          value={rejectComment}
          onChange={(event) => handleRejectCommentChange(event.target.value)}
          variant={rejectCommentError ? "error" : "default"}
          helperText={rejectCommentError ?? undefined}
          rows={4}
        />
      </PopUp>
    </div>
  );
};

export default PreRequisitionsAuthorizationCatalog;
