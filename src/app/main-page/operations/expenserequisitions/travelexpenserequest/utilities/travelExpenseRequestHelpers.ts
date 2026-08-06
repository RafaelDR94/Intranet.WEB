import type { LabelType } from "@/app/components/Label/types";
import type { SelectOption } from "@/app/components/Select/types";
import type { TravelExpenseCalculation } from "@/app/mappings/travelExpenseCalculations/travelExpenseCalculations.types";
import type {
  TravelExpense,
  TravelExpenseCalculationConceptJsonApi,
  TravelExpenseProgressItemApi,
} from "@/app/mappings/travelExpenses/travelExpenses.types";
import type { EditableViaticsRow } from "@/app/sharedComponents/EditableViaticsTable/types";
import type { SaveTravelExpenseProgressPayload } from "@/app/stores/useTravelExpensesStore/types";
import {
  calculateSubtotal,
  parseAmount,
} from "@/app/sharedComponents/EditableViaticsTable/utilities/helperFunction";
import { emptyViaticsRows } from "@/app/sharedComponents/EditableViaticsTable/utilities/mockRows";

import type {
  BeneficiaryAssociationMap,
  DetailStatusKind,
  RequisitionProgressValuesByBeneficiary,
  TravelExpenseBeneficiary,
} from "../types";

/**
 * Formats API date strings for display in tables.
 */
export const formatDate = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

/**
 * Converts date strings to yyyy-mm-dd for date inputs.
 */
export const toDateInputValue = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toISOString().slice(0, 10);
};

/**
 * Normalizes unknown form values into trimmed strings.
 */
export const toFormString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

/**
 * Converts a date input value to an ISO string for API payloads.
 */
export const toIsoDate = (value: unknown) => {
  const dateValue = toFormString(value);
  if (!dateValue) return "";

  const date = new Date(`${dateValue}T00:00:00`);
  return Number.isNaN(date.getTime()) ? dateValue : date.toISOString();
};

/**
 * Maps request statuses to label styles.
 */
export const normalizeStatusType = (status = ""): LabelType => {
  const normalized = normalizeComparableText(status);

  if (normalized.includes("teso")) return "purple";
  if (normalized.includes("conta")) return "vale-rosa";
  if (normalized.includes("borrador")) return "purple";
  if (normalized.includes("rechaz")) return "rechazado";
  if (normalized.includes("enviad")) return "validado";
  if (
    normalized.includes("aprobad") ||
    normalized.includes("valid") ||
    normalized.includes("final")
  ) {
    return "validado";
  }
  if (normalized.includes("cancel")) return "restringido";

  return "pendiente";
};

/**
 * Detects statuses that should open the requisition draft workflow.
 */
export const isDraftStatus = (status: string) =>
  ["pendiente", "borrad", "rechaz", "cancel"].some((value) =>
    normalizeComparableText(status).includes(value),
  );

/**
 * Detects requests that have been sent and can only be consulted from operations.
 */
export const isSentTravelExpenseStatus = (status = "") =>
  normalizeComparableText(status).includes("enviad");

/**
 * Returns the stable identifier for a travel expense row.
 */
export const getTravelExpenseIdentifier = (row: TravelExpense) =>
  row.id || row.billingrequisition_id || row.requisitionkey;

/**
 * Checks whether a request is still in the initial backend status.
 */
export const isNoIniciadaTravelExpenseStatus = (row: TravelExpense) =>
  normalizeComparableText(row.status_name) === "no iniciada";

/**
 * Detects statuses where draft action buttons must be disabled. Rejected
 * requisitions remain editable so they can be corrected and resent.
 */
export const isBlockedRequisitionActionStatus = (status = "") => {
  const normalized = normalizeComparableText(status);

  return ["pendiente", "acept", "aprobad"].some((value) =>
    normalized.includes(value),
  );
};

/**
 * Returns requests that are still in "No iniciada" status.
 */
export const getNewTravelExpenseRequests = (rows: TravelExpense[]) =>
  rows.filter(isNoIniciadaTravelExpenseStatus);

