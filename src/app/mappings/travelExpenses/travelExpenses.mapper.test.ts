import { describe, expect, it } from "vitest";

import { TravelExpenseMap } from "./travelExpenses.mapper";

describe("TravelExpenseMap", () => {
  it("maps companions from the new employee_id/full_name API shape", () => {
    const result = TravelExpenseMap({
      id: "travel-expense-1",
      employeename: "Angel Vazquez",
      companions: [
        {
          employee_id: "e986a8db-cb6e-4ce1-9a9d-a25c1f05fc89",
          full_name: "Bruno Mendoza Ruiz",
          phone_number: "5540949749",
          card_number: "012 036 0952 50",
        },
        {
          employee_id: "99345036-3d5f-40dc-b358-fe4b321822c8",
          full_name: "LORENA LEON TAPIA",
          phone_number: "556494152",
          card_number: null,
        },
      ],
    });

    expect(result.companions).toEqual([
      {
        id_employee: "e986a8db-cb6e-4ce1-9a9d-a25c1f05fc89",
        employee_name: "Bruno Mendoza Ruiz",
        phone_number: "5540949749",
        card_number: "012 036 0952 50",
      },
      {
        id_employee: "99345036-3d5f-40dc-b358-fe4b321822c8",
        employee_name: "LORENA LEON TAPIA",
        phone_number: "556494152",
        card_number: "",
      },
    ]);
  });

  it("keeps calculation_concepts_json from an API array", () => {
    const result = TravelExpenseMap({
      id: "travel-expense-1",
      calculation_concepts_json: [
        {
          employee_id: "employee-1",
          employee_name: "Angel Vazquez",
          requisition_code: "REQ-001",
          companions: [],
          calculation_concepts: [{ concept: "Taxis", national_quoted: 100 }],
        },
      ],
    });

    expect(result.calculation_concepts_json).toEqual([
      {
        employee_id: "employee-1",
        employee_name: "Angel Vazquez",
        requisition_code: "REQ-001",
        companions: [],
        calculation_concepts: [{ concept: "Taxis", national_quoted: 100 }],
      },
    ]);
  });

  it("parses calculation_concepts_json when the API returns a JSON string", () => {
    const result = TravelExpenseMap({
      id: "travel-expense-1",
      calculation_concepts_json: JSON.stringify([
        {
          employee_id: "employee-1",
          requisition_code: "REQ-001",
        },
      ]),
    });

    expect(result.calculation_concepts_json?.[0]?.requisition_code).toBe(
      "REQ-001",
    );
  });

  it("wraps direct requisition request calculation_concepts into progress json", () => {
    const result = TravelExpenseMap({
      id: "requisition-request-1",
      employee_id: "employee-1",
      employee_name: "Angel Vazquez",
      requisition_code: "REQ-001",
      motive: "Revision",
      start_date: "2026-07-17T06:00:00.000Z",
      end_date: "2026-07-18T06:00:00.000Z",
      calculation_concepts: [
        {
          concept: "Renta de automóvil",
          national_quoted: 10000,
          foreign_quoted: 0,
          people_number: 1,
          days_number: 7,
          subtotal: 70000,
          observations: "Escribe aquí",
        },
      ],
    });

    expect(result.requisitionkey).toBe("REQ-001");
    expect(result.assignmentdate).toBe("2026-07-17T06:00:00.000Z");
    expect(result.enddate).toBe("2026-07-18T06:00:00.000Z");
    expect(result.calculation_concepts_json?.[0]).toMatchObject({
      employee_id: "employee-1",
      employee_name: "Angel Vazquez",
      requisition_code: "REQ-001",
      motive: "Revision",
      start_date: "2026-07-17T06:00:00.000Z",
      end_date: "2026-07-18T06:00:00.000Z",
      calculation_concepts: [
        {
          concept: "Renta de automóvil",
          national_quoted: 10000,
          people_number: 1,
          days_number: 7,
          subtotal: 70000,
        },
      ],
    });
  });

  it("keeps status_name empty when the API has no assigned status", () => {
    const result = TravelExpenseMap({
      id: "travel-expense-1",
    });

    expect(result.status_name).toBe("");
    expect(result.status).toBe("Pendiente");
  });

  it("maps status_employee_name from the API", () => {
    const result = TravelExpenseMap({
      id: "travel-expense-1",
      status_employee_name: "Autorizada por empleado",
    });

    expect(result.status_employee_name).toBe("Autorizada por empleado");
  });

  it("maps accounting approval flag from the API", () => {
    const result = TravelExpenseMap({
      id: "travel-expense-1",
      is_approved_by_accounting: true,
    });

    expect(result.is_approved_by_accounting).toBe(true);
  });
});
