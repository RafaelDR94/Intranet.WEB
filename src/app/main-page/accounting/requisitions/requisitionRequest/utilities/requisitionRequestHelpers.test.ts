import { describe, expect, it } from "vitest";

import type { TravelExpense } from "@/app/mappings/travelExpenses/travelExpenses.types";

import {
  buildSaveProgressPayload,
  getFirstProgressItemValues,
  mapCalculationConceptsJsonToViaticsRows,
} from "./requisitionRequestHelpers";

const travelExpense: TravelExpense = {
  id: "travel-1",
  billingrequisition_id: "travel-1",
  employee_id: "employee-1",
  employeename: "Angel Vazquez",
  applicant_id: "",
  applicant_name: "",
  phone_number: "5639728912",
  card_number: "",
  project_id: "",
  projectname: "Client_1",
  company: "DR MONTERREY",
  enterprise_id: "",
  enterprise_name: "",
  area: "",
  department_id: "",
  department_name: "DESARROLLO TECNOLOGICO",
  status_id: "",
  status_name: "BORRADOR",
  status: "BORRADOR",
  requisitionkey: "",
  assignmentdate: "2026-07-01T06:00:00.000Z",
  enddate: "2026-07-01T06:00:00.000Z",
  state: "Yucatan",
  motive: "",
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
  calculation_concepts_json: [
    {
      employee_id: "employee-1",
      employee_name: "Angel Vazquez",
      requisition_code: "REQ-123",
      motive: "Revision",
      start_date: "2026-07-02T06:00:00.000Z",
      end_date: "2026-07-09T06:00:00.000Z",
      companions: [],
      calculation_concepts: [
        {
          concept: "Taxis",
          national_quoted: 150,
          foreign_quoted: 0,
          people_number: 1,
          days_number: 2,
          subtotal: 300,
          observations: "Traslados",
        },
      ],
    },
  ],
};

describe("requisitionRequestHelpers", () => {
  it("gets detail fields from calculation_concepts_json", () => {
    expect(getFirstProgressItemValues(travelExpense)).toEqual({
      requisitionCode: "REQ-123",
      motive: "Revision",
      startDate: "2026-07-02T06:00:00.000Z",
      endDate: "2026-07-09T06:00:00.000Z",
    });
  });

  it("builds SaveProgress payload with subtotal and total from table amounts", () => {
    const payload = buildSaveProgressPayload(travelExpense, [
      {
        id: "row-1",
        concept: "Taxis",
        nationalQuoted: "150",
        foreignQuoted: "0",
        people: "1",
        days: "2",
        subtotal: "300",
        observations: "Ok",
      },
      {
        id: "row-2",
        concept: "Hotel",
        nationalQuoted: "100",
        foreignQuoted: "0",
        people: "1",
        days: "1",
        subtotal: "100",
        observations: "Ok",
      },
    ]);

    expect(payload.progress_items[0]).toMatchObject({
      subtotal: 400,
      total: 400,
      calculation_concepts: [
        expect.objectContaining({ subtotal: 300 }),
        expect.objectContaining({ subtotal: 100 }),
      ],
    });
  });

  it("maps calculation_concepts_json to viatics rows", () => {
    const taxisRow = mapCalculationConceptsJsonToViaticsRows(
      travelExpense,
    ).find((row) => row.concept === "Taxis");

    expect(taxisRow).toMatchObject({
      nationalQuoted: "150",
      foreignQuoted: "0",
      people: "1",
      days: "2",
      subtotal: "300",
      observations: "Traslados",
    });
  });
});
