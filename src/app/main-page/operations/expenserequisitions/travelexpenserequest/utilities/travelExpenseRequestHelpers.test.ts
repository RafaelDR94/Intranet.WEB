import { describe, expect, it } from "vitest";

import type {
  BeneficiaryAssociationMap,
  RequisitionProgressValuesByBeneficiary,
  TravelExpenseBeneficiary,
} from "../types";
import {
  applyBeneficiaryAssociationSelection,
  buildSaveProgressPayload,
  cloneEmptyViaticsRows,
  getAvailableAssignedStaffOptions,
  getBeneficiaryAssociationsFromProgress,
  getAvailableCompanionOptions,
  getNewTravelExpenseRequests,
  getRequisitionProgressValuesFromProgress,
  getStatusTravelExpenseRequests,
  getTravelExpenseBeneficiaryItems,
  getVisibleTravelExpenseBeneficiaries,
  getViaticsRowsByBeneficiaryFromProgress,
  hasViaticsCalculationData,
  hasDuplicateAssignedStaff,
  isBlockedRequisitionActionStatus,
  isNoIniciadaTravelExpenseStatus,
  isDraftStatus,
  isSentTravelExpenseStatus,
  isRequisitionProgressComplete,
  isTravelExpenseReadyForAuthorization,
  normalizeStatusType,
  sanitizeBeneficiaryAssociations,
} from "./travelExpenseRequestHelpers";
import type { TravelExpense } from "@/app/mappings/travelExpenses/travelExpenses.types";
import type { EditableViaticsRow } from "@/app/sharedComponents/EditableViaticsTable/types";

const beneficiaries: TravelExpenseBeneficiary[] = [
  {
    id: "responsible",
    name: "Angel Vazquez",
    phone: "5555",
    cardNumber: "1111",
  },
  {
    id: "bruno",
    name: "Bruno Mendoza",
    phone: "5556",
    cardNumber: "2222",
  },
  {
    id: "carla",
    name: "Carla Perez",
    phone: "5557",
    cardNumber: "3333",
  },
];

const buildTravelExpense = (
  overrides: Partial<TravelExpense> = {},
): TravelExpense => ({
  id: "travel-1",
  billingrequisition_id: "travel-1",
  employee_id: "responsible",
  employeename: "Angel Vazquez",
  applicant_id: "",
  applicant_name: "",
  phone_number: "5555",
  card_number: "1111",
  project_id: "",
  projectname: "",
  company: "",
  enterprise_id: "",
  enterprise_name: "",
  area: "",
  department_id: "",
  department_name: "",
  status_id: "",
  status_name: "",
  status_employee_name: "",
  status: "",
  requisitionkey: "",
  assignmentdate: "2026-07-02T00:00:00.000Z",
  enddate: "2026-07-03T00:00:00.000Z",
  state: "",
  motive: "Revision",
  comments: "",
  gt_type: "",
  is_travel_expense: true,
  is_active: true,
  date_created: "",
  updated_date: "",
  created_by: "",
  updated_by: "",
  companions: [],
  requisition_requests: [],
  travel_expenses_calculations: [],
  is_approved_by_accounting: false,
  ...overrides,
});

describe("travelExpenseRequestHelpers status badges", () => {
  it("uses the purple badge for TESORERIA", () => {
    expect(normalizeStatusType("TESORERIA")).toBe("purple");
  });

  it("uses the green badge for ENVIADA", () => {
    expect(normalizeStatusType("ENVIADA")).toBe("validado");
  });

  it("recognizes ENVIADA as a read-only status", () => {
    expect(isSentTravelExpenseStatus("Enviada")).toBe(true);
    expect(isSentTravelExpenseStatus("Borrador")).toBe(false);
  });
});

describe("travelExpenseRequestHelpers assigned staff", () => {
  const staffOptions = [
    { label: "Angel Vazquez", value: "angel" },
    { label: "Bruno Mendoza", value: "bruno" },
    { label: "Carla Perez", value: "carla" },
  ];

  it("hides employees selected in other rows while preserving the current row", () => {
    expect(
      getAvailableAssignedStaffOptions(
        staffOptions,
        ["angel", "bruno"],
        "bruno",
      ),
    ).toEqual([
      { label: "Bruno Mendoza", value: "bruno" },
      { label: "Carla Perez", value: "carla" },
    ]);
  });

  it("restores an employee option when its assigned row is removed", () => {
    expect(
      getAvailableAssignedStaffOptions(staffOptions, ["angel"], ""),
    ).toEqual([
      { label: "Bruno Mendoza", value: "bruno" },
      { label: "Carla Perez", value: "carla" },
    ]);

    expect(getAvailableAssignedStaffOptions(staffOptions, [], "")).toEqual(
      staffOptions,
    );
  });

  it("detects duplicate non-empty employee selections", () => {
    expect(hasDuplicateAssignedStaff(["angel", "bruno", "angel"])).toBe(true);
    expect(hasDuplicateAssignedStaff(["angel", "bruno", ""])).toBe(false);
  });
});