/**
 * Returns requests with any status other than "No iniciada".
 */
export const getStatusTravelExpenseRequests = (rows: TravelExpense[]) =>
  rows.filter((row) => !isNoIniciadaTravelExpenseStatus(row));

/**
 * Creates editable viatics rows from the shared empty template.
 */
export const cloneEmptyViaticsRows = () =>
  emptyViaticsRows.map((row) => ({ ...row }));

/**
 * Maps persisted calculations back to editable viatics rows.
 */
export const mapCalculationsToViaticsRows = (
  calculations: TravelExpenseCalculation[],
  employeeId?: string,
) => {
  const filteredCalculations = employeeId
    ? calculations.filter(
        (calculation) =>
          !calculation.employee_id || calculation.employee_id === employeeId,
      )
    : calculations;

  return cloneEmptyViaticsRows().map((emptyRow, index) => {
    const calculation =
      filteredCalculations.find(
        (item) =>
          normalizeComparableText(item.concept) ===
          normalizeComparableText(emptyRow.concept),
      ) ?? filteredCalculations[index];

    if (!calculation) return emptyRow;

    return {
      ...emptyRow,
      calculationId: calculation.id,
      employeeId: calculation.employee_id || employeeId,
      nationalQuoted: calculation.national_quoted || "00",
      foreignQuoted: calculation.foreign_quoted || "00",
      people: calculation.people || "00",
      days: calculation.days || "00",
      subtotal: calculation.subtotal || "00",
      observations: calculation.observations || "Escribe aqui",
    };
  });
};

const toEditableAmount = (value: unknown, fallback = "00") =>
  value == null || value === "" ? fallback : String(value);

const getProgressItemEmployeeId = (item: TravelExpenseProgressItemApi) =>
  toFormString(item.employee_id ?? item.employeeId);

const getProgressItemEmployeeName = (item: TravelExpenseProgressItemApi) =>
  toFormString(item.employee_name ?? item.employeeName);

const getProgressItemCompanions = (item: TravelExpenseProgressItemApi) =>
  Array.isArray(item.companions) ? item.companions : [];

const getProgressItemCalculations = (item: TravelExpenseProgressItemApi) =>
  item.calculation_concepts ?? item.calculationConcepts ?? [];

const getCalculationConcept = (
  calculation: TravelExpenseCalculationConceptJsonApi,
) => toFormString(calculation.concept);

/**
 * Gets persisted progress items from calculation_concepts_json.
 */
export const getTravelExpenseProgressItems = (row: TravelExpense) =>
  Array.isArray(row.calculation_concepts_json)
    ? row.calculation_concepts_json
    : [];

/**
 * Maps calculation_concepts_json rows back to editable viatics rows by beneficiary.
 */
export const getViaticsRowsByBeneficiaryFromProgress = (
  row: TravelExpense,
): Record<string, EditableViaticsRow[]> =>
  Object.fromEntries(
    getTravelExpenseProgressItems(row)
      .map((item) => {
        const employeeId = getProgressItemEmployeeId(item);
        if (!employeeId) return undefined;

        const calculations = getProgressItemCalculations(item);
        const rows = cloneEmptyViaticsRows().map((emptyRow, index) => {
          const calculation =
            calculations.find(
              (currentCalculation) =>
                normalizeComparableText(
                  getCalculationConcept(currentCalculation),
                ) === normalizeComparableText(emptyRow.concept),
            ) ?? calculations[index];

          if (!calculation) return emptyRow;

          return {
            ...emptyRow,
            employeeId,
            nationalQuoted: toEditableAmount(
              calculation.national_quoted ?? calculation.nationalQuoted,
            ),
            foreignQuoted: toEditableAmount(
              calculation.foreign_quoted ?? calculation.foreignQuoted,
            ),
            people: toEditableAmount(
              calculation.people_number ?? calculation.peopleNumber,
            ),
            days: toEditableAmount(
              calculation.days_number ?? calculation.daysNumber,
            ),
            subtotal: toEditableAmount(calculation.subtotal),
            observations:
              toFormString(calculation.observations) || emptyRow.observations,
          };
        });

        return [employeeId, rows] as const;
      })
      .filter(
        (entry): entry is readonly [string, EditableViaticsRow[]] =>
          entry !== undefined,
      ),
  );

