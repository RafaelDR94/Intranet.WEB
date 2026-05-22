import React from "react";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import OrganigramaDepartmentsPage from "./page";

const replaceMock = vi.hoisted(() => vi.fn());
const mockSearchParams = vi.hoisted(
  () =>
    new URLSearchParams(
      "view=create&sourceDepartmentId=dep-1&sourceDepartmentLabel=TI",
    ),
);

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
  useSearchParams: () => mockSearchParams,
}));

vi.mock(
  "@/app/main-page/shared/organizationchart/components/OrganizationChartDepartmentsView",
  () => ({
    __esModule: true,
    default: () => <div>DepartmentsViewMock</div>,
  }),
);

describe("OrganigramaDepartmentsPage", () => {
  beforeEach(() => {
    replaceMock.mockClear();
  });

  it("normalizes create view back to the visual department detail route", () => {
    render(<OrganigramaDepartmentsPage />);

    expect(replaceMock).toHaveBeenCalledWith(
      "/main-page/organigrama/departments?view=detail&id=dep-1&label=TI&force=true",
    );
  });
});
