import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ControlLevel } from "./ControlLevel";

const meta: Meta<typeof ControlLevel> = {
  title: "Components/ControlLevel",
  component: ControlLevel,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof ControlLevel>;

export const Default: Story = {
  args: {
    title: "Nivel de servicio",
    min: 0,
    max: 1,
    divisions: 4,
    initialValue: 0.5,
    showSemicircle: true,
    showLinear: true,
  },
};

export const NumberLabels: Story = {
  args: {
    title: "Nivel numérico",
    min: 0,
    max: 100,
    divisions: 5,
    labelMode: "number",
    decimals: 1,
    initialValue: 62.5,
    showSemicircle: true,
    showLinear: true,
  },
};

export const LinearOnly: Story = {
  args: {
    title: "Barra lineal",
    min: 0,
    max: 10,
    divisions: 5,
    initialValue: 3,
    showSemicircle: false,
    showLinear: true,
  },
};

