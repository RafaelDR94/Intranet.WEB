import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Signatures from "./Signatures";
import { createSampleReport, sampleReports } from "../../../../testUtils/reportFixtures";
import { ReportsStoryProvider } from "../../../../testUtils/ReportsStoryProvider";

const meta: Meta<typeof Signatures> = {
  title: "MAINPAGE/SIP/Proyects/ProyectDetail/Reports/ReportDetails/Signatures",
  component: Signatures,
  decorators: [
    (Story) => (
      <ReportsStoryProvider initialReport={sampleReports[0]}>
        <Story />
      </ReportsStoryProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Signatures>;

export const Default: Story = {
  render: () => <Signatures />,
};

const missingClientSignature = createSampleReport({
  id: "REP-no-client-sign",
  clientsign: {},
});

export const OnlyEmployee: Story = {
  render: () => (
    <ReportsStoryProvider initialReport={missingClientSignature} reports={[missingClientSignature]}>
      <Signatures />
    </ReportsStoryProvider>
  ),
};
