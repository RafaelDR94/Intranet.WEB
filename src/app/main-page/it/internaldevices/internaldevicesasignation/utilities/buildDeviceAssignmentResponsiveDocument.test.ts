import { describe, expect, it } from "vitest";

import type { EmployeeType } from "@/app/mappings/employees/employee.types";
import type {
  InternalDevice,
  InternalDeviceAssignment,
} from "@/app/mappings/internaldevices/internaldevices.types";
import type {
  DataChart,
  ListElement,
  SingleElement,
} from "@/app/utilities/PDF/types";

import { buildDeviceAssignmentResponsiveDocument } from "./buildDeviceAssignmentResponsiveDocument";

const device = {
  device_id: "device-1",
  name: "Laptop de prueba",
  model: "",
  serial_number: "SN-001",
  ip_address: "",
  mac_address: "",
  mac_wifi_address: "",
  operating_system: "",
  charge_sn: "",
  description: "",
  low_motive: "",
  assigned: true,
  device_type: null,
  device_brand: null,
  device_status: null,
  device_proyect: null,
  is_active: true,
  reviewed: false,
  lowdate: null,
  lowuser: null,
  assurance: "",
  enterprise: null,
} as InternalDevice;

const assignment = {
  device_assigment_id: "assignment-1",
  observations: "",
  delivery_condition: "",
  device_id: "device-1",
  employee_id: "employee-1",
  date: "2026-07-22T12:00:00Z",
} as InternalDeviceAssignment;

const employee = {
  fullname: "Andrea Prueba",
  department: { name: "VIP Ingeniería" },
  workposition: { name: "Soporte" },
} as EmployeeType;

const findDataChart = (
  document: ReturnType<typeof buildDeviceAssignmentResponsiveDocument>,
  title: string,
) =>
  document.pages[0].elements.find(
    (element): element is DataChart =>
      "data" in element && element.title === title,
  );

describe("buildDeviceAssignmentResponsiveDocument", () => {
  it("uses VIP content and excludes empty device fields", () => {
    const document = buildDeviceAssignmentResponsiveDocument({
      assignment,
      device,
      employee,
      membret: "VIP",
    });

    expect(document.pages[0].headerBox?.docKey).toBe("CLAVE VIP-ING");
    expect(
      document.pages[0].elements.some(
        (element) => "data" in element && element.title === "Observaciones",
      ),
    ).toBe(false);
    expect(findDataChart(document, "Descripcion del equipo")?.data).toEqual([
      { label: "S/N", text: "SN-001", fullWidth: false },
    ]);

    const intro = document.pages[0].elements.find(
      (element): element is SingleElement => "text" in element,
    );
    const rules = document.pages[0].elements.find(
      (element): element is ListElement => "items" in element,
    );

    expect(intro?.text).toContain("VIP INGENIERIA");
    expect(rules?.items[1]).toContain("Soporte Interno de VIP ingenieria");
  });
});
