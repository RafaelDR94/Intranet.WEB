import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import LinearLevel from "./LinearLevel";

const meta: Meta<typeof LinearLevel> = {
  title: "Components/ControlLevel/LinearLevel",
  component: LinearLevel,
  tags: ["autodocs"],
  argTypes: {
    setLevel: { control: false },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof LinearLevel>;

const Template: Story = {
  render: (args) => {
    const { min = 0 } = args;
    const initialLevel = typeof args.level === "number" ? args.level : min;
    const [value, setValue] = React.useState(initialLevel);

    React.useEffect(() => {
      if (typeof args.level === "number") {
        setValue(args.level);
      }
    }, [args.level]);

    return (
      <div style={{ width: "320px" }}>
        <LinearLevel {...args} level={value} setLevel={setValue} />
        <p style={{ marginTop: "0.75rem", textAlign: "center" }}>
          Valor actual: {value.toFixed(args.decimals ?? 2)}
        </p>
      </div>
    );
  },
  args: {
    min: 0,
    max: 1,
    divisions: 4,
    level: 0.5,
    labelMode: "fraction",
    decimals: 2,
  },
};

export const Basic: Story = {
  ...Template,
};

export const CustomColors: Story = {
  ...Template,
  args: {
    ...Template.args,
    trackClass: "bg-gray-40",
    fillClass: "bg-blue-80",
    dotActiveClass: "bg-blue-100",
    dotInactiveClass: "bg-blue-40",
  },
};

export const ExtendedRange: Story = {
  ...Template,
  args: {
    ...Template.args,
    min: 10,
    max: 50,
    level: 25,
    divisions: 8,
    labelMode: "number",
    decimals: 0,
  },
};

