import { describe, expect, it } from "vitest";

import { findPendingVehicleReassignmentForEmployee } from "./useVehicleAssignamentPage";
import type { TransportAssignament } from "@/app/mappings/transport/transport.types";

describe("findPendingVehicleReassignmentForEmployee", () => {
  const baseAssignment: TransportAssignament = {
    vehicleassignments_id: "va-1",
    employee_id: "e-old",
    name: "OLD",
    transport: {
      transport_id: "t-1",
      brand: "Toyota",
      model: "X",
      UnitType: "D-CAB",
      plates: "AAA",
    },
    status: {
      status_id: "s-1",
      status: "En transito",
      description: "",
    },
    departure_date: "2026-03-18T10:00:00",
    arrival_date: "",
    destination: "Destino",
    signature_leader: null,
    signature_employee: null,
    vehicle_reassignment: [],
  };

  it("returns null when no reassignment", () => {
    expect(findPendingVehicleReassignmentForEmployee(baseAssignment, "e-1")).toBeNull();
  });

  it("returns latest pending for employee", () => {
    const assignment: TransportAssignament = {
      ...baseAssignment,
      vehicle_reassignment: [
        {
          id: "r1",
          id_vehicle_assignment: "va-1",
          id_previous_employee: "e-old",
          previous_employee_name: "OLD",
          id_new_employee: "e-1",
          new_employee_name: "NEW",
          id_status: "st-1",
          status: "Pendiente",
          comment: null,
          date_created: "2026-03-18T10:00:00.000",
        },
        {
          id: "r2",
          id_vehicle_assignment: "va-1",
          id_previous_employee: "e-old",
          previous_employee_name: "OLD",
          id_new_employee: "e-1",
          new_employee_name: "NEW",
          id_status: "st-1",
          status: "pendiente",
          comment: null,
          date_created: "2026-03-19T10:00:00.000",
        },
      ],
    };

    const found = findPendingVehicleReassignmentForEmployee(assignment, "e-1");
    expect(found?.id).toBe("r2");
  });

  it("ignores pending for other employee", () => {
    const assignment: TransportAssignament = {
      ...baseAssignment,
      vehicle_reassignment: [
        {
          id: "r1",
          id_vehicle_assignment: "va-1",
          id_previous_employee: "e-old",
          previous_employee_name: "OLD",
          id_new_employee: "e-2",
          new_employee_name: "NEW",
          id_status: "st-1",
          status: "Pendiente",
          comment: null,
          date_created: "2026-03-19T10:00:00.000",
        },
      ],
    };

    expect(findPendingVehicleReassignmentForEmployee(assignment, "e-1")).toBeNull();
  });
});
