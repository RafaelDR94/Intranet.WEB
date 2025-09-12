import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Devices from "./Devices";
import { createSampleReport, sampleReports } from "../../../../testUtils/reportFixtures";
import { ReportsStoryProvider } from "../../../../testUtils/ReportsStoryProvider";

const meta: Meta<typeof Devices> = {
  title: "MAINPAGE/SIP/Proyects/ProyectDetail/Reports/ReportDetails/Devices",
  component: Devices,
  decorators: [
    (Story) => (
      <ReportsStoryProvider initialReport={sampleReports[0]}>
        <Story />
      </ReportsStoryProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Devices>;

export const Default: Story = {
  render: () => <Devices />,
};

const noDevicesReport = createSampleReport({
  id: "REP-no-devices",
  reportDeviceView: [],
});

export const WithoutReportDevices: Story = {
  render: () => (
    <ReportsStoryProvider initialReport={noDevicesReport} reports={[noDevicesReport]}>
      <Devices />
    </ReportsStoryProvider>
  ),
};
