import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import WorkMaps from "./WorkMaps";
import { createSampleReport, sampleReports } from "../../../../testUtils/reportFixtures";
import { ReportsStoryProvider } from "../../../../testUtils/ReportsStoryProvider";

const meta: Meta<typeof WorkMaps> = {
  title: "MAINPAGE/SIP/Proyects/ProyectDetail/Reports/ReportDetails/WorkMaps",
  component: WorkMaps,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Galería de mapas de trabajo vinculada al reporte. Reutiliza `WorkMapCard` y obtiene los archivos desde `useReportsStore`, sincronizándose con la pestaña principal de mapas.",
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: "Renderiza los mapas configurados en el fixture base, incluyendo título, fecha y descripción.",
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: "Variación sin mapas para validar el estado vacío de la pestaña.",
      },
    },
  },
};

export const Mobile: Story = {
  render: () => <WorkMaps />,
  parameters: {
    viewport: { defaultViewport: "mobile2" },
    docs: {
      description: {
        story: "Las tarjetas se apilan y conservan la proporción de imagen al ejecutarse en un viewport móvil.",
      },
    },
  },
};
