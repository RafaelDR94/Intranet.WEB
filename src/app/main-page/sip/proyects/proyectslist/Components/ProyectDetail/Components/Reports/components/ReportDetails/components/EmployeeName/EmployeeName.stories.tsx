import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import EmployeeName from "./EmployeeName";
import { createSampleReport, sampleReports } from "../../../../testUtils/reportFixtures";
import { ReportsStoryProvider } from "../../../../testUtils/ReportsStoryProvider";

const meta: Meta<typeof EmployeeName> = {
  title: "MAINPAGE/SIP/Proyects/ProyectDetail/Reports/ReportDetails/EmployeeName",
  component: EmployeeName,
  decorators: [
    (Story) => (
      <ReportsStoryProvider initialReport={sampleReports[0]}>
        <Story />
      </ReportsStoryProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof EmployeeName>;

export const Default: Story = {
  render: () => <EmployeeName />,
};

const fallbackPositionReport = createSampleReport({
  id: "REP-fallback-position",
  workposition: { workposition_id: "WP-X", name: "" },
});

export const FromEmployeePosition: Story = {
  render: () => (
    <ReportsStoryProvider initialReport={fallbackPositionReport} reports={[fallbackPositionReport]}>
      <EmployeeName />
    </ReportsStoryProvider>
  ),
};
