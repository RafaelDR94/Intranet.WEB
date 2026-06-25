import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { ContextualInfoForm } from "./ContextualInfoForm";

const meta: Meta<typeof ContextualInfoForm> = {
  title: "SharedComponents/ContextualInfoForm",
  component: ContextualInfoForm,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ContextualInfoForm>;

const values = {
  company: "DISITREK",
  projectCode: "PY-SEMAR-014",
  debtorCode: "00124",
  clientCode: "00345",
  startDate: "2026-05-10",
  endDate: "2026-05-15",
  assignedPerson: "Angel Vazquez",
};

const withTheme =
  (theme: "light" | "dark") => (StoryComp: React.ComponentType) => (
    <div data-theme={theme} className="bg-gray-10 min-h-60 p-6">
      <StoryComp />
    </div>
  );

export const Light: Story = {
  args: { values },
  decorators: [withTheme("light")],
};

export const Dark: Story = {
  args: { values },
  decorators: [withTheme("dark")],
};

export const RequisitionVariant: Story = {
  args: {
    values,
    variant: "requisition",
  },
  decorators: [withTheme("light")],
};
