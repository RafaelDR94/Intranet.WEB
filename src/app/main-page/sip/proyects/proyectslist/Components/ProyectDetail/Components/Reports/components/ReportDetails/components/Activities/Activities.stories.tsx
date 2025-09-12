import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Activities from "./Activities";
import { createSampleReport, sampleReports } from "../../../../testUtils/reportFixtures";
import { ReportsStoryProvider } from "../../../../testUtils/ReportsStoryProvider";

const meta: Meta<typeof Activities> = {
  title: "MAINPAGE/SIP/Proyects/ProyectDetail/Reports/ReportDetails/Activities",
  component: Activities,
  decorators: [
    (Story) => (
      <ReportsStoryProvider initialReport={sampleReports[0]}>
        <Story />
      </ReportsStoryProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Activities>;

export const Default: Story = {
  render: () => <Activities />,
};

const emptyActivitiesReport = createSampleReport({
  id: "REP-empty-activities",
  activities: [],
});

export const Empty: Story = {
  render: () => (
    <ReportsStoryProvider initialReport={emptyActivitiesReport} reports={[emptyActivitiesReport]}>
      <Activities />
    </ReportsStoryProvider>
  ),
};
