import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import React from "react";

import { ActionMenuCellView } from "./ActionMenuCell";
import type { ActionMenuPermissions } from "./types";

const ROW = { id: "1", name: "Proyecto X" };

const baseActions = {
  onEdit: action("onEdit"),
  onDelete: action("onDelete"),
};

const meta: Meta<typeof ActionMenuCellView<any>> = {
  title: "Components/ActionMenuCell",
  component: ActionMenuCellView as any,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Celda reutilizable que muestra un menu contextual con acciones de detalle/edicion y eliminacion. " +
          "Las historias usan la variante `ActionMenuCellView` para evitar dependencias de contexto.",
      },
    },
  },
  argTypes: {
    permissions: {
      control: { type: "object" },
      description: "Permisos que determinan las opciones visibles en el menu.",
    },
    isMobile: {
      control: { type: "boolean" },
      description: "Fuerza el icono del trigger en modo mobile (flecha) o desktop (tres puntos).",
    },
  },
  render: args => (
    <div style={{ padding: "1.5rem", maxWidth: 360 }} data-theme="light">
      <ActionMenuCellView {...args} />
    </div>
  ),
};
export default meta;

type Story = StoryObj<typeof ActionMenuCellView<any>>;

const defaultPermissions: ActionMenuPermissions = { details: true, delete: true };

export const Default: Story = {
  args: {
    row: ROW,
    ...baseActions,
    permissions: defaultPermissions,
    isMobile: false,
  },
};

export const Mobile: Story = {
  args: {
    ...Default.args,
    isMobile: true,
  },
};

export const SoloEliminar: Story = {
  args: {
    ...baseActions,
    row: ROW,
    permissions: { delete: true },
    isMobile: false,
  },
};
