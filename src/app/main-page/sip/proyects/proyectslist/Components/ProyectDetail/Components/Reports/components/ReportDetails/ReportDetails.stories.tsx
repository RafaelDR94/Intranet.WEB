import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import ReportDetails from "./ReportDetails";
import { sampleReports } from "../../testUtils/reportFixtures";
import { ReportsStoryProvider } from "../../testUtils/ReportsStoryProvider";

const meta: Meta<typeof ReportDetails> = {
  title: "MAINPAGE/SIP/Proyects/ProyectDetail/Reports/ReportDetails",
  component: ReportDetails,
  decorators: [
    (Story) => (
      <ReportsStoryProvider initialReport={sampleReports[0]}>
        <Story />
      </ReportsStoryProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ReportDetails>;

export const Default: Story = {
  render: () => <ReportDetails />,
};
