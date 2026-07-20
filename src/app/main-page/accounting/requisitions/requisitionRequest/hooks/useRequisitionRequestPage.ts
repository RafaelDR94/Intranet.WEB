import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type {
  FieldModel,
  ResponsiveLayoutMatrix,
} from "@/app/components/DynamicForm/types";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { statesList } from "@/app/main-page/accounting/requisitions/components/RequisitionsForm/utilities/statesList";
import type { TravelExpense } from "@/app/mappings/travelExpenses/travelExpenses.types";
import type { EditableViaticsRow } from "@/app/sharedComponents/EditableViaticsTable/types";
import { useDepartmentsStore } from "@/app/stores/useDepartmentsStore/useDepartmentsStore";
import { useEnterprisesStore } from "@/app/stores/useEnterprisesStore/useEnterprisesStore";
import { useProyectsStore } from "@/app/stores/useProyectsStore/useProyectsStore";
import { useTravelExpensesStore } from "@/app/stores/useTravelExpensesStore/useTravelExpensesStore";
import { useUsersStore } from "@/app/stores/useUsersStore/useUsersStore";

import type { RequisitionSection, TravelExpenseBeneficiary } from "../types";
import {
  buildSaveProgressPayload,
  cloneEmptyViaticsRows,
  getFirstProgressItemValues,
  getTravelExpenseArea,
  getTravelExpenseBeneficiaryItems,
  getTravelExpenseIdentifier,
  isDraftStatus,
  mapCalculationConceptsJsonToViaticsRows,
  toDateInputValue,
  toFormString,
  toIsoDate,
} from "../utilities/requisitionRequestHelpers";

const reviewFormLayout: ResponsiveLayoutMatrix = {
  sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
  md: [
    [3, 3, 3, 3],
    [2.38, 2.38, 2.37],
  ],
  lg: [
    [3, 3, 3, 3],
    [2.38, 2.38, 2.37],
  ],
};

const createFormBaseLayout: ResponsiveLayoutMatrix = {
  sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10], [10], [10]],
  md: [
    [3.05, 3.05, 3.05],
    [3.05, 3.05, 3.05],
    [3.05, 3.05],
    [3.05, 3.05, 3.05],
  ],
  lg: [
    [3.05, 3.05, 3.05],
    [3.05, 3.05, 3.05],
    [3.05, 3.05],
    [3.05, 3.05, 3.05],
  ],
};

/**
 * Encapsulates RequisitionRequestPage state, store wiring and form handlers.
 */
