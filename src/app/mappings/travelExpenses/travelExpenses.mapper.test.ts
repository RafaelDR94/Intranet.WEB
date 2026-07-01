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
});
