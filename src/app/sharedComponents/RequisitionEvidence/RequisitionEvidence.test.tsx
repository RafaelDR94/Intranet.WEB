import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { RequisitionEvidence } from "./RequisitionEvidence";

vi.mock("@/app/context/PrincipalContext/PrincipalContext", () => ({
  usePrincipal: () => ({
    usePrincipalImage: { showImage: vi.fn() },
  }),
}));

describe("RequisitionEvidence", () => {
  it("renders each read-only evidence image as a link", () => {
    render(
      <RequisitionEvidence
        imageUrls={["https://files.example/evidence-1.png", "  "]}
      />,
    );
    const image = screen.getByRole("img", { name: "Evidencia de Broxel 1" });
    expect(image).toHaveAttribute(
      "src",
      "https://files.example/evidence-1.png",
    );
    expect(image.closest("a")).toHaveAttribute(
      "href",
      "https://files.example/evidence-1.png",
    );
  });

  it("does not render an empty read-only section", () => {
    const { container } = render(<RequisitionEvidence imageUrls={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("centers the edit upload prompt and image-selection button", () => {
    render(<RequisitionEvidence imageUrls={[]} mode="edit" />);

    const prompt = screen.getByText(
      /Arrastra o selecciona las im.genes que deseas subir/,
    );
    const dropzone = prompt.parentElement;

    expect(dropzone).toHaveClass(
      "flex",
      "flex-col",
      "items-center",
      "justify-center",
      "text-center",
    );
    expect(
      screen.getByRole("button", { name: "Seleccionar imagen" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Enviar evidencia" }),
    ).not.toBeInTheDocument();
  });
});
