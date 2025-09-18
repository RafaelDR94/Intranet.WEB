import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createSampleReport } from "../../../../../testUtils/reportFixtures";

import useInformation from "./useInformation";

let currentReportMock = createSampleReport();

vi.mock("@/app/stores/useReportsStore/useReportsStore", () => ({
  useReportsStore: (selector?: any) => {
    const state = { currentReport: currentReportMock };
    return typeof selector === "function" ? selector(state) : state;
  },
}));

describe("useInformation", () => {
  beforeEach(() => {
    currentReportMock = createSampleReport();
  });

  it("construye las tarjetas descriptivas del reporte", () => {
    const { result } = renderHook(() => useInformation());

    const labels = result.current.cards.flat().map((card) => card.label);
    expect(labels).toContain("Tipo de reporte");
    expect(labels).toContain("Ticket");
    expect(labels.join("|")).toMatch(/Cat/i);
    expect(labels.join("|")).toMatch(/Ubic/i);
    expect(labels.join("|")).toMatch(/Diagn/i);
    expect(labels.join("|")).toMatch(/Soluc/i);

    expect(result.current.cards[0][0].value).toBe("Servicio");
    expect(result.current.cards[0][1].value).toBe(currentReportMock.ticket);
    expect(result.current.cards[1][0].value).toBe("2024/05/01");
    expect(result.current.progressPct).toBe(75);
  });

  it("parsea valores percentuales contenidos en cadenas", () => {
    currentReportMock = createSampleReport({ progress: "80%" });

    const { result } = renderHook(() => useInformation());
    expect(result.current.progressPct).toBe(80);
  });

  it("regresa valores vacios cuando no hay reporte activo", () => {
    currentReportMock = null as any;

    const { result } = renderHook(() => useInformation());
    expect(result.current.cards).toEqual([]);
    expect(result.current.progressPct).toBe(0);
  });
});
