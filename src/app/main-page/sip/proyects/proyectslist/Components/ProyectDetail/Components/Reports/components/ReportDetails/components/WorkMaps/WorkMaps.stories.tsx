import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import WorkMaps from "./WorkMaps";
import { createSampleReport, sampleReports } from "../../../../testUtils/reportFixtures";
import { ReportsStoryProvider } from "../../../../testUtils/ReportsStoryProvider";

const meta: Meta<typeof WorkMaps> = {
  title: "MAINPAGE/SIP/Proyects/ProyectDetail/Reports/ReportDetails/WorkMaps",
  component: WorkMaps,
  decorators: [
    (Story) => (
      <ReportsStoryProvider initialReport={sampleReports[0]}>
        <Story />
      </ReportsStoryProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof WorkMaps>;

export const Default: Story = {
  render: () => <WorkMaps />,
};

const noMapsReport = createSampleReport({
  id: "REP-no-maps",
  maps: [],
});

export const Empty: Story = {
  render: () => (
    <ReportsStoryProvider initialReport={noMapsReport} reports={[noMapsReport]}>
      <WorkMaps />
    </ReportsStoryProvider>
  ),
};
