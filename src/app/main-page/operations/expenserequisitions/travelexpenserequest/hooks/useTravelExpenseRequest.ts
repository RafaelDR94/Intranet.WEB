import CancelIcon from "@/assets/icons/acciones/cancel.svg";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import type {
  FieldModel,
  ResponsiveLayoutMatrix,
} from "@/app/components/DynamicForm/types";
import type { SelectOption } from "@/app/components/Select/types";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { statesList } from "@/app/main-page/accounting/requisitions/components/RequisitionsForm/utilities/statesList";
import type { TravelExpense } from "@/app/mappings/travelExpenses/travelExpenses.types";
import type { UserEmployeeSummary } from "@/app/mappings/users/user.types";
import type { EditableViaticsRow } from "@/app/sharedComponents/EditableViaticsTable/types";
import { useDepartmentsStore } from "@/app/stores/useDepartmentsStore/useDepartmentsStore";
import { useEmployeesStore } from "@/app/stores/useEmployeesStore/useEmployeesStore";
import { useEnterprisesStore } from "@/app/stores/useEnterprisesStore/useEnterprisesStore";
import { useProyectsStore } from "@/app/stores/useProyectsStore/useProyectsStore";
import type { TravelExpenseEmployeeWithCardNumber } from "@/app/stores/useTravelExpensesStore/types";
import { useTravelExpensesStore } from "@/app/stores/useTravelExpensesStore/useTravelExpensesStore";
import { useUsersStore } from "@/app/stores/useUsersStore/useUsersStore";

import type {
  BeneficiaryAssociationMap,
  RequisitionProgressValuesByBeneficiary,
  RequisitionSection,
  TravelExpenseBeneficiary,
} from "../types";
import {
  applyBeneficiaryAssociationSelection,
  buildSaveProgressPayload,
  cloneEmptyViaticsRows,
  getDefaultRequisitionProgressValues,
  getBeneficiaryAssociationsFromProgress,
  getAvailableCompanionOptions,
  getDetailStatusKind,
  getRequisitionProgressValuesFromProgress,
  getNewTravelExpenseRequests,
  getStatusTravelExpenseRequests,
  getTravelExpenseArea,
  getTravelExpenseBeneficiaryItems,
  getTravelExpenseIdentifier,
  getVisibleTravelExpenseBeneficiaries,
  getViaticsRowsByBeneficiaryFromProgress,
  isBlockedRequisitionActionStatus,
  isNoIniciadaTravelExpenseStatus,
  isDraftStatus,
  normalizeStatusType,
  sanitizeBeneficiaryAssociations,
  toDateInputValue,
  toFormString,
  toIsoDate,
} from "../utilities/travelExpenseRequestHelpers";

const reviewFormLayout: ResponsiveLayoutMatrix = {
  sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
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

const requisitionFormLayout: ResponsiveLayoutMatrix = {
  sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10], [10], [10]],
  md: [
    [3.05, 3.05, 3.05],
    [3.05, 3.05, 3.05],
    [3.05, 3.05, 3.05],
    [6.25, 3.05],
  ],
  lg: [
    [3.05, 3.05, 3.05],
    [3.05, 3.05, 3.05],
    [3.05, 3.05, 3.05],
    [6.25, 3.05],
  ],
};

const requisitionSummaryLayout: ResponsiveLayoutMatrix = {
  sm: [[10], [10], [10]],
  md: [[3.05, 3.05, 3.05]],
  lg: [[3.05, 3.05, 3.05]],
};

/**
 * Encapsulates TravelExpenseRequest store wiring, state and event handlers.
 */
