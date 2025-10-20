import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import SemicircleLevel from "./SemiCircle";

const meta: Meta<typeof SemicircleLevel> = {
  title: "Components/ControlLevel/SemicircleLevel",
  component: SemicircleLevel,
  tags: ["autodocs"],
  argTypes: {
    setLevel: { control: false },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof SemicircleLevel>;

const Template: Story = {
  render: (args) => {
    const { min = 0, max = 1, divisions = 4, decimals = 2 } = args;
    const initialLevel = typeof args.level === "number" ? args.level : min;
    const [value, setValue] = React.useState(initialLevel);

    React.useEffect(() => {
      if (typeof args.level === "number") {
        setValue(args.level);
      }
    }, [args.level]);

    const formatLabel = () => {
      if (args.labelMode === "number") {
        return value.toFixed(decimals);
      }

      const step = (max - min) / divisions;
      if (step === 0) return "0";
      const index = Math.round((value - min) / step);
      if (index <= 0) return "0";
      if (index >= divisions) return "1";
      return `${index}/${divisions}`;
    };

    const label = formatLabel();

    return (
      <div style={{ width: "360px" }}>
        <SemicircleLevel
          {...args}
          level={value}
          setLevel={setValue}
          label={label}
        />
        <p style={{ marginTop: "0.75rem", textAlign: "center" }}>
          Valor actual: {label}
        </p>
      </div>
    );
  },
  args: {
    min: 0,
    max: 1,
    divisions: 4,
    level: 0.5,
    label: "2/4",
    labelMode: "fraction",
    decimals: 2,
  },
};

export const Basic: Story = {
  ...Template,
};

export const NumberLabel: Story = {
  ...Template,
  args: {
    ...Template.args,
    min: 0,
    max: 100,
    level: 60,
    label: "60.0",
    labelMode: "number",
    decimals: 1,
  },
};

export const CustomPalette: Story = {
  ...Template,
  args: {
    ...Template.args,
    backgroundClass: "text-gray-50",
    activeClasses: ["text-amber-90", "text-amber-70"],
    hubClass: "text-amber-100",
    level: 0.75,
    label: "3/4",
  },
};

