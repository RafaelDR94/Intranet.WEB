import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import React from "react";

import CardsGrid from "./CardsGrid";
import type { CardsGridProps } from "./types";

const MOCK_DATA = Array.from({ length: 12 }, (_, idx) => ({
  id: String(idx + 1),
  title: `Tarjeta ${idx + 1}`,
  description: "Resumen rapido de la tarjeta",
  image: idx % 3 === 0 ? "" : `https://via.placeholder.com/360x200.png?text=${idx + 1}`,
}));

const ADAPT: CardsGridProps<typeof MOCK_DATA[number]>["adapt"] = {
  titleKey: "title",
  descriptionKey: "description",
  imageKey: "image",
  labelKey: row => `ID ${row.id}`,
  onPrimaryAction: action("onPrimaryAction"),
  onSecondaryAction: action("onSecondaryAction"),
  showSecondaryButton: true,
  primaryLabel: "Ver",
  secondaryLabel: "Cancelar",
};

const meta: Meta<typeof CardsGrid<any>> = {
  title: "Components/CardsGrid",
  component: CardsGrid as any,
  tags: ["autodocs"],
  args: {
    data: MOCK_DATA,
    adapt: ADAPT,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Grilla de tarjetas que ajusta columnas segun el breakpoint actual. " +
          "Prueba reduciendo el ancho del panel para ver como cambia la distribucion.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof CardsGrid<any>>;

export const Default: Story = {};

export const PocasTarjetas: Story = {
  args: {
    data: MOCK_DATA.slice(0, 3),
  },
};

export const SinSecundario: Story = {
  args: {
    adapt: {
      ...ADAPT,
      onSecondaryAction: undefined,
      showSecondaryButton: false,
    },
  },
};
