import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Refactions from "./Refactions";
import { createSampleReport, sampleReports } from "../../../../testUtils/reportFixtures";
import { ReportsStoryProvider } from "../../../../testUtils/ReportsStoryProvider";

const meta: Meta<typeof Refactions> = {
  title: "MAINPAGE/SIP/Proyects/ProyectDetail/Reports/ReportDetails/Refactions",
  component: Refactions,
  decorators: [
    (Story) => (
      <ReportsStoryProvider initialReport={sampleReports[0]}>
        <Story />
      </ReportsStoryProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Refactions>;

export const Default: Story = {
  render: () => <Refactions />,
};

export const Compact: Story = {
  render: () => (
    <div style={{ width: 600 }}>
      <ReportsStoryProvider initialReport={sampleReports[0]}>
        <Refactions />
      </ReportsStoryProvider>
    </div>
  ),
};

const noRefactionsReport = createSampleReport({
  id: "REP-no-refactions",
  refactions: [],
});

export const Empty: Story = {
  render: () => (
    <ReportsStoryProvider initialReport={noRefactionsReport} reports={[noRefactionsReport]}>
      <Refactions />
    </ReportsStoryProvider>
  ),
};