export const useRequisitionRequestPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const selectedId = searchParams.get("id");
  const [assignedStaffRows, setAssignedStaffRows] = useState(1);
  const [valuesVersion, setValuesVersion] = useState(0);
  const [formReady, setFormReady] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [requisitionValues, setRequisitionValues] = useState<
    Record<string, unknown>
  >({});
  const [viaticsRows, setViaticsRows] = useState<EditableViaticsRow[]>(
    cloneEmptyViaticsRows,
  );
  const [beneficiaryViaticsRows, setBeneficiaryViaticsRows] = useState<
    Record<string, EditableViaticsRow[]>
  >({});
  const [activeBeneficiaryId, setActiveBeneficiaryId] = useState("");
  const [requisitionSection, setRequisitionSection] =
    useState<RequisitionSection>("information");
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [rejectCommentOpen, setRejectCommentOpen] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [rejectCommentError, setRejectCommentError] = useState<string | null>(
    null,
  );
  const { user } = useAuth();
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert } = usePrincipalAlert;
  const { hideSpinner, showSpinner } = usePrincipalLoading;

  const travelExpenses = useTravelExpensesStore(
    (state) => state.travelExpenses,
  );
  const currentRequisitionRequest = useTravelExpensesStore(
    (state) => state.currentRequisitionRequest,
  );
  const fetchRequisitionRequests = useTravelExpensesStore(
    (state) => state.fetchRequisitionRequests,
  );
  const fetchRequisitionRequestById = useTravelExpensesStore(
    (state) => state.fetchRequisitionRequestById,
  );
  const approveRequisitionRequestThroughAccounting = useTravelExpensesStore(
    (state) => state.approveRequisitionRequestThroughAccounting,
  );
  const rejectRequisitionRequestThroughAccounting = useTravelExpensesStore(
    (state) => state.rejectRequisitionRequestThroughAccounting,
  );
  const createTravelExpense = useTravelExpensesStore(
    (state) => state.createTravelExpense,
  );
  const saveTravelExpenseProgress = useTravelExpensesStore(
    (state) => state.saveTravelExpenseProgress,
  );
  const sendRequisitionRequestAuthorization = useTravelExpensesStore(
    (state) => state.sendRequisitionRequestAuthorization,
  );
  const approvingTravelExpense = useTravelExpensesStore(
    (state) => state.approving,
  );
  const rejectingTravelExpense = useTravelExpensesStore(
    (state) => state.rejecting,
  );
  const creatingTravelExpense = useTravelExpensesStore(
    (state) => state.creating,
  );
  const updatingTravelExpense = useTravelExpensesStore(
    (state) => state.updating,
  );
  const savingProgress = useTravelExpensesStore(
    (state) => state.savingProgress,
  );
  const sendingAuthorization = useTravelExpensesStore(
    (state) => state.sendingAuthorization,
  );
  const savingCalculations = useTravelExpensesStore(
    (state) => state.savingCalculations,
  );
  const loadingTravelExpenses = useTravelExpensesStore(
    (state) => state.loading,
  );
  const loadingRequisitionRequestDetail = useTravelExpensesStore(
    (state) => state.loadingRequisitionRequestDetail,
  );
  const enterprises = useEnterprisesStore((state) => state.enterprises);
  const fetchEnterprises = useEnterprisesStore(
    (state) => state.fetchEnterprises,
  );
  const departments = useDepartmentsStore((state) => state.departments);
  const departmentsLoading = useDepartmentsStore((state) => state.loading);
  const fetchDepartments = useDepartmentsStore(
    (state) => state.fetchDepartments,
  );
  const employeesWithActiveUser = useUsersStore(
    (state) => state.employeesWithActiveUser,
  );
  const employeesWithActiveUserLoading = useUsersStore(
    (state) => state.loadingWithActiveUser,
  );
  const fetchEmployeesWithActiveUser = useUsersStore(
    (state) => state.fetchEmployeesWithActiveUser,
  );
  const proyects = useProyectsStore((state) => state.proyects);
  const proyectsLoading = useProyectsStore((state) => state.loading);
  const fetchProyects = useProyectsStore((state) => state.fetchProyects);

  useEffect(() => {
    fetchRequisitionRequests(true);
    fetchEnterprises();
    fetchDepartments();
    fetchEmployeesWithActiveUser(true);
    fetchProyects();
  }, [
    fetchDepartments,
    fetchEmployeesWithActiveUser,
    fetchEnterprises,
    fetchProyects,
    fetchRequisitionRequests,
  ]);

  useEffect(() => {
    if (view !== "detail" || !selectedId) return;
    fetchRequisitionRequestById(selectedId);
  }, [fetchRequisitionRequestById, selectedId, view]);

  const selectedTravelExpense = currentRequisitionRequest;

  const requisitionBeneficiaries = useMemo(
    () =>
      selectedTravelExpense
        ? getTravelExpenseBeneficiaryItems(selectedTravelExpense)
        : [],
    [selectedTravelExpense],
  );
  const hasCompanions = requisitionBeneficiaries.length > 1;

  useEffect(() => {
    if (!selectedTravelExpense) {
      setActiveBeneficiaryId("");
      setViaticsRows(cloneEmptyViaticsRows());
      setBeneficiaryViaticsRows({});
      return;
    }

    const beneficiaries = getTravelExpenseBeneficiaryItems(
      selectedTravelExpense,
    );
    setActiveBeneficiaryId((currentId) =>
      beneficiaries.some((beneficiary) => beneficiary.id === currentId)
        ? currentId
        : beneficiaries[0]?.id || "",
    );
    setRequisitionSection("information");
    setViaticsRows(cloneEmptyViaticsRows());
    setBeneficiaryViaticsRows({});
  }, [selectedTravelExpense]);

  const handleViewDetails = (row: TravelExpense) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", "detail");
    params.set("id", getTravelExpenseIdentifier(row));
    params.set("label", "Solicitud de viaticos");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCreateClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", "create");
    params.set("label", "Crear solicitud");
    params.delete("id");
    router.push(`${pathname}?${params.toString()}`);
  };

  const reviewFields = useMemo<FieldModel[]>(() => {
    if (!selectedTravelExpense) return [];

    const progressValues = getFirstProgressItemValues(selectedTravelExpense);

    return [
      {
        type: "input",
        name: "company",
        label: "Empresa",
        value: selectedTravelExpense.company,
        disabled: true,
      },
      {
        type: "input",
        name: "proyectkey",
        label: "Codigo de Proyecto",
        value: selectedTravelExpense.proyectkey,
        disabled: true,
      },
      {
        type: "input",
        name: "debtorcode",
        label: "Codigo de deudor",
        value:
          progressValues.requisitionCode ||
          selectedTravelExpense.requisitionkey,
        disabled: true,
      },
      {
        type: "input",
        name: "phone_number",
        label: "Telefono",
        value: selectedTravelExpense.phone_number,
        disabled: true,
      },
      {
        type: "date",
        name: "startDate",
        label: "Fecha Inicio",
        value:
          toDateInputValue(progressValues.startDate) ||
          toDateInputValue(selectedTravelExpense.assignmentdate),
        disabled: true,
      },
      {
        type: "date",
        name: "endDate",
        label: "Fecha Termino",
        value:
          toDateInputValue(progressValues.endDate) ||
          toDateInputValue(selectedTravelExpense.enddate),
        disabled: true,
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
        disabled: true,
      },
    ];
  }, [selectedTravelExpense]);

  const requisitionSummaryFields = useMemo<FieldModel[]>(
    () =>
      selectedTravelExpense
        ? [
            {
              type: "input",
              name: "projectCode",
              label: "Codigo de proyecto",
              value: selectedTravelExpense.projectname,
              disabled: true,
            },
            {
              type: "input",
              name: "enterprise",
              label: "Empresa",
              value:
                selectedTravelExpense.enterprise_name ||
                selectedTravelExpense.company,
              disabled: true,
            },
            {
              type: "input",
              name: "state",
              label: "Estado",
              value: selectedTravelExpense.state,
              disabled: true,
            },
          ]
        : [],
    [selectedTravelExpense],
  );

  const buildRequisitionFields = (
    beneficiary?: TravelExpenseBeneficiary,
  ): FieldModel[] => {
    if (!selectedTravelExpense) return [];

    const currentBeneficiary = beneficiary ?? {
      id: selectedTravelExpense.employee_id,
      name: selectedTravelExpense.employeename,
      phone: selectedTravelExpense.phone_number,
      cardNumber: selectedTravelExpense.card_number,
    };

    return [
      {
        type: "date",
        name: "requestDate",
        label: "Fecha de solicitud",
        value: toDateInputValue(selectedTravelExpense.date_created),
        disabled: true,
      },
      {
        type: "input",
        name: "requester",
        label: "Solicitante",
        value:
          selectedTravelExpense.applicant_name ||
          selectedTravelExpense.created_by,
        disabled: true,
      },
      {
        type: "input",
        name: "area",
        label: "Area",
        value: getTravelExpenseArea(selectedTravelExpense),
        disabled: true,
      },
      {
        type: "select",
        name: `assignedPerson-${currentBeneficiary.id}`,
        label: "Personal asignado",
        value: currentBeneficiary.id,
        options: [
          {
            label: currentBeneficiary.name,
            value: currentBeneficiary.id,
          },
        ],
        disabled: true,
      },
      {
        type: "input",
        name: `phone-${currentBeneficiary.id}`,
        label: "Telefono",
        value: currentBeneficiary.phone,
        disabled: true,
      },
      {
        type: "input",
        name: `cardNumber-${currentBeneficiary.id}`,
        label: "Numero de tarjeta",
        value: currentBeneficiary.cardNumber,
        disabled: true,
      },
      {
        type: "input",
        name: "requisitionCode",
        label: "Codigo de requisicion",
        placeholder: "Escribe el codigo de la requisicion",
        value:
          (requisitionValues.requisitionCode as FieldModel["value"]) ??
          selectedTravelExpense.requisition_requests[0]?.requisition_code ??
          "",
      },
      {
        type: "date",
        name: "startDate",
        label: "Fecha Inicio",
        value:
          (requisitionValues.startDate as FieldModel["value"]) ??
          toDateInputValue(selectedTravelExpense.assignmentdate),
      },
      {
        type: "date",
        name: "endDate",
        label: "Fecha Termino",
        value:
          (requisitionValues.endDate as FieldModel["value"]) ??
          toDateInputValue(selectedTravelExpense.enddate),
      },
      {
        type: "input",
        name: "motive",
        label: "Motivo",
        value:
          (requisitionValues.motive as FieldModel["value"]) ??
          selectedTravelExpense.motive,
      },
    ];
  };

  const requisitionFields = buildRequisitionFields(requisitionBeneficiaries[0]);
  const detailViaticsRows = useMemo(
    () =>
      selectedTravelExpense
        ? mapCalculationConceptsJsonToViaticsRows(selectedTravelExpense)
        : [],
    [selectedTravelExpense],
  );
  const enterpriseOptions = useMemo(
    () =>
      enterprises.map((enterprise) => ({
        label: enterprise.name,
        value: enterprise.enterprise_id,
      })),
    [enterprises],
  );
  const departmentOptions = useMemo(
    () =>
      departments.map((department) => ({
        label: department.name,
        value: department.department_id,
      })),
    [departments],
  );
  const employeeOptions = useMemo(
    () =>
      employeesWithActiveUser.map((employee) => ({
        label: employee.fullname,
        value: employee.employee_id,
      })),
    [employeesWithActiveUser],
  );
  const projectOptions = useMemo(
    () =>
      proyects.map((project) => ({
        label: project.proyectKey,
        value: project.id,
      })),
    [proyects],
  );

  const assignedStaffFields = useMemo<FieldModel[]>(
    () =>
      Array.from({ length: assignedStaffRows }, (_, index) => {
        const suffix = index === 0 ? "" : String(index + 1);
        const assignedStaffName = `assignedStaff${suffix}`;
        const phoneName = `phone${suffix}`;
        const cardNumberName = `cardNumber${suffix}`;
        const isStaffSelected = Boolean(formValues[assignedStaffName]);

        return [
          {
            type: "select",
            name: assignedStaffName,
            label: "Personal asignado",
            placeholder: "Selecciona un empleado",
            value: (formValues[assignedStaffName] ?? "") as FieldModel["value"],
            options: employeeOptions,
            validations: [{ type: "required" }],
          },
          {
            type: "input",
            name: phoneName,
            label: "Telefono",
            placeholder: "Telefono del personal asignado",
            value: (formValues[phoneName] ?? "") as FieldModel["value"],
            disabled: !isStaffSelected,
          },
          {
            type: "input",
            name: cardNumberName,
            label: "Numero de tarjeta",
            placeholder: "000 -",
            value: (formValues[cardNumberName] ?? "") as FieldModel["value"],
            disabled: !isStaffSelected,
          },
        ] satisfies FieldModel[];
      }).flat(),
    [assignedStaffRows, employeeOptions, formValues],
  );

  const createFields = useMemo<FieldModel[]>(
    () => [
      {
        type: "select",
        name: "enterprise",
        label: "Empresa",
        placeholder: "Selecciona una opcion",
        value: (formValues.enterprise ?? "") as FieldModel["value"],
        options: enterpriseOptions,
        validations: [{ type: "required" }],
      },
      {
        type: "select",
        name: "area",
        label: "Area",
        placeholder: "Selecciona una opcion",
        value: (formValues.area ?? "") as FieldModel["value"],
        options: departmentOptions,
        validations: [{ type: "required" }],
      },
      {
        type: "select",
        name: "responsible",
        label: "Responsable",
        placeholder: "Selecciona una opcion",
        value: (formValues.responsible ?? "") as FieldModel["value"],
        options: employeeOptions,
        validations: [{ type: "required" }],
      },
      {
        type: "select",
        name: "project",
        label: "Proyecto",
        placeholder: "Selecciona un proyecto",
        value: (formValues.project ?? "") as FieldModel["value"],
        options: projectOptions,
        validations: [{ type: "required" }],
      },
      {
        type: "date",
        name: "startDate",
        label: "Fecha Inicio",
        placeholder: "00/00/0000",
        value: (formValues.startDate ?? "") as FieldModel["value"],
        validations: [{ type: "required" }],
      },
      {
        type: "date",
        name: "endDate",
        label: "Fecha Termino",
        placeholder: "00/00/0000",
        value: (formValues.endDate ?? "") as FieldModel["value"],
        validations: [{ type: "required" }],
      },
      {
        type: "select",
        name: "state",
        label: "Estado",
        placeholder: "Selecciona una opcion",
        value: (formValues.state ?? "") as FieldModel["value"],
        options: statesList,
        validations: [{ type: "required" }],
      },
      {
        type: "input",
        name: "motive",
        label: "Motivo",
        placeholder: "Escribe el motivo de la solicitud",
        value: (formValues.motive ?? "") as FieldModel["value"],
        validations: [{ type: "required" }],
      },
      ...assignedStaffFields,
    ],
    [
      assignedStaffFields,
      departmentOptions,
      employeeOptions,
      enterpriseOptions,
      formValues,
      projectOptions,
    ],
  );

  const createFormLayout = useMemo<ResponsiveLayoutMatrix>(
    () => ({
      ...createFormBaseLayout,
      sm: [
        [10],
        [10],
        [10],
        [10],
        [10],
        [10],
        [10],
        [10],
        ...Array.from({ length: assignedStaffRows * 3 }, () => [10]),
      ],
      md: [
        [3.05, 3.05, 3.05],
        [3.05, 3.05, 3.05],
        [3.05, 3.05],
        ...Array.from({ length: assignedStaffRows }, () => [3.05, 3.05, 3.05]),
      ],
      lg: [
        [3.05, 3.05, 3.05],
        [3.05, 3.05, 3.05],
        [3.05, 3.05],
        ...Array.from({ length: assignedStaffRows }, () => [3.05, 3.05, 3.05]),
      ],
    }),
    [assignedStaffRows],
  );

  const handleAddAssignedStaff = () => {
    setAssignedStaffRows((currentRows) => currentRows + 1);
    setValuesVersion((currentVersion) => currentVersion + 1);
  };

  const handleCreateValuesChange = (values: Record<string, unknown>) => {
    setFormValues((currentValues) => {
      const nextValues = { ...currentValues, ...values };

      Array.from({ length: assignedStaffRows }, (_, index) => {
        const suffix = index === 0 ? "" : String(index + 1);
        const assignedStaffName = `assignedStaff${suffix}`;
        const phoneName = `phone${suffix}`;
        const selectedEmployeeId = toFormString(nextValues[assignedStaffName]);
        const selectedEmployee = employeesWithActiveUser.find(
          (employee) => employee.employee_id === selectedEmployeeId,
        );
        const selectedPhone = toFormString(
          selectedEmployee?.phone_number || selectedEmployee?.employee_phone,
        );

        if (!selectedEmployeeId) return;
        if (selectedPhone) nextValues[phoneName] = selectedPhone;
        else nextValues[phoneName] = nextValues[phoneName] ?? "";
      });

      return nextValues;
    });
  };

  const getSelectedTravelExpenseId = () =>
    selectedTravelExpense
      ? selectedTravelExpense.id ||
        getTravelExpenseIdentifier(selectedTravelExpense)
      : "";

  const getSelectedRequisitionRequestId = () =>
    selectedTravelExpense?.id ||
    selectedTravelExpense?.requisition_requests[0]?.id ||
    "";

  const showTravelExpenseActionError = (title: string) => {
    showAlert({
      type: "error",
      title,
      description:
        useTravelExpensesStore.getState().error ||
        "Hubo un problema al procesar la solicitud de viaticos.",
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 2500,
    });
  };

  const getBeneficiaryViaticsRows = (beneficiaryId: string) =>
    beneficiaryViaticsRows[beneficiaryId] ?? cloneEmptyViaticsRows();

  const handleApproveTravelExpense = async () => {
    const idRequisitionRequest = getSelectedRequisitionRequestId();
    if (!idRequisitionRequest) return;

    showSpinner({
      message: "Espera un momento, tu accion esta siendo procesada",
    });
    const success =
      await approveRequisitionRequestThroughAccounting(idRequisitionRequest);
    hideSpinner();

    if (!success) {
      showTravelExpenseActionError("No se pudo aceptar");
      return;
    }

    await fetchRequisitionRequestById(idRequisitionRequest);
    showAlert({
      type: "success",
      title: "Solicitud aprobada",
      description: "La solicitud de viaticos fue aprobada correctamente.",
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 1800,
    });
  };

  const handleSaveRequisitionProgress = async () => {
    if (!selectedTravelExpense) return;

    const idTravelExpense = getSelectedTravelExpenseId();
    if (!idTravelExpense) return;

    showSpinner({ message: "Guardando avance de la requisicion..." });
    const progressRows = hasCompanions
      ? requisitionBeneficiaries.flatMap((beneficiary) =>
          getBeneficiaryViaticsRows(beneficiary.id),
        )
      : viaticsRows;
    const updated = await saveTravelExpenseProgress(
      buildSaveProgressPayload(selectedTravelExpense, progressRows),
    );
    hideSpinner();

    if (!updated) {
      showAlert({
        type: "error",
        title: "No se pudo guardar",
        description:
          useTravelExpensesStore.getState().error ||
          "Hubo un problema al guardar el avance de la requisicion.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2500,
      });
      return;
    }

    showAlert({
      type: "success",
      title: "Avance guardado",
      description: "El avance de la requisicion fue guardado correctamente.",
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 1800,
    });
  };

  const handleSendRequisitionAuthorization = async () => {
    const idRequisitionRequest =
      selectedTravelExpense?.requisition_requests[0]?.id;

    if (!idRequisitionRequest) {
      showAlert({
        type: "error",
        title: "No se pudo enviar",
        description:
          "No se encontro el identificador de la requisicion solicitada.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2500,
      });
      return;
    }

    showSpinner({ message: "Enviando requisicion a autorizacion..." });
    const progressRows = hasCompanions
      ? requisitionBeneficiaries.flatMap((beneficiary) =>
          getBeneficiaryViaticsRows(beneficiary.id),
        )
      : viaticsRows;
    const progressSaved = await saveTravelExpenseProgress(
      buildSaveProgressPayload(selectedTravelExpense, progressRows),
    );

    if (!progressSaved) {
      hideSpinner();
      return;
    }

    const success =
      await sendRequisitionRequestAuthorization(idRequisitionRequest);
    hideSpinner();

    if (!success) {
      showAlert({
        type: "error",
        title: "No se pudo enviar",
        description:
          useTravelExpensesStore.getState().error ||
          "Hubo un problema al enviar la requisicion a autorizacion.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2500,
      });
      return;
    }

    showAlert({
      type: "success",
      title: "Enviada a autorizacion",
      description: "La requisicion fue enviada a autorizacion correctamente.",
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 1800,
    });
  };

  const handleRejectCommentChange = (value: string) => {
    setRejectComment(value);
    if (value.trim()) setRejectCommentError(null);
  };

  const handleRejectCommentOpen = () => {
    setRejectCommentOpen(true);
  };

  const handleRejectCommentCancel = () => {
    setRejectCommentOpen(false);
    setRejectComment("");
    setRejectCommentError(null);
  };

  const handleRejectTravelExpense = async () => {
    const idRequisitionRequest = getSelectedRequisitionRequestId();
    const comment = rejectComment.trim();

    if (!comment) {
      setRejectCommentError(
        "Ingresa un comentario para rechazar la solicitud.",
      );
      return;
    }

    if (!idRequisitionRequest) return;

    showSpinner({ message: "Rechazando solicitud de viaticos..." });
    const success = await rejectRequisitionRequestThroughAccounting({
      idRequisitionRequest,
      comment,
    });
    hideSpinner();

    if (!success) {
      showTravelExpenseActionError("No se pudo rechazar");
      return;
    }

    await fetchRequisitionRequestById(idRequisitionRequest);
    handleRejectCommentCancel();
    showAlert({
      type: "success",
      title: "Solicitud rechazada",
      description: "La solicitud de viaticos fue rechazada correctamente.",
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 1800,
    });
  };

  const handleCreateSubmit = async (values: Record<string, unknown>) => {
    const applicantId = toFormString(user?.idEmployee);
    const employeeIds = Array.from(
      { length: assignedStaffRows },
      (_, index) => {
        const suffix = index === 0 ? "" : String(index + 1);
        return toFormString(values[`assignedStaff${suffix}`]);
      },
    ).filter(
      (employeeId, index, employeeList) =>
        Boolean(employeeId) && employeeList.indexOf(employeeId) === index,
    );

    if (!applicantId) {
      showAlert({
        type: "error",
        title: "No se pudo crear",
        description: "No se encontro el empleado solicitante.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2500,
      });
      return;
    }

    if (employeeIds.length === 0) {
      showAlert({
        type: "error",
        title: "No se pudo crear",
        description: "Selecciona al menos un empleado asignado.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2500,
      });
      return;
    }

    const [employeeId, ...companionIds] = employeeIds;
    const companions = companionIds.map((id) => {
      const employee = employeesWithActiveUser.find(
        (item) => item.employee_id === id,
      );

      return {
        employee_id: id,
        full_name: employee?.fullname || "",
      };
    });

    showSpinner({ message: "Creando solicitud de viaticos..." });
    const created = await createTravelExpense({
      applicant_id: applicantId,
      employee_id: employeeId,
      companions,
      project_id: toFormString(values.project),
      department_id: toFormString(values.area),
      enterprise_id: toFormString(values.enterprise),
      assignmentdate: toIsoDate(values.startDate),
      enddate: toIsoDate(values.endDate),
      state: toFormString(values.state),
      motive: toFormString(values.motive),
    });
    hideSpinner();

    if (!created) {
      showAlert({
        type: "error",
        title: "No se pudo crear",
        description:
          useTravelExpensesStore.getState().error ||
          "Hubo un problema al crear la solicitud de viaticos.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2500,
      });
      return;
    }

    setAssignedStaffRows(1);
    setFormValues({});
    setFormReady(false);
    setValuesVersion((currentVersion) => currentVersion + 1);
    showAlert({
      type: "success",
      title: "Solicitud creada",
      description: "La solicitud de viaticos fue creada correctamente.",
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 1800,
    });
    router.push(pathname);
  };

  const isDraftDetail =
    view === "detail" &&
    selectedTravelExpense &&
    isDraftStatus(selectedTravelExpense.status);
  const requestActionsDisabled =
    !selectedTravelExpense ||
    selectedTravelExpense.is_approved_by_accounting ||
    approvingTravelExpense ||
    rejectingTravelExpense;

  return {
    activeBeneficiaryId,
    approvingTravelExpense,
    assignedStaffRows,
    createFields,
    createFormLayout,
    creatingTravelExpense,
    departmentsLoading,
    employeesWithActiveUserLoading,
    excelFile,
    fetchRequisitionRequests,
    formReady,
    formValues,
    handleAddAssignedStaff,
    handleApproveTravelExpense,
    handleCreateClick,
    handleCreateSubmit,
    handleCreateValuesChange,
    handleRejectCommentCancel,
    handleRejectCommentChange,
    handleRejectCommentOpen,
    handleRejectTravelExpense,
    handleSaveRequisitionProgress,
    handleSendRequisitionAuthorization,
    handleViewDetails,
    isDraftDetail,
    loadingTravelExpenses:
      loadingTravelExpenses || loadingRequisitionRequestDetail,
    proyectsLoading,
    rejectComment,
    rejectCommentError,
    rejectCommentOpen,
    rejectingTravelExpense,
    requestActionsDisabled,
    requisitionBeneficiaries,
    requisitionFields,
    requisitionSection,
    requisitionSummaryFields,
    reviewFields,
    reviewFormLayout,
    detailViaticsRows,
    savingCalculations: savingCalculations || savingProgress,
    selectedTravelExpense,
    sendingAuthorization,
    setActiveBeneficiaryId,
    setExcelFile,
    setFormReady,
    setRequisitionSection,
    setRequisitionValues,
    setViaticsRows,
    travelExpenses,
    updatingTravelExpense: updatingTravelExpense || savingProgress,
    valuesVersion,
    viaticsRows,
    view,
  };
};