describe("travelExpenseRequestHelpers associations", () => {
  it("keeps companions unique and prevents assigning the responsible as child", () => {
    const associations: BeneficiaryAssociationMap = {
      responsible: ["bruno", "carla", "bruno"],
      bruno: ["responsible", "carla"],
    };

    expect(
      sanitizeBeneficiaryAssociations(beneficiaries, associations),
    ).toEqual({
      responsible: ["bruno", "carla"],
    });
  });

  it("removes parent associations when that parent becomes a child", () => {
    const associations = applyBeneficiaryAssociationSelection(
      beneficiaries,
      { bruno: ["carla"] },
      "responsible",
      ["bruno"],
    );

    expect(associations).toEqual({
      responsible: ["bruno"],
    });
  });

  it("returns only beneficiaries that are not selected as children", () => {
    const visibleBeneficiaries = getVisibleTravelExpenseBeneficiaries(
      beneficiaries,
      {
        responsible: ["bruno"],
      },
    );

    expect(visibleBeneficiaries.map((beneficiary) => beneficiary.id)).toEqual([
      "responsible",
      "carla",
    ]);
  });

  it("excludes already assigned companions from other multiselects", () => {
    const options = getAvailableCompanionOptions(
      beneficiaries,
      {
        responsible: ["bruno"],
      },
      "carla",
    );

    expect(options).toEqual([]);
  });

  it("preserves the current beneficiary own selections and free companions in its options", () => {
    const options = getAvailableCompanionOptions(
      beneficiaries,
      {
        responsible: ["bruno"],
      },
      "responsible",
    );

    expect(options).toEqual([
      { label: "Bruno Mendoza", value: "bruno" },
      { label: "Carla Perez", value: "carla" },
    ]);
  });
});

describe("travelExpenseRequestHelpers authorization readiness", () => {
  it("treats default viatics rows as empty calculation data", () => {
    expect(hasViaticsCalculationData(cloneEmptyViaticsRows())).toBe(false);
  });

  it("detects calculation data when at least one viatics amount is captured", () => {
    const rows = cloneEmptyViaticsRows();
    rows[0] = {
      ...rows[0],
      nationalQuoted: "150",
      subtotal: "150",
    };

    expect(hasViaticsCalculationData(rows)).toBe(true);
  });

  it("requires requisition information and viatics data before authorization", () => {
    const travelExpense = buildTravelExpense();
    const rows = cloneEmptyViaticsRows();
    rows[0] = {
      ...rows[0],
      nationalQuoted: "150",
      days: "1",
      subtotal: "150",
    };

    expect(
      isRequisitionProgressComplete(travelExpense, "responsible", {
        responsible: {
          requisitionCode: "",
          motive: "Revision",
          startDate: "2026-07-02",
          endDate: "2026-07-03",
        },
      }),
    ).toBe(false);
    expect(
      isTravelExpenseReadyForAuthorization(
        travelExpense,
        [beneficiaries[0]],
        {
          responsible: {
            requisitionCode: "REQ-001",
            motive: "Revision",
            startDate: "2026-07-02",
            endDate: "2026-07-03",
          },
        },
        { responsible: rows },
      ),
    ).toBe(true);
  });
});