/**
 * Gets beneficiary names from the main employee and companions.
 */
export const getTravelExpenseBeneficiaries = (row: TravelExpense) =>
  [
    row.employeename,
    ...row.companions.map((companion) => companion.employee_name),
  ].filter(Boolean);

/**
 * Builds beneficiary data for requisition accordion sections.
 */
export const getTravelExpenseBeneficiaryItems = (
  row: TravelExpense,
): TravelExpenseBeneficiary[] => {
  const beneficiaryById = new Map<string, TravelExpenseBeneficiary>();
  const addBeneficiary = (beneficiary: TravelExpenseBeneficiary) => {
    if (!beneficiary.id && !beneficiary.name) return;
    const key = beneficiary.id || beneficiary.name;
    const currentBeneficiary = beneficiaryById.get(key);

    beneficiaryById.set(key, {
      id: beneficiary.id || currentBeneficiary?.id || key,
      name: beneficiary.name || currentBeneficiary?.name || "",
      phone: beneficiary.phone || currentBeneficiary?.phone || "",
      cardNumber:
        beneficiary.cardNumber || currentBeneficiary?.cardNumber || "",
    });
  };

  [
    {
      id: row.employee_id || "primary",
      name: row.employeename,
      phone: row.phone_number,
      cardNumber: row.card_number,
    },
    ...row.companions.map((companion, index) => ({
      id: companion.id_employee || `companion-${index + 1}`,
      name: companion.employee_name,
      phone: companion.phone_number,
      cardNumber: companion.card_number,
    })),
  ].forEach(addBeneficiary);

  getTravelExpenseProgressItems(row).forEach((item) => {
    addBeneficiary({
      id: getProgressItemEmployeeId(item),
      name: getProgressItemEmployeeName(item),
      phone: "",
      cardNumber: "",
    });

    getProgressItemCompanions(item).forEach((companion) => {
      addBeneficiary({
        id: toFormString(companion.employee_id ?? companion.employeeId),
        name: toFormString(
          companion.full_name ??
            companion.fullName ??
            companion.employee_name ??
            companion.employeeName,
        ),
        phone: "",
        cardNumber: "",
      });
    });
  });

  return Array.from(beneficiaryById.values());
};

/**
 * Returns the responsible beneficiary id, which cannot be associated as child.
 */
export const getPrimaryBeneficiaryId = (
  beneficiaries: TravelExpenseBeneficiary[],
) => beneficiaries[0]?.id || "";

/**
 * Sanitizes the local association map to keep only valid non-cyclic mappings.
 */
export const sanitizeBeneficiaryAssociations = (
  beneficiaries: TravelExpenseBeneficiary[],
  associations: BeneficiaryAssociationMap,
): BeneficiaryAssociationMap => {
  const beneficiaryIds = new Set(
    beneficiaries.map((beneficiary) => beneficiary.id),
  );
  const primaryBeneficiaryId = getPrimaryBeneficiaryId(beneficiaries);
  const allowedChildIds = new Set(
    beneficiaries
      .map((beneficiary) => beneficiary.id)
      .filter((beneficiaryId) => beneficiaryId !== primaryBeneficiaryId),
  );

  const normalize = (source: BeneficiaryAssociationMap) => {
    const normalized: BeneficiaryAssociationMap = {};
    const assignedChildren = new Set<string>();

    Object.entries(source).forEach(([parentId, childIds]) => {
      if (!beneficiaryIds.has(parentId) || !Array.isArray(childIds)) return;

      const nextChildIds = childIds.filter((childId, index) => {
        if (typeof childId !== "string") return false;
        if (childId === parentId) return false;
        if (!allowedChildIds.has(childId)) return false;
        if (assignedChildren.has(childId)) return false;
        if (childIds.indexOf(childId) !== index) return false;

        assignedChildren.add(childId);
        return true;
      });

      if (nextChildIds.length > 0) {
        normalized[parentId] = nextChildIds;
      }
    });

    return normalized;
  };

  let normalized = normalize(associations);

  while (true) {
    const associatedIds = new Set(Object.values(normalized).flat());
    const prunedEntries = Object.entries(normalized).filter(
      ([parentId]) => !associatedIds.has(parentId),
    );

    if (prunedEntries.length === Object.keys(normalized).length) {
      return normalized;
    }

    normalized = normalize(Object.fromEntries(prunedEntries));
  }
};

