import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import React from "react";
import { vi } from "vitest";

import type { ManagementDocumentTableRow } from "@/app/mappings/documents/documents.types";

import DocumentActionsMenuCell from "./DocumentActionsMenuCell";
import type { DocumentActionsMenuCellProps } from "./types";

const mockUseAuth = vi.fn();
const mockUseIsMobile = vi.fn(() => false);

vi.mock("@/app/context/AuthContext/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock(
  "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery",
  () => ({
    useIsMobile: () => mockUseIsMobile(),
  }),
);

const SAMPLE_ROW: ManagementDocumentTableRow = {
  id: "42",
  name: "Reglamento interno",
  code: "HR-42",
  description: "Documento de ejemplo para Storybook",
  datecreated: "2025-10-25",
  documentType: "Reglamento",
  department: "Recursos Humanos",
  extension: "pdf",
  route: "/reglamentos/hr-42.pdf",
  date: "2025-10-25",
};

type StoryArgs = DocumentActionsMenuCellProps & {
  /** Permite simular el ancho de pantalla usado por el menú contextual. */
  isMobile?: boolean;
  /** Controla si el usuario cuenta con permiso de detalle. */
  allowView?: boolean;
  /** Controla si el usuario cuenta con permiso de eliminación. */
  allowDelete?: boolean;
  /** Tema visual aplicado al contenedor de la historia. */
  theme?: "light" | "dark";
};

const meta: Meta<StoryArgs> = {
  title: "MainPage/HumanResources/Documents/DocumentActionsMenuCell",
  component: DocumentActionsMenuCell,
  tags: ["autodocs"],
  argTypes: {
    isMobile: {
      control: { type: "boolean" },
      description: "Alterna el icono del trigger entre móvil (flecha) y escritorio (tres puntos).",
    },
    allowView: {
      control: { type: "boolean" },
      description: "Permite habilitar o deshabilitar la acción de ver detalle.",
    },
    allowDelete: {
      control: { type: "boolean" },
      description: "Permite habilitar o deshabilitar la acción de eliminar.",
    },
    theme: {
      control: { type: "radio" },
      options: ["light", "dark"],
      description: "Tema aplicado al contenedor de la historia.",
    },
    row: { table: { disable: true } },
    onView: { table: { disable: true } },
    onDelete: { table: { disable: true } },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Celda de acciones utilizada en las tablas de documentos de Recursos Humanos. " +
          "Muestra las acciones disponibles de acuerdo con los permisos otorgados al usuario.",
      },
    },
  },
  args: {
    row: SAMPLE_ROW,
    onView: action("onView"),
    onDelete: action("onDelete"),
    isMobile: false,
    allowView: true,
    allowDelete: true,
    theme: "light",
  },
  render: args => {
    const { isMobile, allowView, allowDelete, theme, ...componentProps } = args;
    mockUseIsMobile.mockReturnValue(Boolean(isMobile));
    mockUseAuth.mockReturnValue({
      currentPagePermissions: {
        details: allowView ?? true,
        delete: allowDelete ?? true,
      },
    });

    return (
      <div data-theme={theme} style={{ padding: "1.5rem", maxWidth: "18rem" }}>
        <DocumentActionsMenuCell {...componentProps} />
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<StoryArgs>;

export const Default: Story = {};

export const DarkMode: Story = {
  args: {
    theme: "dark",
    isMobile: true,
  },
};

export const SoloLectura: Story = {
  name: "Sin permisos de eliminación",
  args: {
    allowDelete: false,
  },
};