describe("travelExpenseRequestHelpers status filters", () => {
  const makeTravelExpense = (id: string, statusName: string): TravelExpense =>
    ({
      id,
      status_name: statusName,
      status: statusName || "Pendiente",
    }) as TravelExpense;

  it("separates no iniciada requests from the rest of statuses", () => {
    const rows = [
      makeTravelExpense("without-status", ""),
      makeTravelExpense("initial-status", "No iniciada"),
      makeTravelExpense("initial-status-uppercase", "NO INICIADA"),
      makeTravelExpense("draft", "BORRADOR"),
      makeTravelExpense("rejected", "RECHAZADA"),
    ];

    expect(getNewTravelExpenseRequests(rows).map((row) => row.id)).toEqual([
      "initial-status",
      "initial-status-uppercase",
    ]);
    expect(getStatusTravelExpenseRequests(rows).map((row) => row.id)).toEqual([
      "without-status",
      "draft",
      "rejected",
    ]);
  });

  it("does not treat pendiente as no iniciada", () => {
    expect(
      isNoIniciadaTravelExpenseStatus(
        makeTravelExpense("pending", "Pendiente"),
      ),
    ).toBe(false);
  });

  it("allows requisition draft workflow for pending, draft, rejected and canceled statuses", () => {
    expect(isDraftStatus("Pendiente")).toBe(true);
    expect(isDraftStatus("Borrador")).toBe(true);
    expect(isDraftStatus("Borrado")).toBe(true);
    expect(isDraftStatus("Rechazado")).toBe(true);
    expect(isDraftStatus("Rechazada")).toBe(true);
    expect(isDraftStatus("Cancelado")).toBe(true);
  });

  it("keeps rejected requisitions actionable so they can be corrected and resent", () => {
    expect(isBlockedRequisitionActionStatus("Pendiente")).toBe(true);
    expect(isBlockedRequisitionActionStatus("RECHAZADO")).toBe(false);
    expect(isBlockedRequisitionActionStatus("RECHAZADA")).toBe(false);
    expect(isBlockedRequisitionActionStatus("Aceptado")).toBe(true);
    expect(isBlockedRequisitionActionStatus("Aprobado")).toBe(true);
    expect(isBlockedRequisitionActionStatus("Borrador")).toBe(false);
  });
});

describe("travelExpenseRequestHelpers save progress payload", () => {
  const baseTravelExpense: TravelExpense = {
    id: "travel-1",
    billingrequisition_id: "travel-1",
    employee_id: "responsible",
    employeename: "Angel Vazquez",
    applicant_id: "",
    applicant_name: "",
    phone_number: "5555",
    card_number: "1111",
    project_id: "",
    projectname: "",
    company: "",
    enterprise_id: "",
    enterprise_name: "",
    area: "",
    department_id: "",
    department_name: "",
    status_id: "",
    status_name: "",
    status: "",
    requisitionkey: "",
    assignmentdate: "2026-05-10T00:00:00.000Z",
    enddate: "2026-05-15T00:00:00.000Z",
    state: "",
    motive: "Instalacion",
    comments: "",
    gt_type: "",
    is_travel_expense: true,
    is_active: true,
    date_created: "2026-05-01T00:00:00.000Z",
    updated_date: "",
    created_by: "",
    updated_by: "",
    companions: [
      {
        id_employee: "bruno",
        employee_name: "Bruno Mendoza",
        phone_number: "5556",
        card_number: "2222",
      },
      {
        id_employee: "carla",
        employee_name: "Carla Perez",
        phone_number: "5557",
        card_number: "",
      },
    ],
    requisition_requests: [
      {
        id: "req-1",
        id_travel_expense: "travel-1",
        requisition_code: "REQ-001",
        id_status: "",
        status_name: "",
        is_active: true,
        date_created: "",
      },
    ],
    travel_expenses_calculations: [],
  };

  const beneficiaryRows: Record<string, EditableViaticsRow[]> = {
    responsible: [
      {
        concept: "Hospedaje",
        nationalQuoted: "100",
        foreignQuoted: "0",
        people: "1",
        days: "2",
        subtotal: "200",
        observations: "Ok",
      } as EditableViaticsRow,
    ],
    carla: [
      {
        concept: "Alimentos",
        nationalQuoted: "50",
        foreignQuoted: "0",
        people: "1",
        days: "3",
        subtotal: "150",
        observations: "Fine",
      } as EditableViaticsRow,
    ],
  };

  it("builds one progress item per visible beneficiary and nests associated companions", () => {
    const requisitionValuesByBeneficiary: RequisitionProgressValuesByBeneficiary =
      {
        responsible: {
          requisitionCode: "REQ-RESP",
          motive: "Motivo resp",
          startDate: "2026-05-10",
          endDate: "2026-05-12",
        },
        carla: {
          requisitionCode: "REQ-CARLA",
          motive: "Motivo carla",
          startDate: "2026-05-11",
          endDate: "2026-05-13",
        },
      };

    const payload = buildSaveProgressPayload(
      baseTravelExpense,
      beneficiaries,
      [beneficiaries[0], beneficiaries[2]],
      { responsible: ["bruno"] },
      requisitionValuesByBeneficiary,
      beneficiaryRows,
    );

    expect(payload).toEqual({
      id_travel_expense: "travel-1",
      progress_items: [
        {
          employee_id: "responsible",
          employee_name: "Angel Vazquez",
          requisition_code: "REQ-RESP",
          motive: "Motivo resp",
          start_date: new Date("2026-05-10T00:00:00").toISOString(),
          end_date: new Date("2026-05-12T00:00:00").toISOString(),
          subtotal: 200,
          total: 200,
          companions: [
            {
              employee_id: "bruno",
              full_name: "Bruno Mendoza",
            },
          ],
          calculation_concepts: [
            {
              concept: "Hospedaje",
              national_quoted: 100,
              foreign_quoted: 0,
              people_number: 1,
              days_number: 2,
              subtotal: 200,
              observations: "Ok",
            },
          ],
        },
        {
          employee_id: "carla",
          employee_name: "Carla Perez",
          requisition_code: "REQ-CARLA",
          motive: "Motivo carla",
          start_date: new Date("2026-05-11T00:00:00").toISOString(),
          end_date: new Date("2026-05-13T00:00:00").toISOString(),
          subtotal: 150,
          total: 150,
          companions: [],
          calculation_concepts: [
            {
              concept: "Alimentos",
              national_quoted: 50,
              foreign_quoted: 0,
              people_number: 1,
              days_number: 3,
              subtotal: 150,
              observations: "Fine",
            },
          ],
        },
      ],
    });
  });

  it("uses default requisition values when a beneficiary has not been edited", () => {
    const payload = buildSaveProgressPayload(
      baseTravelExpense,
      beneficiaries,
      [beneficiaries[0]],
      {},
      {},
      {},
    );

    expect(payload.progress_items[0]).toMatchObject({
      employee_id: "responsible",
      employee_name: "Angel Vazquez",
      requisition_code: "REQ-001",
      motive: "Instalacion",
    });
    expect(payload.progress_items[0].start_date).toBe(
      new Date("2026-05-10T00:00:00").toISOString(),
    );
    expect(payload.progress_items[0].end_date).toBe(
      new Date("2026-05-15T00:00:00").toISOString(),
    );
  });
});