/**
 * Applies a single parent selection change over the existing association map.
 */
export const applyBeneficiaryAssociationSelection = (
  beneficiaries: TravelExpenseBeneficiary[],
  associations: BeneficiaryAssociationMap,
  parentId: string,
  selectedChildIds: string[],
): BeneficiaryAssociationMap =>
  sanitizeBeneficiaryAssociations(beneficiaries, {
    ...associations,
    [parentId]: selectedChildIds,
  });

/**
 * Builds the list of beneficiaries that should still render an accordion panel.
 */
export const getVisibleTravelExpenseBeneficiaries = (
  beneficiaries: TravelExpenseBeneficiary[],
  associations: BeneficiaryAssociationMap,
) => {
  const associatedIds = new Set(
    Object.values(
      sanitizeBeneficiaryAssociations(beneficiaries, associations),
    ).flat(),
  );

  return beneficiaries.filter(
    (beneficiary) => !associatedIds.has(beneficiary.id),
  );
};

/**
 * Returns assignable companion options for a given beneficiary.
 */
export const getAvailableCompanionOptions = (
  beneficiaries: TravelExpenseBeneficiary[],
  associations: BeneficiaryAssociationMap,
  beneficiaryId: string,
) => {
  const normalizedAssociations = sanitizeBeneficiaryAssociations(
    beneficiaries,
    associations,
  );
  const primaryBeneficiaryId = getPrimaryBeneficiaryId(beneficiaries);
  const childOwnerMap = Object.entries(normalizedAssociations).reduce<
    Record<string, string>
  >((accumulator, [parentId, childIds]) => {
    childIds.forEach((childId) => {
      accumulator[childId] = parentId;
    });
    return accumulator;
  }, {});

  return beneficiaries
    .filter((beneficiary) => beneficiary.id !== primaryBeneficiaryId)
    .filter((beneficiary) => beneficiary.id !== beneficiaryId)
    .filter((beneficiary) => {
      const ownerId = childOwnerMap[beneficiary.id];
      return !ownerId || ownerId === beneficiaryId;
    })
    .map((beneficiary) => ({
      label: beneficiary.name,
      value: beneficiary.id,
    }));
};

/**
 * Removes employees already chosen in another assigned-staff row while keeping
 * the current row's selection available for edits.
 */
export const getAvailableAssignedStaffOptions = (
  options: SelectOption[],
  selectedEmployeeIds: string[],
  currentEmployeeId: string,
) => {
  const selectedIds = new Set(selectedEmployeeIds);

  return options.filter(
    (option) =>
      option.value === currentEmployeeId || !selectedIds.has(option.value),
  );
};

/**
 * Returns whether an assigned-staff selection contains the same employee more
 * than once. Empty values are ignored because required-field validation owns
 * that case.
 */
export const hasDuplicateAssignedStaff = (employeeIds: string[]) => {
  const nonEmptyEmployeeIds = employeeIds.filter(Boolean);

  return new Set(nonEmptyEmployeeIds).size !== nonEmptyEmployeeIds.length;
};

/**
 * Resolves the display area for a request.
 */
export const getTravelExpenseArea = (row: TravelExpense) =>
  row.department_name || row.area;

/**
 * Builds default requisition progress values for a beneficiary block.
 */
