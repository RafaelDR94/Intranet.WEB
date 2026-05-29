import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ContextualInfoForm } from "./ContextualInfoForm";

const useSearchParamsMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useSearchParams: () => useSearchParamsMock(),
}));

describe("ContextualInfoForm", () => {
  beforeEach(() => {
    useSearchParamsMock.mockReturnValue(new URLSearchParams());
  });

  it("renders controlled values", async () => {
    render(
      <ContextualInfoForm
        values={{
          company: "DISITREK",
          projectCode: "PY-SEMAR-014",
          debtorCode: "00124",
          clientCode: "00345",
          startDate: "2026-05-10",
          endDate: "2026-05-15",
          assignedPerson: "Angel Vazquez",
        }}
      />,
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("DISITREK")).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue("PY-SEMAR-014")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2026-05-10")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Angel Vazquez")).toBeInTheDocument();
  });

  it("reads values and variant from query params", async () => {
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams(
        "formVariant=requisition&empresa=DR&idEmployee=E-1&projectCode=PY-1&startDate=2026-01-02&endDate=2026-01-03&employeeName=Bruno",
      ),
    );

    render(<ContextualInfoForm />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("DR")).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue("PY-1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("E-1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2026-01-02")).toBeInTheDocument();
    expect(screen.queryByText("Codigo de cliente")).not.toBeInTheDocument();
  });

  it("uses custom variants when supplied", async () => {
    render(
      <ContextualInfoForm
        variant="minimal"
        values={{ company: "DISITREK", projectCode: "PY-SEMAR-014" }}
        variants={{
          minimal: {
            fields: [
              { id: "company", label: "Empresa" },
              { id: "projectCode", label: "Proyecto" },
            ],
          },
        }}
      />,
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("DISITREK")).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue("PY-SEMAR-014")).toBeInTheDocument();
    expect(screen.queryByText("Codigo de deudor")).not.toBeInTheDocument();
  });
});