describe("travelExpenseRequestHelpers progress json hydration", () => {
  it("reads requisition values, companions and viatics rows from calculation_concepts_json", () => {
    const travelExpense: TravelExpense = {
      id: "travel-1",
      billingrequisition_id: "travel-1",
      employee_id: "responsible",
      employeename: "Angel Vazquez",
      applicant_id: "",
      applicant_name: "",
      phone_number: "5555",
      card_number: "1111",
      project_id: "",
      projectname: "",
      company: "",
      enterprise_id: "",
      enterprise_name: "",
      area: "",
      department_id: "",
      department_name: "",
      status_id: "",
      status_name: "",
      status: "",
      requisitionkey: "",
      assignmentdate: "",
      enddate: "",
      state: "",
      motive: "",
      comments: "",
      gt_type: "",
      is_travel_expense: true,
      is_active: true,
      date_created: "",
      updated_date: "",
      created_by: "",
      updated_by: "",
      companions: [
        {
          id_employee: "bruno",
          employee_name: "Bruno Mendoza",
          phone_number: "",
          card_number: "",
        },
      ],
      requisition_requests: [],
      travel_expenses_calculations: [],
      calculation_concepts_json: [
        {
          employee_id: "responsible",
          employee_name: "Angel Vazquez",
          requisition_code: "REQ-RESP",
          motive: "Revision",
          start_date: "2026-07-02T00:00:00.000Z",
          end_date: "2026-07-03T00:00:00.000Z",
          companions: [{ employee_id: "bruno", full_name: "Bruno Mendoza" }],
          calculation_concepts: [
            {
              concept: "Taxis",
              national_quoted: 100,
              foreign_quoted: 0,
              people_number: 2,
              days_number: 1,
              subtotal: 200,
              observations: "Taxi aeropuerto",
            },
          ],
        },
      ],
    };
    const beneficiaries = getTravelExpenseBeneficiaryItems(travelExpense);

    expect(getRequisitionProgressValuesFromProgress(travelExpense)).toEqual({
      responsible: {
        requisitionCode: "REQ-RESP",
        motive: "Revision",
        startDate: "2026-07-02",
        endDate: "2026-07-03",
      },
    });
    expect(
      getBeneficiaryAssociationsFromProgress(travelExpense, beneficiaries),
    ).toEqual({
      responsible: ["bruno"],
    });
    expect(
      getViaticsRowsByBeneficiaryFromProgress(travelExpense).responsible.find(
        (row) => row.concept === "Taxis",
      ),
    ).toMatchObject({
      nationalQuoted: "100",
      people: "2",
      days: "1",
      subtotal: "200",
      observations: "Taxi aeropuerto",
    });
  });
});
