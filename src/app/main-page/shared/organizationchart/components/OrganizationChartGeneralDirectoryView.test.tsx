import React from "react";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { DataTableProps } from "@/app/components/DataTable/types";
import type { EmployeeType } from "@/app/mappings/employees/employee.types";
import type { OrganizationChartRouteConfig } from "../types";
import OrganizationChartGeneralDirectoryView from "./OrganizationChartGeneralDirectoryView";

type DirectoryRow = {
  id: string;
  fullname: string;
  position: string;
  phone_number: string;
  email: string;
  department: string;
  image_url: string;
  employee: EmployeeType;
};

const DataTable = vi.hoisted(() =>
  vi.fn((_props: DataTableProps<DirectoryRow>) => <div>DataTableMock</div>),
);

const useEmployeesStore = vi.hoisted(() => vi.fn());
const useAuth = vi.hoisted(() => vi.fn());
const useRouter = vi.hoisted(() => vi.fn(() => ({ push: vi.fn() })));

vi.mock("@/app/components/DataTable/DataTable", () => ({
  DataTable,
}));

vi.mock("@/app/stores/useEmployeesStore/useEmployeesStore", () => ({
  useEmployeesStore: (selector: (state: unknown) => unknown) =>
    selector(useEmployeesStore()),
}));

vi.mock("@/app/context/AuthContext/AuthContext", () => ({
  useAuth: () => useAuth(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => useRouter(),
}));

vi.mock(
  "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery",
  () => ({
    useIsMobile: () => false,
  }),
);

const routeConfig: OrganizationChartRouteConfig = {
  basePath: "/main-page/organigrama",
  capabilities: {
    canCreate: false,
    canUpdate: false,
    canDelete: false,
  },
};

describe("OrganizationChartGeneralDirectoryView", () => {
  beforeEach(() => {
    DataTable.mockClear();
    useEmployeesStore.mockReset();
    useAuth.mockReset();
    useRouter.mockReset();
    useRouter.mockReturnValue({ push: vi.fn() });
    useAuth.mockReturnValue({
      currentPagePermissions: {
        canSeeDetails: true,
        canSeeInformation: true,
        update: true,
        delete: true,
      },
    });
  });

  it("forces read-only columns when capabilities disable mutations", () => {
    const employee = {
      id: "emp-1",
      employee_id: "emp-1",
      employee_number: "30000",
      firstname: "Ana",
      secondname: "",
      lastname: "Lopez",
      motherlast_name: "",
      gender: "F",
      email: "ana.lopez@drsecurity.net",
      phone_number: "5555555555",
      extension: "",
      image_url: "https://cdn.example.com/avatar.png",
      manager_id: "",
      manager_name: "",
      department: {
        department_id: "dep-1",
        name: "Desarrollo",
        enterprise_id: "ent-1",
        enterprice_name: "ITEDESCA",
      },
      workposition: { workposition_id: "pos-1", name: "Lead Desarrollo" },
      user: null,
      is_active: true,
      is_gerence: false,
      dr_fingerprint: false,
      fullname: "Ana Lopez",
      gtstype: undefined,
      workposition_name: "",
      employee_phone: "",
      employee_email: "",
    } satisfies EmployeeType;

    useEmployeesStore.mockReturnValue({
      activeEmployees: [employee],
      loadingActive: false,
      error: undefined,
      fetchActiveEmployees: vi.fn(),
    });

    render(<OrganizationChartGeneralDirectoryView routeConfig={routeConfig} />);

    const props = DataTable.mock.calls[0][0] as DataTableProps<DirectoryRow>;
    expect(
      props.tables[0].columns.some((column) => String(column.key) === "actions"),
    ).toBe(false);
  });
});
