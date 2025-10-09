import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { CardsGridProps } from "./types";

Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 1080 });
window.dispatchEvent(new Event('resize'));

vi.mock("@/app/components/Card/Card", () => ({
  __esModule: true,
  Card: (props: any) => (
    <div
      data-testid={`card-${props.title}`}
      data-orientation={props.orientation}
      data-image={props.imageSrc}
      data-fallback={props.fallbackSrc}
    >
      <span>{props.title}</span>
      <button type="button" data-testid={`primary-${props.title}`} onClick={props.onAccept}>
        primary
      </button>
      {props.onCancel && (
        <button type="button" data-testid={`secondary-${props.title}`} onClick={props.onCancel}>
          secondary
        </button>
      )}
    </div>
  ),
}));

vi.mock("@/app/components/Pagination/Pagination", () => ({
  __esModule: true,
  default: ({ currentPage, onPageChange }: any) => (
    <div data-testid="pagination">
      <button type="button" onClick={() => onPageChange(currentPage + 1)}>
        next
      </button>
    </div>
  ),
}));

let mockedBreakpoint = { current: "lg", width: 1600 };
vi.mock("@/app/components/DynamicForm/hooks/useMediaBreakpoints", () => ({
  useMediaBreakpoints: () => mockedBreakpoint,
}));

let mockedIsMobile = false;
vi.mock("../DataTable/components/DataTableLayout/hooks/useMediaQuery", () => ({
  useIsMobile: () => mockedIsMobile,
}));

import CardsGrid from "./CardsGrid";

type SampleRow = {
  id: string;
  title: string;
  description?: string;
  image?: string;
};

const buildRows = (total: number): SampleRow[] =>
  Array.from({ length: total }, (_, idx) => ({
    id: String(idx + 1),
    title: `Item ${idx + 1}`,
    description: `Descripcion ${idx + 1}`,
    image: idx % 2 === 0 ? "" : `https://cdn.test/${idx + 1}.png`,
  }));

const baseAdapt: CardsGridProps<SampleRow>["adapt"] = {
  titleKey: "title",
  descriptionKey: "description",
  imageKey: "image",
  labelKey: row => `Label ${row.id}`,
  onPrimaryAction: vi.fn(),
  onSecondaryAction: vi.fn(),
  showSecondaryButton: true,
  secondaryLabel: "Cancelar",
  primaryLabel: "Ver",
};

describe("CardsGrid", () => {
  beforeEach(() => {
    mockedBreakpoint = { current: "lg", width: 1600 };
    mockedIsMobile = false;
    baseAdapt.onPrimaryAction.mockClear();
    baseAdapt.onSecondaryAction?.mockClear();
  });

  it("renderiza la primera pagina respetando fallback de imagenes", async () => {
    // 🔹 Forzar viewport alto (para asegurar 2 filas)
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 1080 });
    window.dispatchEvent(new Event('resize'));

    render(<CardsGrid data={buildRows(9)} adapt={baseAdapt} />);

    const cards = screen.getAllByTestId(/card-/);
    // ahora sí deben ser 8 (4 columnas x 2 filas)
    expect(cards).toHaveLength(8);

    const firstCard = screen.getByTestId("card-Item 1");
    expect(firstCard).toHaveAttribute("data-orientation", "vertical");
    expect(firstCard.getAttribute("data-image")).toBe(firstCard.getAttribute("data-fallback"));

    await userEvent.click(screen.getByTestId("primary-Item 1"));
    expect(baseAdapt.onPrimaryAction).toHaveBeenCalledWith(expect.objectContaining({ id: "1" }));
  });


  it("usa layout horizontal en mobile y expone accion secundaria", async () => {
    mockedIsMobile = true;

    render(<CardsGrid data={buildRows(3)} adapt={baseAdapt} />);

    const card = screen.getByTestId("card-Item 1");
    expect(card).toHaveAttribute("data-orientation", "horizontal");

    await userEvent.click(screen.getByTestId("secondary-Item 1"));
    expect(baseAdapt.onSecondaryAction).toHaveBeenCalledWith(expect.objectContaining({ id: "1" }));
  });

  it("avanza de pagina al interactuar con la paginacion", async () => {
    render(<CardsGrid data={buildRows(9)} adapt={baseAdapt} />);

    await userEvent.click(screen.getByText("next"));
    expect(screen.getByTestId("card-Item 9")).toBeInTheDocument();
  });
});