export const getDefaultRequisitionProgressValues = (
  row: TravelExpense,
  beneficiaryId?: string,
) => {
  const progressItem = beneficiaryId
    ? getTravelExpenseProgressItems(row).find(
        (item) => getProgressItemEmployeeId(item) === beneficiaryId,
      )
    : getTravelExpenseProgressItems(row)[0];

  return {
    requisitionCode:
      toFormString(
        progressItem?.requisition_code ?? progressItem?.requisitionCode,
      ) ||
      row.requisition_requests[0]?.requisition_code ||
      "",
    motive: toFormString(progressItem?.motive) || row.motive || "",
    startDate:
      toDateInputValue(
        toFormString(progressItem?.start_date ?? progressItem?.startDate),
      ) || toDateInputValue(row.assignmentdate),
    endDate:
      toDateInputValue(
        toFormString(progressItem?.end_date ?? progressItem?.endDate),
      ) || toDateInputValue(row.enddate),
  };
};

/**
 * Gets persisted requisition field values keyed by beneficiary id.
 */
export const getRequisitionProgressValuesFromProgress = (
  row: TravelExpense,
): RequisitionProgressValuesByBeneficiary =>
  Object.fromEntries(
    getTravelExpenseProgressItems(row)
      .map((item) => {
        const employeeId = getProgressItemEmployeeId(item);
        if (!employeeId) return undefined;

        return [
          employeeId,
          getDefaultRequisitionProgressValues(row, employeeId),
        ] as const;
      })
      .filter(
        (
          entry,
        ): entry is readonly [
          string,
          RequisitionProgressValuesByBeneficiary[string],
        ] => entry !== undefined,
      ),
  );

/**
 * Gets persisted companion associations keyed by parent beneficiary id.
 */
export const getBeneficiaryAssociationsFromProgress = (
  row: TravelExpense,
  beneficiaries: TravelExpenseBeneficiary[],
): BeneficiaryAssociationMap => {
  const beneficiaryIds = new Set(
    beneficiaries.map((beneficiary) => beneficiary.id),
  );
  const associations = Object.fromEntries(
    getTravelExpenseProgressItems(row)
      .map((item) => {
        const employeeId = getProgressItemEmployeeId(item);
        if (!employeeId) return undefined;

        const companionIds = getProgressItemCompanions(item)
          .map((companion) =>
            toFormString(companion.employee_id ?? companion.employeeId),
          )
          .filter((companionId) => beneficiaryIds.has(companionId));

        return companionIds.length > 0
          ? ([employeeId, companionIds] as const)
          : undefined;
      })
      .filter(
        (entry): entry is readonly [string, string[]] => entry !== undefined,
      ),
  );

  return sanitizeBeneficiaryAssociations(beneficiaries, associations);
};

/**
 * Converts editable viatics rows into API calculation payloads.
 */
export const buildCalculationPayloads = (
  idRequisitionRequest: string,
  rows: EditableViaticsRow[],
  employeeId?: string,
) =>
  rows.map((row) => ({
    id: row.calculationId,
    id_requisition_request: idRequisitionRequest,
    employee_id: row.employeeId || employeeId,
    concept: row.concept,
    national_quoted: parseAmount(row.nationalQuoted),
    foreign_quoted: parseAmount(row.foreignQuoted),
    people: parseAmount(row.people),
    days: parseAmount(row.days),
    subtotal: parseAmount(row.subtotal),
    observations: row.observations,
  }));

const isPlaceholderObservation = (value: string) => {
  const normalized = normalizeComparableText(value);

  return !normalized || normalized === "escribe aqui";
};

/**
 * Checks whether at least one viatics row has user-entered calculation data.
 */
export const hasViaticsCalculationData = (rows: EditableViaticsRow[]) =>
  rows.some(
    (row) =>
      parseAmount(row.nationalQuoted) > 0 ||
      parseAmount(row.foreignQuoted) > 0 ||
      parseAmount(row.days) > 0 ||
      parseAmount(row.subtotal) > 0 ||
      !isPlaceholderObservation(row.observations),
  );

