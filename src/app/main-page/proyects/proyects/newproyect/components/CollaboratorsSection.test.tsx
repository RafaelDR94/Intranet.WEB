import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CollaboratorsSection from "./CollaboratorsSection";

vi.mock("@/assets/icons/organization/search.svg", () => ({
  default: () => <span data-testid="search-icon" />,
}));

vi.mock("@/app/components/Avatar/Avatar", () => ({
  __esModule: true,
  default: ({ alt, initials }: { alt: string; initials: string }) => (
    <div data-testid="avatar" data-alt={alt} data-initials={initials} />
  ),
}));

describe("CollaboratorsSection", () => {
  it("muestra el estado base sin encabezados cuando no hay colaboradores", () => {
    render(
      <CollaboratorsSection
        pendingCollaboratorId=""
        collaboratorOptions={[]}
        collaboratorRows={[]}
        setPendingCollaboratorId={vi.fn()}
        addCollaborator={vi.fn()}
        removeCollaborator={vi.fn()}
      />
    );

    expect(screen.getByText("Colaboradores")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Buscar colaborador")).toBeInTheDocument();
    expect(screen.queryByText("Nombre")).not.toBeInTheDocument();
  });

  it("filtra opciones, selecciona una y habilita agregar", () => {
    const setPendingCollaboratorId = vi.fn();
    const addCollaborator = vi.fn();

    render(
      <CollaboratorsSection
        pendingCollaboratorId=""
        collaboratorOptions={[
          { label: "Bruno Mendoza", value: "user-1" },
          { label: "Rafael Gomez", value: "user-2" },
        ]}
        collaboratorRows={[]}
        setPendingCollaboratorId={setPendingCollaboratorId}
        addCollaborator={addCollaborator}
        removeCollaborator={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText("Buscar colaborador");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Bruno" } });

    fireEvent.mouseDown(screen.getByText("Bruno Mendoza"));

    expect(setPendingCollaboratorId).toHaveBeenCalledWith("user-1");
    expect(screen.getByDisplayValue("Bruno Mendoza")).toBeInTheDocument();
  });

  it("renderiza filas y ejecuta quitar colaborador", () => {
    const removeCollaborator = vi.fn();

    render(
      <CollaboratorsSection
        pendingCollaboratorId=""
        collaboratorOptions={[]}
        collaboratorRows={[
          {
            id: "user-1",
            fullname: "Bruno Mendoza",
            workPosition: "Lead Frontend",
            phone: "55 5555 5555",
            email: "bruno.mendoza@drsecurity.net",
            avatarSrc: "",
            avatarInitials: "BM",
          },
        ]}
        setPendingCollaboratorId={vi.fn()}
        addCollaborator={vi.fn()}
        removeCollaborator={removeCollaborator}
      />
    );

    expect(screen.getByText("Nombre")).toBeInTheDocument();
    expect(screen.getAllByText("Lead Frontend")).toHaveLength(2);

    fireEvent.click(screen.getAllByText("Quitar colaborador")[0]);

    expect(removeCollaborator).toHaveBeenCalledWith("user-1");
  });
});
