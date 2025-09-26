import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Information from "./Information";
import { createSampleReport, sampleReports } from "../../../../testUtils/reportFixtures";
import { ReportsStoryProvider } from "../../../../testUtils/ReportsStoryProvider";

const meta: Meta<typeof Information> = {
  title: "MAINPAGE/SIP/Proyects/ProyectDetail/Reports/ReportDetails/Information",
  component: Information,
  decorators: [
    (Story) => (
      <ReportsStoryProvider initialReport={sampleReports[0]}>
        <Story />
      </ReportsStoryProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Information>;

export const Default: Story = {
  render: () => <Information />,
};

const minimalReport = createSampleReport({
  id: "REP-minimal",
  model: {
    maps: false,
    diagnostic: false,
    solution: false,
    refactions: false,
    clientsign: true,
    ticket: true,
  },
  diagnostic: "",
  solution: "",
});

export const Minimal: Story = {
  render: () => (
    <ReportsStoryProvider initialReport={minimalReport} reports={[minimalReport]}>
      <Information />
    </ReportsStoryProvider>
  ),
};
