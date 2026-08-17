import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import useInternalDevicesAsignationTable from "./useInternalDevicesAsignationTable";

vi.mock("@/app/context/AuthContext/AuthContext", () => ({
  useAuth: () => ({
    currentPagePermissions: {
      viewDeviceAssignmentDetails: true,
    },
  }),
}));

describe("useInternalDevicesAsignationTable", () => {
  it("exposes assignment dates for calendar filtering", () => {
    const { result } = renderHook(() =>
      useInternalDevicesAsignationTable({
        deviceAssignments: [
          {
            device_assigment_id: "assignment-1",
            description: "Equipo nuevo",
            observations: "",
            delivery_condition: "Monitor portatil",
            device_id: "device-1",
            employee_id: "employee-1",
            assigned: true,
            date: "2026-08-17T10:00:00",
          },
          {
            device_assigment_id: "assignment-2",
            description: "Equipo usado",
            observations: "",
            delivery_condition: "Mouse",
            device_id: "device-2",
            employee_id: "employee-2",
            assigned: true,
            created_at: "2026-08-16T10:00:00",
          },
        ],
        deviceById: new Map(),
        employeeById: new Map(),
        isMobile: false,
        canRegenerateResponsive: false,
        processingResponsiveAssignmentId: null,
        onOpenDetails: vi.fn(),
        onOpenResponsive: vi.fn(),
        onRegenerateResponsive: vi.fn(),
      }),
    );

    expect(result.current.rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          assignment_id: "assignment-1",
          assignment_date: "2026-08-17T10:00:00",
        }),
        expect.objectContaining({
          assignment_id: "assignment-2",
          assignment_date: "2026-08-16T10:00:00",
        }),
      ]),
    );
  });
});