/**
 * Checks whether the requisition form information is complete for a beneficiary.
 */
export const isRequisitionProgressComplete = (
  row: TravelExpense,
  beneficiaryId: string,
  requisitionValuesByBeneficiary: RequisitionProgressValuesByBeneficiary,
) => {
  const values =
    requisitionValuesByBeneficiary[beneficiaryId] ??
    getDefaultRequisitionProgressValues(row, beneficiaryId);

  return Boolean(
    values.requisitionCode.trim() &&
      values.motive.trim() &&
      values.startDate.trim() &&
      values.endDate.trim(),
  );
};

/**
 * Checks whether the requisition can be sent to authorization.
 */
export const isTravelExpenseReadyForAuthorization = (
  row: TravelExpense,
  visibleBeneficiaries: TravelExpenseBeneficiary[],
  requisitionValuesByBeneficiary: RequisitionProgressValuesByBeneficiary,
  beneficiaryRows: Record<string, EditableViaticsRow[]>,
) =>
  visibleBeneficiaries.length > 0 &&
  visibleBeneficiaries.every((beneficiary) => {
    const rows = beneficiaryRows[beneficiary.id] ?? cloneEmptyViaticsRows();

    return (
      isRequisitionProgressComplete(
        row,
        beneficiary.id,
        requisitionValuesByBeneficiary,
      ) && hasViaticsCalculationData(rows)
    );
  });

/**
 * Builds the consolidated SaveProgress payload expected by backend.
 */
export const buildSaveProgressPayload = (
  row: TravelExpense,
  beneficiaries: TravelExpenseBeneficiary[],
  visibleBeneficiaries: TravelExpenseBeneficiary[],
  associations: BeneficiaryAssociationMap,
  requisitionValuesByBeneficiary: RequisitionProgressValuesByBeneficiary,
  beneficiaryRows: Record<string, EditableViaticsRow[]>,
): SaveTravelExpenseProgressPayload => ({
  id_travel_expense: getTravelExpenseIdentifier(row),
  progress_items: visibleBeneficiaries.map((beneficiary) => {
    const beneficiaryValues =
      requisitionValuesByBeneficiary[beneficiary.id] ??
      getDefaultRequisitionProgressValues(row);
    const beneficiaryCompanions = (associations[beneficiary.id] ?? [])
      .map((companionId) =>
        beneficiaries.find((item) => item.id === companionId),
      )
      .filter((companion): companion is TravelExpenseBeneficiary =>
        Boolean(companion),
      );
    const rows = beneficiaryRows[beneficiary.id] ?? cloneEmptyViaticsRows();
    const subtotal = calculateSubtotal(rows);

    return {
      employee_id: beneficiary.id,
      employee_name: beneficiary.name,
      requisition_code: beneficiaryValues.requisitionCode,
      motive: beneficiaryValues.motive,
      start_date: toIsoDate(beneficiaryValues.startDate),
      end_date: toIsoDate(beneficiaryValues.endDate),
      subtotal,
      total: subtotal,
      companions: beneficiaryCompanions.map((companion) => ({
        employee_id: companion.id,
        full_name: companion.name,
      })),
      calculation_concepts: rows.map((item) => ({
        concept: item.concept,
        national_quoted: parseAmount(item.nationalQuoted),
        foreign_quoted: parseAmount(item.foreignQuoted),
        people_number: parseAmount(item.people),
        days_number: parseAmount(item.days),
        subtotal: parseAmount(item.subtotal),
        observations: item.observations,
      })),
    };
  }),
});

/**
 * Converts status text into the coarse detail status kind.
 */
export const getDetailStatusKind = (status = ""): DetailStatusKind => {
  const normalized = normalizeComparableText(status);

  if (normalized.includes("rechaz")) return "rejected";
  if (normalized.includes("aprobad") || normalized.includes("valid")) {
    return "validated";
  }

  return "pending";
};

const normalizeComparableText = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