export const useTravelExpenseRequest = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const selectedId = searchParams.get("id");
  const submitRef = useRef<(() => void | Promise<unknown>) | null>(null);
  const [formReady, setFormReady] = useState(false);
  const [assignedStaffRows, setAssignedStaffRows] = useState(1);
  const [valuesVersion, setValuesVersion] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [requisitionValuesByBeneficiary, setRequisitionValuesByBeneficiary] =
    useState<RequisitionProgressValuesByBeneficiary>({});
  const [viaticsRows, setViaticsRows] = useState<EditableViaticsRow[]>(
    cloneEmptyViaticsRows,
  );
  const [beneficiaryViaticsRows, setBeneficiaryViaticsRows] = useState<
    Record<string, EditableViaticsRow[]>
  >({});
  const [beneficiaryAssociations, setBeneficiaryAssociations] =
    useState<BeneficiaryAssociationMap>({});
  const [activeBeneficiaryId, setActiveBeneficiaryId] = useState("");
  const [requisitionSection, setRequisitionSection] =
    useState<RequisitionSection>("information");
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [rejectCommentOpen, setRejectCommentOpen] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [rejectCommentError, setRejectCommentError] = useState<string | null>(
    null,
  );
  const [authorizerPopUpOpen, setAuthorizerPopUpOpen] = useState(false);
  const [authorizerSelected, setAuthorizerSelected] = useState("");
  const [authorizerError, setAuthorizerError] = useState<string | null>(null);
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert } = usePrincipalAlert;
  const { hideSpinner, showSpinner } = usePrincipalLoading;
  const travelExpenses = useTravelExpensesStore(
    (state) => state.travelExpenses,
  );
  const fetchTravelExpenses = useTravelExpensesStore(
    (state) => state.fetchTravelExpenses,
  );
  const employeesWithCardNumber = useTravelExpensesStore(
    (state) => state.employeesWithCardNumber,
  );
  const loadingEmployeesWithCardNumber = useTravelExpensesStore(
    (state) => state.loadingEmployeesWithCardNumber,
  );
  const fetchEmployeesWithCardNumber = useTravelExpensesStore(
    (state) => state.fetchEmployeesWithCardNumber,
  );
  const approveTravelExpense = useTravelExpensesStore(
    (state) => state.approveTravelExpense,
  );
  const rejectTravelExpense = useTravelExpensesStore(
    (state) => state.rejectTravelExpense,
  );
  const createTravelExpense = useTravelExpensesStore(
    (state) => state.createTravelExpense,
  );
  const saveTravelExpenseProgress = useTravelExpensesStore(
    (state) => state.saveTravelExpenseProgress,
  );
  const sendTravelExpenseAuthorization = useTravelExpensesStore(
    (state) => state.sendTravelExpenseAuthorization,
  );
  const employees = useEmployeesStore((state) => state.employees);
  const employeesError = useEmployeesStore((state) => state.error);
  const fetchEmployees = useEmployeesStore((state) => state.fetchEmployees);
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
  const updateEmployeeNumberCard = useUsersStore(
    (state) => state.updateEmployeeNumberCard,
  );
  const proyects = useProyectsStore((state) => state.proyects);
  const proyectsLoading = useProyectsStore((state) => state.loading);
  const fetchProyects = useProyectsStore((state) => state.fetchProyects);

  useEffect(() => {
    fetchTravelExpenses();
    fetchEmployeesWithCardNumber();
    fetchEnterprises();
    fetchDepartments();
    fetchEmployeesWithActiveUser(true);
    fetchProyects();
    fetchEmployees();
  }, [
    fetchDepartments,
    fetchEmployeesWithCardNumber,
    fetchEmployeesWithActiveUser,
    fetchEmployees,
    fetchEnterprises,
    fetchProyects,
    fetchTravelExpenses,
  ]);

  useEffect(() => {
    if (!employeesError) return;

    showAlert({
      type: "error",
      title: "No se pudo cargar la lista de autorizadores",
      description: String(employeesError) || "Intenta refrescar.",
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 2500,
    });
  }, [employeesError, showAlert]);

  const selectedTravelExpense = useMemo(
    () =>
      selectedId
        ? travelExpenses.find(
            (item) =>
              getTravelExpenseIdentifier(item) === selectedId ||
              item.billingrequisition_id === selectedId ||
              item.id === selectedId ||
              item.requisitionkey === selectedId,
          )
        : undefined,
    [selectedId, travelExpenses],
  );
  const newTravelExpenses = useMemo(
    () => getNewTravelExpenseRequests(travelExpenses),
    [travelExpenses],
  );
  const statusTravelExpenses = useMemo(
    () => getStatusTravelExpenseRequests(travelExpenses),
    [travelExpenses],
  );
  const authorizerOptions = useMemo<SelectOption[]>(
    () =>
      (employees ?? []).map((employee) => ({
        label: employee.fullname,
        value: employee.employee_id,
      })),
    [employees],
  );

  useEffect(() => {
    if (authorizerSelected) return;
    if (!authorizerOptions.length) return;
    setAuthorizerSelected(authorizerOptions[0].value);
  }, [authorizerOptions, authorizerSelected]);

  useEffect(() => {
    if (authorizerSelected && authorizerError) {
      setAuthorizerError(null);
    }
  }, [authorizerError, authorizerSelected]);

  const requisitionBeneficiaries = useMemo(
    () =>
      selectedTravelExpense
        ? getTravelExpenseBeneficiaryItems(selectedTravelExpense)
        : [],
    [selectedTravelExpense],
  );
  const hasCompanions = requisitionBeneficiaries.length > 1;
  const normalizedBeneficiaryAssociations = useMemo(
    () =>
      sanitizeBeneficiaryAssociations(
        requisitionBeneficiaries,
        beneficiaryAssociations,
      ),
    [beneficiaryAssociations, requisitionBeneficiaries],
  );
  const visibleRequisitionBeneficiaries = useMemo(
    () =>
      getVisibleTravelExpenseBeneficiaries(
        requisitionBeneficiaries,
        normalizedBeneficiaryAssociations,
      ),
    [normalizedBeneficiaryAssociations, requisitionBeneficiaries],
  );

  useEffect(() => {
    if (!selectedTravelExpense) {
      setBeneficiaryAssociations({});
      setActiveBeneficiaryId("");
      setRequisitionValuesByBeneficiary({});
      setViaticsRows(cloneEmptyViaticsRows());
      setBeneficiaryViaticsRows({});
      return;
    }

    const beneficiaries = getTravelExpenseBeneficiaryItems(
      selectedTravelExpense,
    );
    const progressAssociations = getBeneficiaryAssociationsFromProgress(
      selectedTravelExpense,
      beneficiaries,
    );
    const progressValues = getRequisitionProgressValuesFromProgress(
      selectedTravelExpense,
    );
    const progressRows = getViaticsRowsByBeneficiaryFromProgress(
      selectedTravelExpense,
    );
    const primaryBeneficiaryId =
      beneficiaries[0]?.id || selectedTravelExpense.employee_id;

    setActiveBeneficiaryId((currentId) =>
      beneficiaries.some((beneficiary) => beneficiary.id === currentId)
        ? currentId
        : beneficiaries[0]?.id || "",
    );
    setBeneficiaryAssociations(progressAssociations);
    setRequisitionValuesByBeneficiary(progressValues);
    setRequisitionSection("information");
    setViaticsRows(
      progressRows[primaryBeneficiaryId] ?? cloneEmptyViaticsRows(),
    );
    setBeneficiaryViaticsRows(progressRows);
  }, [selectedTravelExpense]);

  useEffect(() => {
    setBeneficiaryAssociations((currentAssociations) =>
      sanitizeBeneficiaryAssociations(
        requisitionBeneficiaries,
        currentAssociations,
      ),
    );
  }, [requisitionBeneficiaries]);

  useEffect(() => {
    setActiveBeneficiaryId((currentId) =>
      visibleRequisitionBeneficiaries.some(
        (beneficiary) => beneficiary.id === currentId,
      )
        ? currentId
        : visibleRequisitionBeneficiaries[0]?.id || "",
    );
  }, [visibleRequisitionBeneficiaries]);

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

  const reviewFields = useMemo<FieldModel[]>(
    () =>
      selectedTravelExpense
        ? [
            {
              type: "input",
              name: "requester",
              label: "Solicitante",
              value:
                selectedTravelExpense.applicant_name ||
                selectedTravelExpense.created_by ||
                selectedTravelExpense.employeename,
              disabled: true,
            },
            {
              type: "input",
              name: "area",
              label: "Area",
              value: selectedTravelExpense.area,
              disabled: true,
            },
            {
              type: "date",
              name: "requestDate",
              label: "Fecha de solicitud",
              value: toDateInputValue(selectedTravelExpense.date_created),
              disabled: true,
            },
            {
              type: "date",
              name: "startDate",
              label: "Fecha Inicio",
              value: toDateInputValue(selectedTravelExpense.assignmentdate),
              disabled: true,
            },
            {
              type: "date",
              name: "endDate",
              label: "Fecha Termino",
              value: toDateInputValue(selectedTravelExpense.enddate),
              disabled: true,
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
              disabled: true,
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
              disabled: true,
            },
            {
              type: "input",
              name: "motive",
              label: "Motivo",
              value: selectedTravelExpense.motive,
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
            {
              type: "input",
              name: "phone",
              label: "Telefono",
              value: selectedTravelExpense.phone_number,
              disabled: true,
            },
          ]
        : [],
    [selectedTravelExpense],
  );

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

    const associationFieldName = `associatedCompanions-${currentBeneficiary.id}`;
    const associationOptions = getAvailableCompanionOptions(
      requisitionBeneficiaries,
      normalizedBeneficiaryAssociations,
      currentBeneficiary.id,
    );
    const associatedCompanionIds =
      normalizedBeneficiaryAssociations[currentBeneficiary.id] ?? [];
    const beneficiaryValues =
      requisitionValuesByBeneficiary[currentBeneficiary.id] ??
      getDefaultRequisitionProgressValues(
        selectedTravelExpense,
        currentBeneficiary.id,
      );

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
        name: `requisitionCode-${currentBeneficiary.id}`,
        label: "Codigo de requisicion",
        placeholder: "Escribe el codigo de la requisicion",
        value: beneficiaryValues.requisitionCode,
      },
      {
        type: "date",
        name: `startDate-${currentBeneficiary.id}`,
        label: "Fecha Inicio",
        value: beneficiaryValues.startDate,
      },
      {
        type: "date",
        name: `endDate-${currentBeneficiary.id}`,
        label: "Fecha Termino",
        value: beneficiaryValues.endDate,
      },
      {
        type: "input",
        name: `motive-${currentBeneficiary.id}`,
        label: "Motivo",
        value: beneficiaryValues.motive,
      },
      ...(hasCompanions &&
      (associationOptions.length > 0 || associatedCompanionIds.length > 0)
        ? [
            {
              type: "multiSelect" as const,
              name: associationFieldName,
              label: "Asociar colaborador",
              placeholder: "Selecciona colaboradores",
              value: associatedCompanionIds,
              options: associationOptions,
              onChange: (value: unknown) =>
                handleAssociatedCompanionsChange(
                  currentBeneficiary.id,
                  Array.isArray(value)
                    ? value.filter(
                        (item): item is string => typeof item === "string",
                      )
                    : [],
                ),
            },
          ]
        : []),
    ];
  };

  const requisitionFields = buildRequisitionFields(requisitionBeneficiaries[0]);
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
  const employeeWithCardNumberOptions = useMemo(
    () =>
      employeesWithCardNumber.map((employee) => ({
        label: employee.full_name,
        value: employee.employee_id,
      })),
    [employeesWithCardNumber],
  );
  const projectOptions = useMemo(
    () =>
      proyects.map((project) => ({
        label: project.proyectKey,
        value: project.id,
      })),
    [proyects],
  );
  const handleRemoveAssignedStaff = (rowIndex: number) => {
    if (rowIndex === 0) return;

    setFormValues((currentValues) => {
      const nextValues = { ...currentValues };

      Array.from({ length: assignedStaffRows }, (_, index) => {
        const suffix = index === 0 ? "" : String(index + 1);
        delete nextValues[`assignedStaff${suffix}`];
        delete nextValues[`phone${suffix}`];
        delete nextValues[`cardNumber${suffix}`];
      });

      let nextIndex = 0;

      Array.from({ length: assignedStaffRows }, (_, index) => {
        if (index === rowIndex) return;

        const currentSuffix = index === 0 ? "" : String(index + 1);
        const nextSuffix = nextIndex === 0 ? "" : String(nextIndex + 1);

        nextValues[`assignedStaff${nextSuffix}`] =
          currentValues[`assignedStaff${currentSuffix}`] ?? "";
        nextValues[`phone${nextSuffix}`] =
          currentValues[`phone${currentSuffix}`] ?? "";
        nextValues[`cardNumber${nextSuffix}`] =
          currentValues[`cardNumber${currentSuffix}`] ?? "";
        nextIndex += 1;
      });

      return nextValues;
    });
    setAssignedStaffRows((currentRows) => Math.max(1, currentRows - 1));
    setValuesVersion((currentVersion) => currentVersion + 1);
  };

  const assignedStaffFields = useMemo<FieldModel[]>(
    () =>
      Array.from({ length: assignedStaffRows }, (_, index) => {
        const suffix = index === 0 ? "" : String(index + 1);
        const assignedStaffName = `assignedStaff${suffix}`;
        const phoneName = `phone${suffix}`;
        const cardNumberName = `cardNumber${suffix}`;
        const isStaffSelected = Boolean(formValues[assignedStaffName]);
        const options =
          index === 0 ? employeeWithCardNumberOptions : employeeOptions;

        return [
          {
            type: "select",
            name: assignedStaffName,
            label: "Personal asignado",
            placeholder: "Selecciona un empleado",
            value: (formValues[assignedStaffName] ?? "") as FieldModel["value"],
            options,
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
            icon: index > 0 ? CancelIcon : undefined,
            onIconClick:
              index > 0 ? () => handleRemoveAssignedStaff(index) : undefined,
          },
        ] satisfies FieldModel[];
      }).flat(),
    [
      assignedStaffRows,
      employeeOptions,
      employeeWithCardNumberOptions,
      formValues,
    ],
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
    let shouldRefreshFormValues = false;

    setFormValues((currentValues) => {
      const nextValues = { ...currentValues, ...values };

      Array.from({ length: assignedStaffRows }, (_, index) => {
        const suffix = index === 0 ? "" : String(index + 1);
        const assignedStaffName = `assignedStaff${suffix}`;
        const phoneName = `phone${suffix}`;
        const cardNumberName = `cardNumber${suffix}`;
        const selectedEmployeeId = toFormString(nextValues[assignedStaffName]);
        const previousEmployeeId = toFormString(
          currentValues[assignedStaffName],
        );
        const selectedEmployee =
          index === 0
            ? employeesWithCardNumber.find(
                (employee) => employee.employee_id === selectedEmployeeId,
              )
            : employeesWithActiveUser.find(
                (employee) => employee.employee_id === selectedEmployeeId,
              );
        const selectedPhone = getEmployeePhone(selectedEmployee);
        const selectedCardNumber = getEmployeeCardNumber(selectedEmployee);

        if (!selectedEmployeeId) {
          if (nextValues[phoneName] || nextValues[cardNumberName]) {
            shouldRefreshFormValues = true;
          }
          nextValues[phoneName] = "";
          nextValues[cardNumberName] = "";
          return;
        }

        if (selectedEmployeeId === previousEmployeeId) return;

        if (selectedPhone && nextValues[phoneName] !== selectedPhone) {
          nextValues[phoneName] = selectedPhone;
          shouldRefreshFormValues = true;
        } else {
          nextValues[phoneName] = nextValues[phoneName] ?? "";
        }

        if (
          selectedCardNumber &&
          nextValues[cardNumberName] !== selectedCardNumber
        ) {
          nextValues[cardNumberName] = selectedCardNumber;
          shouldRefreshFormValues = true;
        } else {
          nextValues[cardNumberName] = nextValues[cardNumberName] ?? "";
        }
      });

      return nextValues;
    });

    if (shouldRefreshFormValues) {
      setValuesVersion((currentVersion) => currentVersion + 1);
    }
  };
  const getSelectedTravelExpenseId = () =>
    selectedTravelExpense
      ? selectedTravelExpense.id ||
        getTravelExpenseIdentifier(selectedTravelExpense)
      : "";
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
  const getAssociatedPeopleCount = (beneficiaryId: string) =>
    (normalizedBeneficiaryAssociations[beneficiaryId]?.length ?? 0) + 1;
  const applyAssociatedPeopleCount = (
    beneficiaryId: string,
    rows: EditableViaticsRow[],
  ) => {
    const associatedPeopleCount = getAssociatedPeopleCount(beneficiaryId);

    const people = String(associatedPeopleCount);

    return rows.map((row) => ({
      ...row,
      people,
    }));
  };
  const getBeneficiaryViaticsRows = (beneficiaryId: string) =>
    applyAssociatedPeopleCount(
      beneficiaryId,
      beneficiaryViaticsRows[beneficiaryId] ?? cloneEmptyViaticsRows(),
    );
  const getBeneficiaryRowsForSave = () => {
    if (!selectedTravelExpense) return {};

    if (!hasCompanions) {
      const beneficiaryId =
        requisitionBeneficiaries[0]?.id || selectedTravelExpense.employee_id;

      return {
        [beneficiaryId]: applyAssociatedPeopleCount(beneficiaryId, viaticsRows),
      };
    }

    return Object.fromEntries(
      visibleRequisitionBeneficiaries.map((beneficiary) => [
        beneficiary.id,
        applyAssociatedPeopleCount(
          beneficiary.id,
          beneficiaryViaticsRows[beneficiary.id] ?? cloneEmptyViaticsRows(),
        ),
      ]),
    );
  };
  const handleApproveTravelExpense = async () => {
    const idTravelExpense = getSelectedTravelExpenseId();
    if (!idTravelExpense || !selectedTravelExpense) return;

    showSpinner({
      message: "Espera un momento, tu accion esta siendo procesada",
    });
    const success = await approveTravelExpense(idTravelExpense);

    if (!success) {
      hideSpinner();
      showTravelExpenseActionError("No se pudo aceptar");
      return;
    }

    hideSpinner();
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", "requisition");
    params.set("id", idTravelExpense);
    params.set("label", "Creacion de requisicion");
    router.push(`${pathname}?${params.toString()}`);
  };
  const handleSaveRequisitionProgress = async () => {
    if (!selectedTravelExpense) return;

    const idTravelExpense = getSelectedTravelExpenseId();
    if (!idTravelExpense) return;

    showSpinner({ message: "Guardando avance de la requisicion..." });
    const beneficiaryRows = getBeneficiaryRowsForSave();
    const updated = await saveTravelExpenseProgress(
      buildSaveProgressPayload(
        selectedTravelExpense,
        requisitionBeneficiaries,
        visibleRequisitionBeneficiaries,
        normalizedBeneficiaryAssociations,
        requisitionValuesByBeneficiary,
        beneficiaryRows,
      ),
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
  const handleSendRequisitionAuthorization = () => {
    if (!selectedTravelExpense) return;

    setAuthorizerError(null);
    setAuthorizerPopUpOpen(true);
  };
  const handleAuthorizerCancel = () => {
    setAuthorizerPopUpOpen(false);
    setAuthorizerError(null);
  };
  const handleAuthorizerChange = (values: string[]) => {
    setAuthorizerSelected(values[0] ?? "");
  };
  const handleConfirmAuthorizer = async () => {
    if (!selectedTravelExpense) return;

    const travelExpenseToSend = selectedTravelExpense;
    const idTravelExpense = getSelectedTravelExpenseId();

    if (!idTravelExpense) {
      showAlert({
        type: "error",
        title: "No se pudo enviar",
        description:
          "No se encontro el identificador de la solicitud de viaticos.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2500,
      });
      return;
    }

    if (!authorizerSelected) {
      setAuthorizerError("Selecciona un autorizador.");
      return;
    }

    showSpinner({ message: "Enviando requisicion a autorizacion..." });
    const beneficiaryRows = getBeneficiaryRowsForSave();
    const progressSaved = await saveTravelExpenseProgress(
      buildSaveProgressPayload(
        travelExpenseToSend,
        requisitionBeneficiaries,
        visibleRequisitionBeneficiaries,
        normalizedBeneficiaryAssociations,
        requisitionValuesByBeneficiary,
        beneficiaryRows,
      ),
    );

    if (!progressSaved) {
      hideSpinner();
      showAlert({
        type: "error",
        title: "No se pudo guardar el avance",
        description:
          useTravelExpensesStore.getState().error ||
          "Revisa que todos los beneficiarios tengan codigo de requisicion antes de enviar.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 3000,
      });
      return;
    }

    const success = await sendTravelExpenseAuthorization(
      idTravelExpense,
      authorizerSelected,
    );
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
    setAuthorizerPopUpOpen(false);
  };
  const handleRejectCommentOpen = () => {
    setRejectCommentOpen(true);
  };
  const handleRejectCommentChange = (value: string) => {
    setRejectComment(value);
    if (value.trim()) setRejectCommentError(null);
  };
  const handleRejectCommentCancel = () => {
    setRejectCommentOpen(false);
    setRejectComment("");
    setRejectCommentError(null);
  };
  const handleRejectTravelExpense = async () => {
    const idTravelExpense = getSelectedTravelExpenseId();
    const comment = rejectComment.trim();

    if (!comment) {
      setRejectCommentError(
        "Ingresa un comentario para rechazar la solicitud.",
      );
      return;
    }

    if (!idTravelExpense) return;

    showSpinner({ message: "Rechazando solicitud de viaticos..." });
    const success = await rejectTravelExpense({ idTravelExpense, comment });
    hideSpinner();

    if (!success) {
      showTravelExpenseActionError("No se pudo rechazar");
      return;
    }

    handleRejectCommentCancel();
    showAlert({
      type: "success",
      title: "Solicitud rechazada",
      description: "La solicitud de viaticos fue rechazada correctamente.",
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 1800,
    });
    router.push(pathname);
  };
  const handleCreateSubmit = async (values: Record<string, unknown>) => {
    const applicantId = toFormString(values.responsible);
    const selectedAssignees = Array.from(
      { length: assignedStaffRows },
      (_, index) => {
        const suffix = index === 0 ? "" : String(index + 1);
        const employeeId = toFormString(values[`assignedStaff${suffix}`]);

        return {
          index,
          suffix,
          employeeId,
          phoneNumber: toFormString(values[`phone${suffix}`]),
          cardNumber: toFormString(values[`cardNumber${suffix}`]),
        };
      },
    ).filter((assignee) => Boolean(assignee.employeeId));
    const employeeIds = selectedAssignees
      .map((assignee) => assignee.employeeId)
      .filter(
        (employeeId, index, employeeList) =>
          employeeList.indexOf(employeeId) === index,
      );

    if (!applicantId) {
      showAlert({
        type: "error",
        title: "No se pudo crear",
        description: "Selecciona el responsable de la solicitud.",
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

    const employeeContactUpdated =
      await updateMissingEmployeeContactData(selectedAssignees);

    if (!employeeContactUpdated) return;

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
  const updateMissingEmployeeContactData = async (
    assignees: Array<{
      index: number;
      employeeId: string;
      phoneNumber: string;
      cardNumber: string;
    }>,
  ) => {
    const updates = assignees
      .map((assignee) => {
        const employee = getSelectedCreateEmployee(
          assignee.index,
          assignee.employeeId,
        );
        const existingPhone = getEmployeePhone(employee);
        const existingCardNumber = normalizeOptionalCardNumber(
          getEmployeeCardNumber(employee),
        );
        const phoneNumber = assignee.phoneNumber || existingPhone;
        const enteredCardNumber = normalizeOptionalCardNumber(
          assignee.cardNumber,
        );
        const cardNumber = enteredCardNumber || existingCardNumber;
        const needsUpdate =
          !existingPhone ||
          phoneNumber !== existingPhone ||
          (Boolean(enteredCardNumber) && cardNumber !== existingCardNumber);

        return {
          ...assignee,
          phoneNumber,
          cardNumber,
          needsUpdate,
        };
      })
      .filter((assignee) => assignee.needsUpdate);

    const incompleteAssignee = updates.find(
      (assignee) => !assignee.phoneNumber,
    );

    if (incompleteAssignee) {
      showAlert({
        type: "error",
        title: "Faltan datos del colaborador",
        description:
          "Captura telefono para el personal asignado que no tiene ese dato.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 3000,
      });
      return false;
    }

    if (updates.length === 0) return true;

    showSpinner({ message: "Actualizando datos del colaborador..." });
    const results = await Promise.all(
      updates.map((assignee) =>
        updateEmployeeNumberCard({
          idEmployee: assignee.employeeId,
          cardNumber: assignee.cardNumber,
          phoneNumber: assignee.phoneNumber,
        }),
      ),
    );
    hideSpinner();

    if (results.some((success) => !success)) {
      showAlert({
        type: "error",
        title: "No se pudieron actualizar los datos",
        description:
          useUsersStore.getState().error ||
          "Hubo un problema al guardar el telefono o numero de tarjeta.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 3000,
      });
      return false;
    }

    await Promise.all([
      fetchEmployeesWithActiveUser(true),
      fetchEmployeesWithCardNumber(true),
    ]);

    return true;
  };
  const getSelectedCreateEmployee = (index: number, employeeId: string) =>
    index === 0
      ? employeesWithCardNumber.find(
          (employee) => employee.employee_id === employeeId,
        )
      : employeesWithActiveUser.find(
          (employee) => employee.employee_id === employeeId,
        );
  const handleExcelSubmit = () => undefined;
  const handleRequisitionValuesChange = (
    beneficiaryId: string,
    values: Record<string, unknown>,
  ) => {
    setRequisitionValuesByBeneficiary((currentValues) => {
      const currentBeneficiaryValues =
        currentValues[beneficiaryId] ??
        (selectedTravelExpense
          ? getDefaultRequisitionProgressValues(
              selectedTravelExpense,
              beneficiaryId,
            )
          : {
              requisitionCode: "",
              motive: "",
              startDate: "",
              endDate: "",
            });

      return {
        ...currentValues,
        [beneficiaryId]: {
          requisitionCode:
            values[`requisitionCode-${beneficiaryId}`] !== undefined
              ? toFormString(values[`requisitionCode-${beneficiaryId}`])
              : currentBeneficiaryValues.requisitionCode,
          motive:
            values[`motive-${beneficiaryId}`] !== undefined
              ? toFormString(values[`motive-${beneficiaryId}`])
              : currentBeneficiaryValues.motive,
          startDate:
            values[`startDate-${beneficiaryId}`] !== undefined
              ? toFormString(values[`startDate-${beneficiaryId}`])
              : currentBeneficiaryValues.startDate,
          endDate:
            values[`endDate-${beneficiaryId}`] !== undefined
              ? toFormString(values[`endDate-${beneficiaryId}`])
              : currentBeneficiaryValues.endDate,
        },
      };
    });
  };
  const handleAssociatedCompanionsChange = (
    beneficiaryId: string,
    selectedCompanionIds: string[],
  ) => {
    const currentCompanionIds =
      normalizedBeneficiaryAssociations[beneficiaryId] ??
      beneficiaryAssociations[beneficiaryId] ??
      [];
    const isSingleNewSelection =
      selectedCompanionIds.length === 1 &&
      currentCompanionIds.length > 0 &&
      !currentCompanionIds.includes(selectedCompanionIds[0]);
    const nextCompanionIds = isSingleNewSelection
      ? [...currentCompanionIds, selectedCompanionIds[0]]
      : selectedCompanionIds;
    const nextAssociations = applyBeneficiaryAssociationSelection(
      requisitionBeneficiaries,
      beneficiaryAssociations,
      beneficiaryId,
      nextCompanionIds,
    );

    setBeneficiaryAssociations(nextAssociations);

    return nextAssociations[beneficiaryId] ?? [];
  };
  const handleBeneficiaryViaticsChange = (
    beneficiaryId: string,
    rows: EditableViaticsRow[],
  ) => {
    setBeneficiaryViaticsRows((currentRows) => ({
      ...currentRows,
      [beneficiaryId]: rows,
    }));
  };
  const handleToggleBeneficiary = (beneficiaryId: string) => {
    setActiveBeneficiaryId((currentId) =>
      currentId === beneficiaryId ? "" : beneficiaryId,
    );
    setRequisitionSection("information");
  };

  const detailStatusKind = getDetailStatusKind(selectedTravelExpense?.status);
  const detailStatusType = normalizeStatusType(selectedTravelExpense?.status);
  const showRejectedDetail = detailStatusKind === "rejected";
  const requisitionActionsDisabled = isBlockedRequisitionActionStatus(
    selectedTravelExpense?.status,
  );
  const isReviewView =
    view === "detail" &&
    (!selectedTravelExpense ||
      isNoIniciadaTravelExpenseStatus(selectedTravelExpense));
  const isRequisitionView =
    view === "requisition" ||
    (view === "detail" &&
      selectedTravelExpense &&
      isDraftStatus(selectedTravelExpense.status));

  return {
    activeBeneficiaryId,
    assignedStaffRows,
    approvingTravelExpense,
    authorizerError,
    authorizerOptions,
    authorizerPopUpOpen,
    authorizerSelected,
    buildRequisitionFields,
    createFields,
    createFormLayout,
    creatingTravelExpense,
    departmentsLoading,
    detailStatusType,
    employeesWithActiveUserLoading,
    excelFile,
    fetchTravelExpenses,
    formReady,
    getBeneficiaryViaticsRows,
    handleAddAssignedStaff,
    handleApproveTravelExpense,
    handleAuthorizerCancel,
    handleAuthorizerChange,
    handleBeneficiaryViaticsChange,
    handleConfirmAuthorizer,
    handleCreateClick,
    handleCreateSubmit,
    handleCreateValuesChange,
    handleExcelSubmit,
    handleRejectCommentCancel,
    handleRejectCommentChange,
    handleRejectCommentOpen,
    handleRejectTravelExpense,
    handleRemoveAssignedStaff,
    handleRequisitionValuesChange,
    handleSaveRequisitionProgress,
    handleSendRequisitionAuthorization,
    handleToggleBeneficiary,
    handleViewDetails,
    hasCompanions,
    isReviewView,
    isRequisitionView,
    loadingTravelExpenses,
    loadingEmployeesWithCardNumber,
    proyectsLoading,
    rejectComment,
    rejectCommentError,
    rejectCommentOpen,
    rejectingTravelExpense,
    requisitionActionsDisabled,
    requisitionBeneficiaries: visibleRequisitionBeneficiaries,
    requisitionFields,
    requisitionFormLayout,
    requisitionSection,
    requisitionSummaryFields,
    requisitionSummaryLayout,
    reviewFields,
    reviewFormLayout,
    savingCalculations: savingCalculations || savingProgress,
    selectedTravelExpense,
    sendingAuthorization,
    setExcelFile,
    setFormReady,
    setRequisitionSection,
    setViaticsRows,
    showRejectedDetail,
    submitRef,
    newTravelExpenses,
    statusTravelExpenses,
    travelExpenses,
    updatingTravelExpense: updatingTravelExpense || savingProgress,
    valuesVersion,
    viaticsRows,
    view,
  };
};

const getEmployeePhone = (
  employee?: TravelExpenseEmployeeWithCardNumber | UserEmployeeSummary,
) =>
  toFormString(
    employee && "phone_number" in employee
      ? employee.phone_number ||
          ("employee_phone" in employee ? employee.employee_phone : "")
      : "",
  );

const getEmployeeCardNumber = (
  employee?: TravelExpenseEmployeeWithCardNumber | UserEmployeeSummary,
) =>
  toFormString(
    employee && "card_number" in employee ? employee.card_number : "",
  );

const normalizeOptionalCardNumber = (value: string) => {
  const normalizedValue = value.trim();

  return normalizedValue === "000 -" ? "" : normalizedValue;
};
