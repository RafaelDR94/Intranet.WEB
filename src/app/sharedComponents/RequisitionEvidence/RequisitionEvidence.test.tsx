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

  it("shows the requisition comment and status above read-only evidence", () => {
    render(
      <RequisitionEvidence
        comment="Comentario de prueba"
        imageUrls={["https://files.example/evidence-1.png"]}
        status="Aprobada"
      />,
    );

    expect(
      screen.getByText("Comentario de prueba"),
    ).toBeInTheDocument();
    expect(screen.getByText("APROBADA")).toBeInTheDocument();
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("renders comment and status without evidence images", () => {
    render(
      <RequisitionEvidence
        comment="Sin comprobacion"
        imageUrls={[]}
        status="Pendiente"
      />,
    );

    expect(screen.getByText("Sin comprobacion")).toBeInTheDocument();
    expect(screen.getByText("PENDIENTE")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("centers the edit upload prompt and image-selection button", () => {
    render(
      <RequisitionEvidence
        comment="Solicita evidencia adicional"
        imageUrls={[]}
        mode="edit"
        status="Rechazada"
      />,
    );

    expect(screen.getByText("Solicita evidencia adicional")).toBeInTheDocument();
    expect(screen.getByText("RECHAZADA")).toBeInTheDocument();

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
